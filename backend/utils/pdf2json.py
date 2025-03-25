import json
import PyPDF2
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import os
from openai import OpenAI
from dotenv import load_dotenv
# from backend.models.resume_mode import ResumeModel    

load_dotenv()

# Initialize OpenAI
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
MODEL = "gpt-4o-mini"

from pydantic import BaseModel
from typing import List, Optional
from datetime import date

"""
JSON structure of the ResumeModel:
{
  "personalInfo": {
    "name": "",
    "email": "",
    "linkedinId": "",
    "contactNo": "",
    "dob": "",
    "address": ""
  },
  "education": [
    {
      "title": "",
      "period": "",
      "institution": "",
      "percentage": ""
    }
  ],
  "academicAchievements": [""],
  "certifications": [
    {
      "title": "",
      "organization": "",
      "period": ""
    }
  ],
  "projects": [
    {
      "title": "",
      "organization": "",
      "duration": "",
      "period": "",
      "description": "",
      "learning": [""],
      "skillsDeveloped": ""
    }
  ],
  "achievements": [""],
  "skills": [""],
  "experience": [
    {
      "title": "",
      "organization": "",
      "duration": "",
      "period": "",
      "description": [""]
    }
  ]
}
"""

class PersonalInfo(BaseModel):
    #image?
    name: str
    course: str
    summary: str
    email: str
    contactNo: str
    linkedinId: str





class Internship(BaseModel):
    organization: str 
    duration: str 
    location: str 
    period: str 
    summary: str 
    keypoints: List[str]


class Project(BaseModel):
    title: str 
    organization: str 
    duration: str 
    period: str 
    summary: str 
    keypoints: List[str] 
    learning: List[str] 
    skillsDeveloped: str 

class Education(BaseModel):
    title: str 
    period: str 
    institution: str 
    percentage: str 


class Achievement(BaseModel):
    title: str 
    organization: str 
    date: str 
    summary: str 
    keypoints: List[str] 




class Certification(BaseModel):
    title: str 
    organization: str 
    period: str 

    
class ResumeModel(BaseModel):
    personalInfo: PersonalInfo  
    education: List[Education]
    certifications: List[Certification]  
    projects: List[Project]  
    achievements: List[Achievement]  
    skills: List[str]  
    languages: List[str]  
    interests: List[str]  
    internships: List[Internship]  




def PDF2JsonTool(pdf_path: str) -> str:
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
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are a precise Markdown extractor. Extract information in the exact Markdown format requested. Only return the Markdown output, no additional text or markdown."},
                {"role": "user", "content": prompt + "\n\nResume:\n" + pdf_text}
            ],
            temperature=0.1
        )
        
        markdown_output = completion.choices[0].message.content
        
        # Now convert the markdown to our ResumeModel format
        resume_json_prompt = """
        Convert the following resume markdown into a structured JSON format that matches this schema:
        
        ```
            {
        "personalInfo": {
          "name": "",
          "email": "",
          "linkedinId": "",
          "contactNo": "",
          "course": "",
          "summary": ""
        },
        "education": [
          {
            "title": "",
            "institution": "",
            "period": "",
            "percentage": ""
          }
        ],
        "certifications": [
          {
            "title": "",
            "organization": "",
            "period": ""
          }
        ],
        "projects": [
          {
            "title": "",
            "organization": "",
            "duration": "",
            "period": "",
            "summary": "",
            "keypoints": [""],
            "learning": [""],
            "skillsDeveloped": ""
          }
        ],
        "achievements": [
          {
            "title": "",
            "organization": "",
            "date": "",
            "summary": "",
            "keypoints": [""]
          }
        ],
        "skills": [""],
        "languages": [""],
        "interests": [""],
        "internships": [
          {
            "organization": "",
            "duration": "",
            "location": "",
            "period": "",
            "summary": "",
            "keypoints": [""]
          }
        ]
        }
        ```
        
        Only return the valid JSON, no additional text.
        """
        
        json_completion = client.beta.chat.completions.parse(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are a precise JSON converter. Extract information from markdown into the exact JSON format requested. Do not add any additional information to the JSON."},
                {"role": "user", "content": resume_json_prompt + "\n\nMarkdown Resume:\n" + markdown_output}
            ],
            temperature=0.1,
            response_format=ResumeModel
        )
        
        resume_json = json_completion.choices[0].message.parsed 
        return resume_json.model_dump()

    except Exception as e:
        raise Exception(f"Error extracting resume metadata: {e}")


print(PDF2JsonTool(pdf_path="../uploads/Ananya_Singh_CV.pdf"))