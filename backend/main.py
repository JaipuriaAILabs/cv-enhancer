from fastapi import FastAPI, Request
import os
from dotenv import load_dotenv
from crew import QuestionAndSnippetGeneratorCrew, ResumeUpdationAndFlowControlCrew
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import json
from utils.pdf2json import PDF2MarkdownTool
from utils.markdown2latex import markdown_to_latex
from datetime import datetime
import agentops
import subprocess
import tempfile
import requests
from fastapi.responses import FileResponse

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
            
        resume_text = PDF2MarkdownTool(file_path)
        
        # Generate questions using crew
        crew_instance = QuestionAndSnippetGeneratorCrew()
        questions = crew_instance.crew().kickoff(inputs={"resume": resume_text, "today": date, 'evaluation': ""})
        print("😳", questions)
        return {"questions": questions, "resume": resume_text}
        
    except Exception as e:
        # Log the error in production
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
        improved_resume = crew_instance.crew().kickoff(
            inputs={
                "resume": data["Resume"],
                "snipandreason": data["Snippets"],
                "questionsandans": data["QuestionsAndAnswers"]
            }
        )

        print("🔄", improved_resume, iteration)
        return improved_resume
        
        
    except Exception as e:
        # Log the error in production
        return {"error": str(e), "message": "Failed to improve resume"}

@app.post("/enhance_more")
async def enhance_more(request: Request):
    """
    Generate additional questions for resume enhancement.
    
    Args:
        request (Request): FastAPI request containing resume data
        
    Returns:
        dict: Contains generated questions or error details
        
    Raises:
        Exception: For question generation failures
    """
    try:
        data = await request.json()
        crew_instance = QuestionAndSnippetGeneratorCrew()
        questions = crew_instance.crew().kickoff(
            inputs={"resume": data["Resume"], "today": date, "evaluation": "Make sure to ask questions based on the following evaluation: " + " ".join(data["Evaluation"])}
        )
        return questions
        
    except Exception as e:
        # Log the error in production
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
        return {"error": str(e), "message": "Failed to download enhanced resume"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
