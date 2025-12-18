import os
import sys

# Add the src directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional # Import Optional for generate_answer
from dotenv import load_dotenv
from passlib.context import CryptContext

import cohere
from qdrant_client import QdrantClient

# Import the retrieve_context function (semantic_search equivalent)
from rag.retriever import retrieve_context
# Import the website_retrieve_content function (website_search equivalent)
from rag.website_retriever import website_retrieve_content

load_dotenv()

# --- Client and Model Configuration ---

# Google Generative AI for generation
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")
genai.configure(api_key=api_key)
generation_model = genai.GenerativeModel('gemini-2.5-flash') # Changed from 'gemini-pro'

# Cohere Client for embedding (kept here for get_query_embedding if needed elsewhere)
cohere_client = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))
EMBEDDING_MODEL = "embed-english-v1"

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
    "https://sadiakhalil-book-backend.hf.space/ask" # Hugging Face Space URL for the backend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# NOTE: uvicorn.run binds the server to a specific host and port for internal access.
# The external URL (e.g., from Hugging Face Spaces) is typically handled by the
# deployment platform which proxies requests to the internally bound address.
# The `host="0.0.0.0"` allows the application to be accessible from outside the container,
# and `port=8000` is the internal port it listens on.

# --- User Management ---

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Construct an absolute path to users.json relative to this file's location
API_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_FILE = os.path.join(API_DIR, "users.json")

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
    password: str = Field(min_length=8, max_length=72)
    confirm_password: str = Field(min_length=8, max_length=72)
    software_background: str | None = None
    hardware_background: str | None = None

class UserLogin(BaseModel):
    username: str
    password: str = Field(min_length=8, max_length=72)

@app.post("/register")
async def register_user(user_data: UserRegister):
    if user_data.username in users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    if user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Truncate password to 72 bytes (for bcrypt compatibility)
    # Encode to bytes, truncate, then decode back to string as expected by passlib.hash()
    password_bytes = user_data.password.encode('utf-8')
    if len(password_bytes) > 72:
        # Find the character boundary closest to 72 bytes without splitting a multi-byte char
        truncated_password_bytes = password_bytes[:72]
        # Attempt to decode back to string. If it fails, try a shorter length.
        # This loop handles cases where 72 bytes might split a UTF-8 character.
        while True:
            try:
                truncated_password = truncated_password_bytes.decode('utf-8')
                break
            except UnicodeDecodeError:
                truncated_password_bytes = truncated_password_bytes[:-1] # Remove last byte and try again
                if not truncated_password_bytes: # Prevent infinite loop if string is too short
                    truncated_password = ""
                    break
    else:
        truncated_password = user_data.password

    hashed_password = pwd_context.hash(truncated_password) # Use the truncated password
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

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]

def generate_answer(question: str, context_chunks: Optional[List[dict]] = None, source_type: str = "") -> str:
    """
    Generates an answer using Google Generative AI based on the question and provided context,
    adhering strictly to the updated chatbot persona rules.
    """
    context = ""
    if context_chunks:
        # Assuming context_chunks is a list of dictionaries with a 'text' key
        context = "\n\n".join([chunk.get('text', '') for chunk in context_chunks])

    prompt = ""
    if context:
        # Scenario 1: Context is available.
        prompt = f"""
        You are a book-focused AI assistant. Your task is to answer questions strictly using content from a book.
        You have been provided with relevant book content.

        RULES:
        1. Answer strictly using ONLY the provided book content.
        2. NEVER mix book content and general knowledge in the same answer.
        3. If the provided content does NOT contain the answer to the question, respond exactly: "Information not found in the book."
        4. NEVER hallucinate or add facts not present in the retrieved content.
        5. Do NOT mention embeddings, Qdrant, or backend details.
        6. ALWAYS indicate the source of your answer at the end, using '{source_type}'.
        7. For non-book questions (greetings, meta questions like "hello", "who are you", "help"),
           answer directly without using the provided content. For example, if asked "hello", respond "Hello! How can I assist you with the book today?".

        Question: {question}

        Retrieved Content:
        ---
        {context}
        ---

        Answer:
        """
    else:
        # Scenario 2: No context is available.
        prompt = f"""
        You are a book-focused AI assistant. No relevant book content was found for the question.

        RULES:
        1. If the question is a greeting (e.g., "hello", "hi", "hey") or a meta-question about yourself
           (e.g., "who are you", "help"), respond politely and briefly as a book assistant.
           For example, if asked "hello", respond "Hello! How can I assist you with the book today?".
        2. For ALL other questions, since no book content was found, you MUST respond exactly: "Information not found in the book."
        3. NEVER use your general knowledge for book-related questions.
        4. Do NOT mention tools, retrieval process, embeddings, Qdrant, or backend details.

        Question: {question}

        Answer:
        """
    
    print("\n--- DEBUG: PROMPT SENT TO GENERATIVE MODEL ---\n")
    print(prompt)
    print("\n--- END OF PROMPT ---\n")

    try:
        response = generation_model.generate_content(prompt)
        final_answer = response.text.strip()
        print(f"--- DEBUG: GENERATED ANSWER ---\n{final_answer}\n--- END OF ANSWER ---\n")
        return final_answer
    except Exception as e:
        print(f"--- DEBUG: FATAL ERROR during answer generation ---")
        print(f"Exception Type: {type(e).__name__}")
        print(f"Exception Details: {e}")
        print("-------------------------------------------------")
        return "I'm sorry, there was an error generating the answer."

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    The main chatbot endpoint.
    Receives a question, orchestrates semantic_search and website_search, and generates a response.
    """
    print(f"--- NEW CHAT REQUEST ---")
    print(f"Received question: {request.question}")
    
    retrieved_chunks = []
    source_type = ""

    # 1. Try semantic_search (Qdrant) first
    try:
        print("\nStep 1: Attempting Qdrant retrieval (semantic_search)...")
        retrieved_chunks = retrieve_context(request.question, top_k=3)
        if retrieved_chunks:
            source_type = "[Retriever]"
            print(f"  [SUCCESS] Retrieved {len(retrieved_chunks)} chunks from Qdrant.")
            # print(f"  [DEBUG] Qdrant chunks: {retrieved_chunks}")
        else:
            print("  [INFO] Qdrant retrieval returned no results.")
    except Exception as e:
        print(f"  [ERROR] Error during Qdrant retrieval: {e}. Falling back.")
        retrieved_chunks = [] # Ensure it's empty if an error occurs

    # 2. If semantic_search yields no content, fall back to website_search
    if not retrieved_chunks:
        try:
            print("\nStep 2: Fallback to Website Docs retrieval...")
            retrieved_chunks = website_retrieve_content(request.question, top_k=3)
            if retrieved_chunks:
                source_type = "[Website Docs]"
                print(f"  [SUCCESS] Retrieved {len(retrieved_chunks)} chunks from Website Docs.")
                # print(f"  [DEBUG] Website chunks: {retrieved_chunks}")
            else:
                print("  [INFO] Website retrieval returned no results.")
        except Exception as e:
            print(f"  [ERROR] Error during Website search: {e}.")
            retrieved_chunks = [] # Ensure it's empty if an error occurs
    
    print("\nStep 3: Generating answer...")
    # Generate an answer using the retrieved chunks and the determined source
    answer = generate_answer(request.question, retrieved_chunks, source_type)
    
    # Extract sources from retrieved_chunks (assuming they contain URL or similar metadata)
    sources = []
    if retrieved_chunks:
        sources = list(set([chunk.get('url', 'N/A') for chunk in retrieved_chunks if 'url' in chunk]))
    
    print("\n--- END OF CHAT REQUEST ---\n")
    return ChatResponse(answer=answer, sources=sources)


