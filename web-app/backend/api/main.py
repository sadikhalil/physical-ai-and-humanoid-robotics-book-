import os
import sys

# Add vendored dependencies to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'vendor')))

import json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional # Import Optional for generate_answer
from dotenv import load_dotenv
from passlib.context import CryptContext

import cohere
from qdrant_client import QdrantClient

# Add the project root to the Python path
# This is necessary for Vercel to find the 'rag' module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import the retrieve_context function
from rag.retriever import retrieve_context

load_dotenv()

# --- Client and Model Configuration ---

# Google Generative AI for generation
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")
genai.configure(api_key=api_key)
generation_model = genai.GenerativeModel('gemini-pro')

# Cohere Client for embedding (kept here for get_query_embedding if needed elsewhere)
cohere_client = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))
EMBEDDING_MODEL = "embed-english-v3.0"

# Qdrant Client for vector search (kept here for global access if needed)
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"), 
    api_key=os.getenv("QDRANT_API_KEY"),
)
COLLECTION_NAME = "humanoid ai book"


app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # Docusaurus dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- User Management ---

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

USERS_FILE = "users.json"

class User(BaseModel):
    username: str
    hashed_password: str
    software_background: str | None = None
    hardware_background: str | None = None

# Function to load users from file
def load_users() -> dict[str, User]:
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r") as f:
            data = json.load(f)
            # Deserialize User objects
            return {username: User(**user_data) for username, user_data in data.items()}
    return {}

# Function to save users to file
def save_users(users: dict[str, User]):
    with open(USERS_FILE, "w") as f:
        # Serialize User objects to dictionaries
        json.dump({username: user.dict() for username, user in users.items()}, f, indent=4)

# Load users database at startup
users_db: dict[str, User] = load_users()

class UserRegister(BaseModel):
    username: str
    password: str
    confirm_password: str
    software_background: str | None = None
    hardware_background: str | None = None

class UserLogin(BaseModel):
    username: str
    password: str

@app.post("/register")
async def register_user(user_data: UserRegister):
    if user_data.username in users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    if user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    hashed_password = pwd_context.hash(user_data.password)
    user = User(
        username=user_data.username,
        hashed_password=hashed_password,
        software_background=user_data.software_background,
        hardware_background=user_data.hardware_background
    )
    users_db[user.username] = user
    save_users(users_db) # Save users after registration
    return {"message": "User registered successfully"}

@app.post("/login")
async def login_user(user_data: UserLogin):
    user = users_db.get(user_data.username)
    if not user or not pwd_context.verify(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"message": "Login successful"}

# --- Translation Endpoint ---

class TranslationRequest(BaseModel):
    text: str

@app.post("/translate")
async def translate_text(request: TranslationRequest):
    try:
        prompt = f"Translate the following English text to Urdu: {request.text}"
        response = generation_model.generate_content(prompt)
        translated_text = response.text
        return {"translated_text": translated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- RAG Chatbot ---

class ChatRequest(BaseModel): # Renamed from QueryRequest to avoid confusion
    question: str

class ChatResponse(BaseModel): # Renamed from QueryResponse
    answer: str
    sources: List[str]

# Removed get_query_embedding and search_qdrant as they are replaced by retrieve_context

def generate_answer(question: str, context_chunks: Optional[List[dict]] = None) -> str:
    """
    Generates an answer using Google Generative AI based on the question and provided context.
    If no context is provided, answers directly from the LLM's general knowledge.
    """
    context = ""
    if context_chunks:
        context = "\n\n".join([chunk['text'] for chunk in context_chunks])
    
    if context:
        prompt = f"""
        You are a helpful assistant for the 'Physical AI & Humanoid Robotics' book.
        Answer the following question based *only* on the provided context.
        If the context does not contain the answer, say "I'm sorry, I don't have enough information to answer that question based on the book content."

        Question: {question}

        Context:
        ---
        {context}
        ---

        Answer:
        """
    else:
        prompt = f"""
        You are a helpful assistant for the 'Physical AI & Humanoid Robotics' book.
        Answer the following question to the best of your general knowledge. You do not have access to specific book content for this query.

        Question: {question}

        Answer:
        """
    
    try:
        response = generation_model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating answer with Google Generative AI: {e}")
        return "I'm sorry, there was an error generating the answer."

@app.post("/chat", response_model=ChatResponse) # Renamed to ChatRequest and ChatResponse
async def chat_endpoint(request: ChatRequest):
    """
    The main chatbot endpoint.
    Receives a question, retrieves relevant context from Qdrant, and generates a response.
    If no context is found, answers using general LLM knowledge.
    """
    print(f"Received question: {request.question}")
    
    retrieved_chunks = []
    try:
        # Retrieve relevant documents from Qdrant
        retrieved_chunks = retrieve_context(request.question, limit=3)
        print(f"Retrieved {len(retrieved_chunks)} chunks from Qdrant.")
    except Exception as e:
        print(f"Error during Qdrant retrieval: {e}. Attempting to answer without specific context.")
        # Proceed with empty chunks if retrieval fails
        
    # Generate an answer using the retrieved chunks or general knowledge
    answer = generate_answer(request.question, retrieved_chunks)
    
    # Get the sources of the retrieved chunks
    sources = []
    if retrieved_chunks:
        sources = list(set([chunk.get('url', 'N/A') for chunk in retrieved_chunks]))
    
    return ChatResponse(answer=answer, sources=sources)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)