import os
import json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

# Configure the Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-pro')

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

class TranslationRequest(BaseModel):
    text: str

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


@app.post("/translate")
async def translate_text(request: TranslationRequest):
    try:
        prompt = f"Translate the following English text to Urdu: {request.text}"
        response = model.generate_content(prompt)
        translated_text = response.text
        return {"translated_text": translated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)