from pydantic import BaseModel
from typing import List
"""
JSON structure of the ResumeModel:
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
"""

class PersonalInfo(BaseModel):
    #image?
    name: str = ""
    course: str = ""
    summary: str = ""
    email: str = ""
    contactNo: str = ""
    linkedinId: str = ""





class Internship(BaseModel):
    organization: str = ""
    duration: str = ""
    location: str = ""
    period: str = ""
    summary: str = ""
    keypoints: List[str] = [""]


class Project(BaseModel):
    title: str = ""
    organization: str = ""
    duration: str = ""
    period: str = ""
    summary: str = ""
    keypoints: List[str] = [""]
    learning: List[str] = [""]
    skillsDeveloped: str = ""

class Education(BaseModel):
    title: str = ""  
    institution: str = ""
    period: str = ""
    percentage: str = ""


class Achievement(BaseModel):
    title: str = ""
    organization: str = ""
    date: str = ""
    summary: str = ""
    keypoints: List[str] = [""]



# class Skills(BaseModel):
#     skills: List[str] = [""]

class Certification(BaseModel):
    title: str = ""
    organization: str = ""
    period: str = ""

    
class ResumeModel(BaseModel):
    personalInfo: PersonalInfo = PersonalInfo()
    education: List[Education] = [Education()]
    certifications: List[Certification] = [Certification()]
    projects: List[Project] = [Project()]
    achievements: List[Achievement] = [Achievement()]
    skills: List[str] = [""]
    languages: List[str] = [""]
    interests: List[str] = [""]
    internships: List[Internship] = [Internship()]

