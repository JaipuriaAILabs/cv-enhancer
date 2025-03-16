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
    name: str = ""
    email: str = ""
    linkedinId: str = ""
    contactNo: str = ""
    dob: str = ""
    address: str = ""


class Education(BaseModel):
    title: str = ""
    period: str = ""
    institution: str = ""
    percentage: str = ""


class Project(BaseModel):
    title: str = ""
    organization: str = ""
    duration: str = ""
    period: str = ""
    description: str = ""
    learning: List[str] = [""]
    skillsDeveloped: str = ""

class Certification(BaseModel):
    title: str = ""
    organization: str = ""
    period: str = ""

class Experience(BaseModel):
    title: str = ""
    organization: str = ""
    duration: str = ""
    period: str = ""
    description: List[str] = [""]
    
class ResumeModel(BaseModel):
    personalInfo: PersonalInfo = PersonalInfo()
    education: List[Education] = [Education()]
    academicAchievements: List[str] = [""]
    certifications: List[Certification] = [Certification()]
    projects: List[Project] = [Project()]
    achievements: List[str] = [""]
    skills: List[str] = [""]
    experience: List[Experience] = [Experience()]


