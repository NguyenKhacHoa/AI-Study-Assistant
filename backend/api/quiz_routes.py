import os
import json
import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from core.supabase import supabase_client

# LLM Providers
import openai
import google.generativeai as genai

router = APIRouter(prefix="/api/v1/quizzes", tags=["Quizzes"])
security = HTTPBearer()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Request and Response Schemas
class QuizGenerateRequest(BaseModel):
    source_material: str

class QuestionSchema(BaseModel):
    question_text: str
    options: List[str]
    correct_answer: str
    explanation: str

class QuizSchema(BaseModel):
    title: str
    description: str
    questions: List[QuestionSchema]

# JWT Token Verification Dependency
def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    try:
        # Verify the JWT using Supabase Auth
        user_response = supabase_client.auth.get_user(token)
        return user_response.user.id
    except Exception as e:
        logger.error(f"JWT verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token"
        )

# Helper function to generate mock quiz (Fallback)
def generate_mock_quiz(source_material: str) -> dict:
    return {
        "title": "Introduction to AI Study Assistant",
        "description": "A quick quiz generated from your source material preview.",
        "questions": [
            {
                "question_text": f"What is the primary focus of this source material: '{source_material[:30]}...'?",
                "options": ["Artificial Intelligence in Education", "Web Design Basics", "Database Administration", "Docker Deployment"],
                "correct_answer": "Artificial Intelligence in Education",
                "explanation": "The prompt and application focus on using AI to assist study workflows."
            },
            {
                "question_text": "Which framework is used for the StudyAI backend?",
                "options": ["Express.js", "Django", "FastAPI", "Flask"],
                "correct_answer": "FastAPI",
                "explanation": "FastAPI is the modern, fast, and high-performance Python framework chosen for the StudyAI backend."
            },
            {
                "question_text": "What database provider does StudyAI utilize?",
                "options": ["MongoDB", "Supabase", "MySQL", "DynamoDB"],
                "correct_answer": "Supabase",
                "explanation": "Supabase is used for user authentication, PostgreSQL storage, and Row Level Security."
            },
            {
                "question_text": "Which component manages authentication visual layouts in the frontend?",
                "options": ["AuthLayout", "DashboardLayout", "Navbar", "Sidebar"],
                "correct_answer": "AuthLayout",
                "explanation": "AuthLayout provides a professional split-screen visual architecture for login, signup, and reset pages."
            },
            {
                "question_text": "How is the local development monorepo simplified?",
                "options": ["Using Kubernetes", "Using docker-compose and proxy root npm commands", "Manually opening multiple tabs", "Using serverless hosting"],
                "correct_answer": "Using docker-compose and proxy root npm commands",
                "explanation": "Root npm commands combined with docker-compose orchestrates both frontend and backend concurrently."
            }
        ]
    }

# LLM Generation helper
def generate_quiz_with_ai(source_material: str) -> dict:
    system_prompt = (
        "You are an expert educator. Generate exactly 5 multiple choice questions based on the source material provided.\n"
        "You must return ONLY a JSON object. Do not include markdown codeblocks or extra text.\n"
        "The JSON object must have this exact structure:\n"
        "{\n"
        "  \"title\": \"A concise, engaging title for the quiz\",\n"
        "  \"description\": \"A brief description of what this quiz covers\",\n"
        "  \"questions\": [\n"
        "    {\n"
        "      \"question_text\": \"The question being asked\",\n"
        "      \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n"
        "      \"correct_answer\": \"The exact option string that is correct (must match one of the 4 options exactly)\",\n"
        "      \"explanation\": \"An explanation of why this answer is correct and educational context\"\n"
        "    }\n"
        "  ]\n"
        "}"
    )

    openai_key = os.environ.get("OPENAI_API_KEY")
    gemini_key = os.environ.get("GEMINI_API_KEY")

    if openai_key:
        try:
            logger.info("Generating quiz using OpenAI...")
            client = openai.OpenAI(api_key=openai_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Source Material:\n{source_material}"}
                ],
                temperature=0.7
            )
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            logger.error(f"OpenAI Generation failed: {str(e)}")
            raise e

    elif gemini_key:
        try:
            logger.info("Generating quiz using Gemini...")
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel(
                'gemini-1.5-flash',
                generation_config={"response_mime_type": "application/json"}
            )
            prompt = f"{system_prompt}\n\nSource Material:\n{source_material}"
            response = model.generate_content(prompt)
            content = response.text
            return json.loads(content)
        except Exception as e:
            logger.error(f"Gemini Generation failed: {str(e)}")
            raise e

    else:
        logger.warning("No LLM API keys found (OPENAI_API_KEY or GEMINI_API_KEY). Falling back to mock quiz generation.")
        return generate_mock_quiz(source_material)

@router.post("/generate", response_model=dict, status_code=status.HTTP_201_CREATED)
async def generate_quiz(
    request: QuizGenerateRequest,
    user_id: str = Depends(get_current_user_id)
):
    if not request.source_material.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Source material cannot be empty"
        )

    # 1. Generate quiz content via AI (or mock fallback)
    try:
        quiz_content = generate_quiz_with_ai(request.source_material)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to generate quiz content via AI: {str(e)}"
        )

    # Validate output structure
    if "title" not in quiz_content or "questions" not in quiz_content or len(quiz_content["questions"]) == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI returned malformed quiz structure"
        )

    # 2. Save Quiz to Supabase
    try:
        quiz_data = {
            "title": quiz_content["title"],
            "description": quiz_content.get("description", ""),
            "source_material": request.source_material,
            "creator_id": user_id
        }
        
        quiz_insert = supabase_client.table("quizzes").insert(quiz_data).execute()
        
        if not quiz_insert.data:
            raise Exception("Failed to insert quiz record into database")
            
        inserted_quiz = quiz_insert.data[0]
        quiz_id = inserted_quiz["id"]

        # 3. Save Questions to Supabase
        questions_to_insert = []
        for q in quiz_content["questions"]:
            questions_to_insert.append({
                "quiz_id": quiz_id,
                "question_text": q["question_text"],
                "options": q["options"],
                "correct_answer": q["correct_answer"],
                "explanation": q.get("explanation", "")
            })

        questions_insert = supabase_client.table("questions").insert(questions_to_insert).execute()
        inserted_questions = questions_insert.data

        # 4. Return combined structure
        return {
            "quiz": inserted_quiz,
            "questions": inserted_questions
        }

    except Exception as e:
        logger.error(f"Database insertion failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save generated quiz to database: {str(e)}"
        )
