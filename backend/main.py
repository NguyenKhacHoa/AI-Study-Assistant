import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers.quiz import router as quiz_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="StudyAI Backend",
    description="Python FastAPI backend for StudyAI EdTech platform",
    version="1.0.0"
)

app.include_router(quiz_router, prefix="/api/v1/quizzes", tags=["Quizzes"])

# CORS configuration
origins = [
    "http://localhost:5173",  # React Frontend port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to StudyAI API"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
