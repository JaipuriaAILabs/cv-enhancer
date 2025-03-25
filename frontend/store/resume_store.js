import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define the initial resume data structure
const initialResumeData = {
  "personalInfo": {
    "name": "Ananya Singh",
    "email": "ananya.singh@example.com",
    "linkedinId": "linkedin.com/in/ananyasingh",
    "contactNo": "+91-9876543210",
    "course": "PGDM - Marketing and Analytics",
    "summary": "Management student with a keen interest in marketing strategies, data analytics, and consumer behavior, aiming to contribute effectively in a dynamic business environment."
  },
  "education": [
    {
      "title": "Post Graduate Diploma in Management",
      "institution": "ABC Business School, Mumbai",
      "period": "2023 - 2025",
      "percentage": "8.2 CGPA"
    }
  ],
  "certifications": [
    {
      "title": "Digital Marketing Specialization",
      "organization": "Google",
      "period": "May 2024"
    }
  ],
  "projects": [
    {
      "title": "Consumer Behavior Study on E-commerce Platforms",
      "organization": "ABC Business School",
      "duration": "2 months",
      "period": "January - February 2024",
      "summary": "Analyzed online shopping patterns and developed insights to improve customer retention strategies.",
      "keypoints": ["Conducted surveys with 200+ respondents", "Performed data analysis using Excel and SPSS"],
      "learning": ["Gained hands-on experience in market research", "Improved data interpretation skills"],
      "skillsDeveloped": "Market Research, Data Analysis, Presentation Skills"
    }
  ],
  "achievements": [
    {
      "title": "Top 5 Finalist - National Case Competition",
      "organization": "IIM Ahmedabad",
      "date": "August 2024",
      "summary": "Qualified among top 5 teams nationwide for solving a live business problem.",
      "keypoints": ["Developed strategic solutions", "Presented to a panel of industry experts"]
    }
  ],
  "skills": ["MS Excel", "Tableau", "SPSS", "Marketing Strategy", "Data Analytics"],
  "languages": ["English", "Hindi", "Marathi"],
  "interests": ["Business Case Solving", "Stock Market Analysis", "Travelling"],
  "internships": [
    {
      "organization": "XYZ FMCG Pvt. Ltd.",
      "duration": "2 months",
      "location": "Mumbai, Maharashtra",
      "period": "April - June 2024",
      "summary": "Worked in the marketing team to analyze competitor pricing strategies and propose optimization models.",
      "keypoints": ["Conducted secondary research", "Contributed to pricing strategy report"]
    }
  ]
}

// Create a store with persistence middleware
const resumeStore = create(
  persist(
    (set) => ({
      // State
      resumeData: initialResumeData,
      
      // Actions
      
      // Personal Information actions
      updatePersonalInfo: (field, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.personalInfo[field] = value;
        return { resumeData: newResumeData };
      }),
      
      // Education actions
      addEducation: (education = {
        title: "",
        institution: "",
        period: "",
        percentage: ""
      }) => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.education = [...newResumeData.education, education];
        return { resumeData: newResumeData };
      }),
      
      updateEducation: (index, field, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.education.length) {
          newResumeData.education[index] = {
            ...newResumeData.education[index],
            [field]: value
          };
        }
        return { resumeData: newResumeData };
      }),
      
      removeEducation: (index) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.education.length) {
          newResumeData.education = newResumeData.education.filter((_, i) => i !== index);
        }
        return { resumeData: newResumeData };
      }),
      
      // Certifications actions
      addCertification: (certification = {
        title: "",
        organization: "",
        period: ""
      }) => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.certifications = [...newResumeData.certifications, certification];
        return { resumeData: newResumeData };
      }),
      
      updateCertification: (index, field, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.certifications.length) {
          newResumeData.certifications[index] = {
            ...newResumeData.certifications[index],
            [field]: value
          };
        }
        return { resumeData: newResumeData };
      }),
      
      removeCertification: (index) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.certifications.length) {
          newResumeData.certifications = newResumeData.certifications.filter((_, i) => i !== index);
        }
        return { resumeData: newResumeData };
      }),
      
      // Projects actions
      addProject: (project = {
        title: "",
        organization: "",
        duration: "",
        period: "",
        summary: "",
        keypoints: [""],
        learning: [""],
        skillsDeveloped: "" 
      }) => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.projects = [...newResumeData.projects, project];
        return { resumeData: newResumeData };
      }),
      
      updateProject: (index, field, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.projects.length) {
          newResumeData.projects[index] = {
            ...newResumeData.projects[index],
            [field]: value
          };
        }
        return { resumeData: newResumeData };
      }),
      
      removeProject: (index) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.projects.length) {
          newResumeData.projects = newResumeData.projects.filter((_, i) => i !== index);
        }
        return { resumeData: newResumeData };
      }),
      
      // Project keypoints actions
      addProjectKeypoint: (projectIndex, keypoint = "") => set(state => {
        const newResumeData = { ...state.resumeData };
        if (projectIndex >= 0 && projectIndex < newResumeData.projects.length) {
          newResumeData.projects[projectIndex].keypoints = [
            ...newResumeData.projects[projectIndex].keypoints,
            keypoint
          ];
        }
        return { resumeData: newResumeData };
      }),
      
      updateProjectKeypoint: (projectIndex, keypointIndex, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (
          projectIndex >= 0 && 
          projectIndex < newResumeData.projects.length &&
          keypointIndex >= 0 &&
          keypointIndex < newResumeData.projects[projectIndex].keypoints.length
        ) {
          newResumeData.projects[projectIndex].keypoints[keypointIndex] = value;
        }
        return { resumeData: newResumeData };
      }),
      
      removeProjectKeypoint: (projectIndex, keypointIndex) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (
          projectIndex >= 0 && 
          projectIndex < newResumeData.projects.length &&
          keypointIndex >= 0 &&
          keypointIndex < newResumeData.projects[projectIndex].keypoints.length
        ) {
          newResumeData.projects[projectIndex].keypoints = 
            newResumeData.projects[projectIndex].keypoints.filter((_, i) => i !== keypointIndex);
        }
        return { resumeData: newResumeData };
      }),
      
      // Project learning actions
      addProjectLearning: (projectIndex, learning = "") => set(state => {
        const newResumeData = { ...state.resumeData };
        if (projectIndex >= 0 && projectIndex < newResumeData.projects.length) {
          newResumeData.projects[projectIndex].learning = [
            ...newResumeData.projects[projectIndex].learning,
            learning
          ];
        }
        return { resumeData: newResumeData };
      }),
      
      updateProjectLearning: (projectIndex, learningIndex, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (
          projectIndex >= 0 && 
          projectIndex < newResumeData.projects.length &&
          learningIndex >= 0 &&
          learningIndex < newResumeData.projects[projectIndex].learning.length
        ) {
          newResumeData.projects[projectIndex].learning[learningIndex] = value;
        }
        return { resumeData: newResumeData };
      }),
      
      removeProjectLearning: (projectIndex, learningIndex) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (
          projectIndex >= 0 && 
          projectIndex < newResumeData.projects.length &&
          learningIndex >= 0 &&
          learningIndex < newResumeData.projects[projectIndex].learning.length
        ) {
          newResumeData.projects[projectIndex].learning = 
            newResumeData.projects[projectIndex].learning.filter((_, i) => i !== learningIndex);
        }
        return { resumeData: newResumeData };
      }),
      
      // Achievements actions
      addAchievement: (achievement = {
        title: "",
        organization: "",
        date: "",
        summary: "",
        keypoints: [""]
      }) => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.achievements = [...newResumeData.achievements, achievement];
        return { resumeData: newResumeData };
      }),
      
      updateAchievement: (index, field, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.achievements.length) {
          newResumeData.achievements[index] = {
            ...newResumeData.achievements[index],
            [field]: value
          };
        }
        return { resumeData: newResumeData };
      }),
      
      removeAchievement: (index) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.achievements.length) {
          newResumeData.achievements = newResumeData.achievements.filter((_, i) => i !== index);
        }
        return { resumeData: newResumeData };
      }),
      
      // Achievement keypoints actions
      addAchievementKeypoint: (achievementIndex, keypoint = "") => set(state => {
        const newResumeData = { ...state.resumeData };
        if (achievementIndex >= 0 && achievementIndex < newResumeData.achievements.length) {
          newResumeData.achievements[achievementIndex].keypoints = [
            ...newResumeData.achievements[achievementIndex].keypoints,
            keypoint
          ];
        }
        return { resumeData: newResumeData };
      }),
      
      updateAchievementKeypoint: (achievementIndex, keypointIndex, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (
          achievementIndex >= 0 && 
          achievementIndex < newResumeData.achievements.length &&
          keypointIndex >= 0 &&
          keypointIndex < newResumeData.achievements[achievementIndex].keypoints.length
        ) {
          newResumeData.achievements[achievementIndex].keypoints[keypointIndex] = value;
        }
        return { resumeData: newResumeData };
      }),
      
      removeAchievementKeypoint: (achievementIndex, keypointIndex) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (
          achievementIndex >= 0 && 
          achievementIndex < newResumeData.achievements.length &&
          keypointIndex >= 0 &&
          keypointIndex < newResumeData.achievements[achievementIndex].keypoints.length
        ) {
          newResumeData.achievements[achievementIndex].keypoints = 
            newResumeData.achievements[achievementIndex].keypoints.filter((_, i) => i !== keypointIndex);
        }
        return { resumeData: newResumeData };
      }),
      
      // Skills actions
      addSkill: (skill = "") => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.skills = [...newResumeData.skills, skill];
        return { resumeData: newResumeData };
      }),
      
      updateSkill: (index, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.skills.length) {
          newResumeData.skills[index] = value;
        }
        return { resumeData: newResumeData };
      }),
      
      removeSkill: (index) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.skills.length) {
          newResumeData.skills = newResumeData.skills.filter((_, i) => i !== index);
        }
        return { resumeData: newResumeData };
      }),
      
      // Languages actions
      addLanguage: (language = "") => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.languages = [...newResumeData.languages, language];
        return { resumeData: newResumeData };
      }),
      
      updateLanguage: (index, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.languages.length) {
          newResumeData.languages[index] = value;
        }
        return { resumeData: newResumeData };
      }),
      
      removeLanguage: (index) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.languages.length) {
          newResumeData.languages = newResumeData.languages.filter((_, i) => i !== index);
        }
        return { resumeData: newResumeData };
      }),
      
      // Interests actions
      addInterest: (interest = "") => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.interests = [...newResumeData.interests, interest];
        return { resumeData: newResumeData };
      }),
      
      updateInterest: (index, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.interests.length) {
          newResumeData.interests[index] = value;
        }
        return { resumeData: newResumeData };
      }),
      
      removeInterest: (index) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.interests.length) {
          newResumeData.interests = newResumeData.interests.filter((_, i) => i !== index);
        }
        return { resumeData: newResumeData };
      }),
      
      // Internships actions
      addInternship: (internship = {
        organization: "",
        duration: "",
        location: "",
        period: "",
        summary: "",
        keypoints: [""]
      }) => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.internships = [...newResumeData.internships, internship];
        return { resumeData: newResumeData };
      }),
      
      updateInternship: (index, field, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.internships.length) {
          newResumeData.internships[index] = {
            ...newResumeData.internships[index],
            [field]: value
          };
        }
        return { resumeData: newResumeData };
      }),
      
      removeInternship: (index) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.internships.length) {
          newResumeData.internships = newResumeData.internships.filter((_, i) => i !== index);
        }
        return { resumeData: newResumeData };
      }),
      
      // Internship keypoints actions
      addInternshipKeypoint: (internshipIndex, keypoint = "") => set(state => {
        const newResumeData = { ...state.resumeData };
        if (internshipIndex >= 0 && internshipIndex < newResumeData.internships.length) {
          newResumeData.internships[internshipIndex].keypoints = [
            ...newResumeData.internships[internshipIndex].keypoints,
            keypoint
          ];
        }
        return { resumeData: newResumeData };
      }),
      
      updateInternshipKeypoint: (internshipIndex, keypointIndex, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (
          internshipIndex >= 0 && 
          internshipIndex < newResumeData.internships.length &&
          keypointIndex >= 0 &&
          keypointIndex < newResumeData.internships[internshipIndex].keypoints.length
        ) {
          newResumeData.internships[internshipIndex].keypoints[keypointIndex] = value;
        }
        return { resumeData: newResumeData };
      }),
      
      removeInternshipKeypoint: (internshipIndex, keypointIndex) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (
          internshipIndex >= 0 && 
          internshipIndex < newResumeData.internships.length &&
          keypointIndex >= 0 &&
          keypointIndex < newResumeData.internships[internshipIndex].keypoints.length
        ) {
          newResumeData.internships[internshipIndex].keypoints = 
            newResumeData.internships[internshipIndex].keypoints.filter((_, i) => i !== keypointIndex);
        }
        return { resumeData: newResumeData };
      }),
      
      // Reset the entire resume data
      resetResumeData: () => set({ resumeData: initialResumeData }),
      
      // Set the entire resume data (useful for importing)
      setResumeData: (data) => set({ resumeData: data }),
      
      // A generic update function for any field in the resume
      updateResumeField: (path, value) => set(state => {
        const newResumeData = JSON.parse(JSON.stringify(state.resumeData));
        
        // Handle paths like "personalInfo.name" or "education.0.title"
        const pathParts = path.split('.');
        let current = newResumeData;
        
        // Navigate to the nested property
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          // Handle array indices
          if (!isNaN(parseInt(part))) {
            const index = parseInt(part);
            current = current[index];
          } else {
            current = current[part];
          }
        }
        
        // Set the value at the final path
        current[pathParts[pathParts.length - 1]] = value;
        
        return { resumeData: newResumeData };
      }),
    }),
    {
      name: 'resume-storage', // unique name for localStorage key
    }
  )
)

export default resumeStore
