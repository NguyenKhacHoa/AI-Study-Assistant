import os
import json
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import google.generativeai as genai
from db import supabase
from auth_handler import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

# Request Schema
class QuizGenerateRequest(BaseModel):
    title: str
    description: str
    source_material: str

def clean_json_string(text: str) -> str:
    """Helper to strip potential markdown formatting from Gemini response."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

@router.post("/generate", status_code=status.HTTP_201_CREATED)
async def generate_quiz(
    request: QuizGenerateRequest,
    user_id: str = Depends(get_current_user)
):
    # Check input validation
    if not request.source_material.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Source material cannot be empty"
        )
    
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini API Key is not configured on the server."
        )

    # Initialize Gemini API
    try:
        genai.configure(api_key=gemini_api_key)
        
        # Define strict instructions for the JSON format
        system_prompt = (
            "Bạn là một chuyên gia giáo dục. Hãy đọc tài liệu học tập (source_material) được cung cấp và tạo ra CHÍNH XÁC 5 câu hỏi trắc nghiệm bằng Tiếng Việt.\n"
            "Mỗi câu hỏi phải có đúng 4 phương án lựa chọn (A, B, C, D).\n"
            "Bạn BẮT BUỘC phải trả về kết quả dưới dạng một mảng JSON thô (raw JSON array) theo cấu trúc chính xác dưới đây, KHÔNG kèm theo bất kỳ văn bản giải thích nào khác và KHÔNG bọc trong khối code block markdown (```json ... ```):\n"
            "[\n"
            "  {\n"
            "    \"question_text\": \"Nội dung câu hỏi ở đây\",\n"
            "    \"options\": [\"Đáp án A\", \"Đáp án B\", \"Đáp án C\", \"Đáp án D\"],\n"
            "    \"correct_answer\": \"Đáp án đúng (phải khớp chính xác hoàn toàn với một trong bốn đáp án trong mảng options)\",\n"
            "    \"explanation\": \"Giải thích tại sao đáp án đó đúng\"\n"
            "  }\n"
            "]"
        )

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )

        prompt = f"{system_prompt}\n\nTài liệu học tập (source_material):\n{request.source_material}"
        
        logger.info("Calling Google Gemini API to generate quiz...")
        response = model.generate_content(prompt)
        
        if not response or not response.text:
            raise Exception("Gemini returned an empty response")

        # Clean and Parse the JSON output
        cleaned_response = clean_json_string(response.text)
        questions_data = json.loads(cleaned_response)

        if not isinstance(questions_data, list) or len(questions_data) == 0:
            raise ValueError("AI output is not a non-empty list of questions")

    except Exception as e:
        logger.error(f"Error during Gemini quiz generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to generate quiz content using Gemini: {str(e)}"
        )

    # Database operations (Save Quiz & Questions)
    try:
        # Step A: Insert a new row into the quizzes table
        quiz_insert_data = {
            "title": request.title,
            "description": request.description,
            "source_material": request.source_material,
            "creator_id": user_id
        }
        
        logger.info("Inserting new quiz record into Supabase...")
        quiz_response = supabase.table("quizzes").insert(quiz_insert_data).execute()
        
        if not quiz_response.data or len(quiz_response.data) == 0:
            raise Exception("Supabase insert returned no data for quizzes")

        quiz_id = quiz_response.data[0]["id"]

        # Step B: Prepare a batch of records for the questions table
        questions_to_insert = []
        for q in questions_data:
            questions_to_insert.append({
                "quiz_id": quiz_id,
                "question_text": q["question_text"],
                "options": q["options"],  # JSONB insertion will automatically cast python lists
                "correct_answer": q["correct_answer"],
                "explanation": q.get("explanation", "")
            })

        # Step C: Execute batch insert into questions table
        logger.info(f"Batch inserting {len(questions_to_insert)} questions into Supabase...")
        questions_response = supabase.table("questions").insert(questions_to_insert).execute()
        
        if not questions_response.data:
            raise Exception("Supabase insert returned no data for questions")

        return {
            "quiz": quiz_response.data[0],
            "questions": questions_response.data
        }

    except Exception as e:
        logger.error(f"Supabase Transaction Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database transaction failed: {str(e)}"
        )
