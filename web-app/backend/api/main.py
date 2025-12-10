import os
import json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from passlib.context import CryptContext

import cohere
from qdrant_client import QdrantClient

load_dotenv()

# --- Client and Model Configuration ---

# Google Generative AI for generation
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")
genai.configure(api_key=api_key)
generation_model = genai.GenerativeModel('gemini-pro')

# Cohere Client for embedding
cohere_client = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))
EMBEDDING_MODEL = "embed-english-v3.0"

# Qdrant Client for vector search
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

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
    sources: List[str]

def get_query_embedding(query: str):
    """Generates an embedding for the user's query using Cohere."""
    response = cohere_client.embed(
        texts=[query],
        model=EMBEDDING_MODEL,
        input_type='search_query'
    )
    return response.embeddings[0]

def search_qdrant(query_embedding, limit: int = 3) -> List[dict]:
    """Searches Qdrant for the most similar documents to the query."""
    search_result = qdrant_client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_embedding,
        limit=limit,
        with_payload=True
    )
    return [hit.payload for hit in search_result]

def generate_answer(query: str, context_chunks: List[dict]) -> str:
    """Generates an answer using Google Generative AI based on the query and context."""
    
    context = "\n\n".join([chunk['text'] for chunk in context_chunks])
    
    prompt = f"""
    You are a helpful assistant for the 'Physical AI & Humanoid Robotics' book.
    Answer the following question based *only* on the provided context.
    If the context does not contain the answer, say "I'm sorry, I don't have enough information to answer that question."

    Question: {query}

    Context:
    ---
    {context}
    ---

    Answer:
    """
    
    try:
        response = generation_model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating answer with Google Generative AI: {e}")
        return "I'm sorry, there was an error generating the answer."

@app.post("/chat", response_model=QueryResponse)
async def chat_endpoint(request: QueryRequest):
    """
    The main chatbot endpoint.
    Receives a query, retrieves relevant context from Qdrant, and generates a response.
    """
    print(f"Received query: {request.query}")
    
    # 1. Embed the user's query
    query_embedding = get_query_embedding(request.query)
    
    # 2. Search Qdrant for relevant chunks
    retrieved_chunks = search_qdrant(query_embedding)
    
    # 3. Generate an answer using the retrieved chunks
    answer = generate_answer(request.query, retrieved_chunks)
    
    # 4. Get the sources of the retrieved chunks
    sources = list(set([chunk['url'] for chunk in retrieved_chunks])) # Use set to get unique URLs
    
    return QueryResponse(answer=answer, sources=sources)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)