from typing import Type
import json
import PyPDF2
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import os
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()

# Initialize OpenAI
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
MODEL = "gpt-4o-mini"


# def PDF2JSONTool(pdf_path: str) -> dict:
#     """
#     A tool for converting PDF resumes to structured JSON format.

#     Args:
#         pdf_path (str): Path to the PDF resume file to be processed

#     Returns:
#         dict: A structured JSON object containing parsed resume information with fields for:
#             - name
#             - email 
#             - phone
#             - education
#             - work_experience
#             - skills
#             - certifications
#             - projects
#             - achievements
            
#     Raises:
#         Exception: If there are errors reading the PDF file or extracting text
#     """
#     pdf_text = ""

#     try:
#         # Open the PDF file
#         with open(pdf_path, 'rb') as file:
#             # Create PDF reader object
#             pdf_reader = PyPDF2.PdfReader(file)
            
#             # Initialize empty string for content
#             content = ""
            
#             # Iterate through pages and extract text
#             for page in pdf_reader.pages:
#                 extracted_text = page.extract_text()
#                 if extracted_text:
#                     content += extracted_text
            
#             pdf_text = content

#     except Exception as e:
#         print(f"Error extracting text from PDF: {e}")
#         return {}

#     prompt = """
#     Extract the following information from the resume in JSON format:
#     {
#         "name": "",
#         "email": "",
#         "phone": "",
#         "education": [],
#         "work_experience": [],
#         "skills": [],
#         "certifications": [],
#         "projects": [],
#         "achievements": []
#     }
#     If any field is not found, leave it empty.
#     If you believe there is a field that should be added to the JSON, as it has valuable information, add it.
#     Return only the JSON object, no additional text.
#     """

#     try:
#         # Assuming `client` and `MODEL` are properly set up
#         response = client.chat.completions.create(
#             model=MODEL,
#             messages=[
#                 {"role": "system", "content": "You are a precise JSON extractor. Extract information in the exact JSON format requested. Only return the JSON object, no additional text or markdown."},
#                 {"role": "user", "content": prompt + "\n\nResume:\n" + pdf_text}
#             ],
#             temperature=0.1,
#             response_format={ "type": "json_object" },
#         )
#         return json.loads(response.choices[0].message.content)

#     except Exception as e:
#         print(f"Error extracting resume metadata: {e}")
#         return {}


# output = PDF2JSONTool(pdf_path="Varun Resume.pdf")
# print(output)



def PDF2MarkdownTool(pdf_path: str) -> str:
    """
    A tool for converting PDF resumes to structured markdown format.

    Args:
        pdf_path (str): Path to the PDF resume file to be processed

    Returns:
        str: A structured markdown string containing parsed resume information with sections for:
            - name
            - email     
            - phone
            - education
            - work_experience
                ## Company Name
                ## Job Title
                ## Job Description
                ## Job Responsibilities
                ## Job Achievements
                ## Job Start Date
                ## Job End Date
            - skills
            - certifications
            - projects
            - achievements
            
    Raises:
        Exception: If there are errors reading the PDF file or extracting text
    """
    pdf_text = ""

    try:
        # Open the PDF file
        with open(pdf_path, 'rb') as file:
            # Create PDF reader object
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Initialize empty string for content
            content = ""
            
            # Iterate through pages and extract text
            for page in pdf_reader.pages:
                extracted_text = page.extract_text()
                if extracted_text:
                    content += extracted_text
            
            pdf_text = content

    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return {}

    prompt = """
   Convert the following resume text into a rich and well-structured Markdown format that includes all the provided information. Use clear headings, bullet points, and formatting to ensure readability. Include sections like Profile Summary, Education, Work Experience, Skills etc. You can create more sections if needed or remove any section that is not present in the resume. Maintain a professional tone and preserve all relevant details from the resume. Do not add or modify the information given to you.
    """

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are a precise Markdown extractor. Extract information in the exact Markdown format requested. Only return the Markdown output, no additional text or markdown."},
                {"role": "user", "content": prompt + "\n\nResume:\n" + pdf_text}
            ],
            temperature=0.1,
            response_format={ "type": "text" },
        )
        print(response.choices[0].message.content)
        return response.choices[0].message.content

    except Exception as e:
        print(f"Error extracting resume metadata: {e}")
        return {}


# print(PDF2MarkdownTool(pdf_path="../uploads/BlackRock_CV.pdf"))