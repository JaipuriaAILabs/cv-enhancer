from fastapi import FastAPI, Request
import os
from dotenv import load_dotenv
from crew import QuestionAndSnippetGeneratorCrew, ResumeUpdationAndFlowControlCrew
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import json
from utils.pdf2json import PDF2JsonTool
from utils.markdown2latex import markdown_to_latex
from datetime import datetime
import agentops
import subprocess
import tempfile
import requests
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, Any

# Initialize envirsonment and application
load_dotenv()
app = FastAPI()


agentops.init(
    api_key=os.getenv("AGENTOPS_API_KEY"),
    default_tags=['crewai']
)
# counter to check the number of turns. We will stop the execution after 3 turns.
iteration = 0

# Global variables
pdf_text = ""
resume_text = ""
date = datetime.now().strftime("%Y-%m-%d")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResponseModel(BaseModel):
    resume: str
    questions: Dict[str, Any]
    snippets: Dict[str, Any]

@app.post("/")
async def handle_pdf(request: Request):
    """
    Process uploaded PDF resume and generate relevant questions.
    
    Args:
        request (Request): FastAPI request object containing the PDF file
        
    Returns:
        dict: Contains generated questions and resume text, or error details
        
    Raises:
        Exception: For file handling or question generation failures
    """
    try:
        # Handle file upload
        form_data = await request.form()
        pdf_file = form_data["file"].file
        pdf_filename = form_data["file"].filename
        
        # Ensure upload directory exists and save file
        upload_folder = "uploads"
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, pdf_filename)
        
        with open(file_path, "wb") as f:
            f.write(pdf_file.read())
            
        resume_text = PDF2JsonTool(file_path)
        print("😩 ", resume_text)
        
        # Generate questions using crew
        crew_instance = QuestionAndSnippetGeneratorCrew()
        questions = crew_instance.crew().kickoff(inputs={"resume": resume_text, "today": date, 'evaluation': ""})
        print("0️⃣", questions.tasks_output[0])
        print("1️⃣", questions.tasks_output[1])
        
        # Convert Pydantic models to dictionaries for JSON serialization
        snippets_dict = questions.tasks_output[0].model_dump()["json_dict"] 
        questions_dict = questions.tasks_output[1].model_dump()["json_dict"] 
        
        # Return a properly structured response
        return {
            "resume": resume_text,
            "questions": questions_dict,
            "snippets": snippets_dict
        }
        
    except Exception as e:
        # Log the error in production
        print(f"Error processing PDF: {str(e)}")
        return {"error": str(e), "message": "Failed to process request"}
        


@app.post("/improve_resume")
async def improve_resume(request: Request):
    """
    Process resume improvement request using crew system.

    Args:
        request (Request): FastAPI request containing resume data and Q&A
        
    Returns:
        dict: Contains improved resume or error details
        
    Raises:
        Exception: For data processing or resume improvement failures
    """
    try:
        global iteration
        iteration = iteration + 1
        data = await request.json()
        crew_instance = ResumeUpdationAndFlowControlCrew()
        improved_resume_and_evaluation = crew_instance.crew().kickoff(
            inputs={
                "resume": data["Resume"],
                "snipandreason": data["Snippets"],
                "questionsandans": data["QuestionsAndAnswers"]
            }
        )

        improved_resume = improved_resume_and_evaluation.tasks_output[0].model_dump()["json_dict"] 
        evaluation = improved_resume_and_evaluation.tasks_output[1].model_dump()["raw"]

        print("🔄", improved_resume, evaluation)

        return {
            "improved_resume": improved_resume,
            "evaluation": evaluation
        }
        
        
    except Exception as e:
        # Log the error in production
        print(f"Error improving resume: {str(e)}")
        return {"error": str(e), "message": "Failed to improve resume"}

@app.post("/generate_more_questions")
async def generate_more_questions(request: Request):
    """
    Generate additional questions for resume enhancement.
    
    Args:
        request (Request): FastAPI request containing resume data
        
    Returns:
        dict: Contains generated questions or error details
        
    Raises:
        Exception: For question generation failures
    """
    #hi
    try:
        data = await request.json()
        crew_instance = QuestionAndSnippetGeneratorCrew()
        questions = crew_instance.crew().kickoff(
            inputs={"resume": data["Resume"], "today": date, "evaluation": "Make sure to ask questions based on the following evaluation: " + " ".join(data["Evaluation"])}
        )
        
        # Convert Pydantic models to dictionaries for JSON serialization
        snippets_dict = questions.tasks_output[0].model_dump()["json_dict"]
        questions_dict = questions.tasks_output[1].model_dump()["json_dict"]
        
        return {
            "questions": questions_dict,
            "snippets": snippets_dict
        }
        
    except Exception as e:
        # Log the error in production
        print(f"Error generating more questions: {str(e)}")
        return {"error": str(e), "message": "Failed to generate questions"}

@app.post("/download_enhanced_resume")
async def download_enhanced_resume(request: Request):
    """
    Download the enhanced resume in LaTeX format and convert to Word document.
    
    Args:
        request (Request): FastAPI request containing resume data
        
    Returns:
        FileResponse: Word document containing the enhanced resume
        
    Raises:
        Exception: For download or conversion failures
    """
    try:
        data = await request.json() 
        latex_code = markdown_to_latex(data["Resume"])
        # Remove Markdown code block markers if present
        latex_code = latex_code.replace("```latex", "").replace("```", "")
        
        # Create a temporary LaTeX filez
        with tempfile.NamedTemporaryFile(delete=False, suffix=".tex") as tmp_tex:
            tmp_tex.write(latex_code.encode('utf-8'))
            tmp_tex_path = tmp_tex.name

        # Create a temporary Word file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp_docx:
            tmp_docx_path = tmp_docx.name

        # Convert LaTeX to Word using Pandoc
        subprocess.run(
            ["pandoc", tmp_tex_path, "-o", tmp_docx_path],
            check=True
        )

        return FileResponse(tmp_docx_path, media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document', filename="Enhanced_Resume.docx")
        
    except Exception as e:
        # Log the error in production
        print(f"Error downloading resume: {str(e)}")
        return {"error": str(e), "message": "Failed to download enhanced resume"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
