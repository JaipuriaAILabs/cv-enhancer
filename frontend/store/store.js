import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define the initial resume data structure
const initialResumeData = {
  personalInfo: {
    name: "",
    email: "",
    linkedinId: "",
    contactNo: "",
    dob: "",
    address: ""
  },
  education: [
    {
      title: "",
      period: "",
      institution: "",
      percentage: ""
    }
  ],
  academicAchievements: [""],
  certifications: [
    {
      title: "",
      organization: "",
      period: ""
    }
  ],
  projects: [
    {
      title: "",
      organization: "",
      duration: "",
      period: "",
      description: "",
      learning: [""],
      skillsDeveloped: ""
    }
  ],
  achievements: [""],
  skills: [""],
  experience: [
    {
      title: "",
      organization: "",
      duration: "",
      period: "",
      description: [""]
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
      
      setName: (name) => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.personalInfo.name = name;
        return { resumeData: newResumeData };
      }),
      
      setEmail: (email) => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.personalInfo.email = email;
        return { resumeData: newResumeData };
      }),
      
      setLinkedinId: (linkedinId) => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.personalInfo.linkedinId = linkedinId;
        return { resumeData: newResumeData };
      }),
      
      setContactNo: (contactNo) => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.personalInfo.contactNo = contactNo;
        return { resumeData: newResumeData };
      }),
      
      setDob: (dob) => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.personalInfo.dob = dob;
        return { resumeData: newResumeData };
      }),
      
      setAddress: (address) => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.personalInfo.address = address;
        return { resumeData: newResumeData };
      }),
      
      // Education actions
      addEducation: (education = {
        title: "",
        period: "",
        institution: "",
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
      
      setEducationTitle: (index, title) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.education.length) {
          newResumeData.education[index].title = title;
        }
        return { resumeData: newResumeData };
      }),
      
      setEducationPeriod: (index, period) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.education.length) {
          newResumeData.education[index].period = period;
        }
        return { resumeData: newResumeData };
      }),
      
      setEducationInstitution: (index, institution) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.education.length) {
          newResumeData.education[index].institution = institution;
        }
        return { resumeData: newResumeData };
      }),
      
      setEducationPercentage: (index, percentage) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.education.length) {
          newResumeData.education[index].percentage = percentage;
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
      
      // Academic achievements actions
      addAcademicAchievement: (achievement = "") => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.academicAchievements = [...newResumeData.academicAchievements, achievement];
        return { resumeData: newResumeData }; 
      }),
      
      updateAcademicAchievement: (index, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.academicAchievements.length) {
          newResumeData.academicAchievements[index] = value;
        }
        return { resumeData: newResumeData };
      }),
      
      removeAcademicAchievement: (index) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.academicAchievements.length) {
          newResumeData.academicAchievements = newResumeData.academicAchievements.filter((_, i) => i !== index);
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
        description: "",
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
      
      setProjectTitle: (index, title) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.projects.length) {
          newResumeData.projects[index].title = title;
        }
        return { resumeData: newResumeData };
      }),
      
      setProjectOrganization: (index, organization) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.projects.length) {
          newResumeData.projects[index].organization = organization;
        }
        return { resumeData: newResumeData };
      }),
      
      setProjectDuration: (index, duration) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.projects.length) {
          newResumeData.projects[index].duration = duration;
        }
        return { resumeData: newResumeData };
      }),
      
      setProjectPeriod: (index, period) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.projects.length) {
          newResumeData.projects[index].period = period;
        }
        return { resumeData: newResumeData };
      }),
      
      setProjectDescription: (index, description) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.projects.length) {
          newResumeData.projects[index].description = description;
        }
        return { resumeData: newResumeData };
      }),
      
      setProjectSkillsDeveloped: (index, skillsDeveloped) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.projects.length) {
          newResumeData.projects[index].skillsDeveloped = skillsDeveloped;
        }
        return { resumeData: newResumeData };
      }),
      
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
      
      removeProject: (index) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.projects.length) {
          newResumeData.projects = newResumeData.projects.filter((_, i) => i !== index);
        }
        return { resumeData: newResumeData };
      }),
      
      // Achievements actions
      addAchievement: (achievement = "") => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.achievements = [...newResumeData.achievements, achievement];
        return { resumeData: newResumeData };
      }),
      
      updateAchievement: (index, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.achievements.length) {
          newResumeData.achievements[index] = value;
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
      
      // Experience actions
      addExperience: (experience = {
        title: "",
        organization: "",
        duration: "",
        period: "",
        description: [""]
      }) => set(state => {
        const newResumeData = { ...state.resumeData };
        newResumeData.experience = [...newResumeData.experience, experience];
        return { resumeData: newResumeData };
      }),
      
      updateExperience: (index, field, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.experience.length) {
          newResumeData.experience[index] = {
            ...newResumeData.experience[index],
            [field]: value
          };
        }
        return { resumeData: newResumeData };
      }),
      
      addExperienceDescription: (experienceIndex, description = "") => set(state => {
        const newResumeData = { ...state.resumeData };
        if (experienceIndex >= 0 && experienceIndex < newResumeData.experience.length) {
          newResumeData.experience[experienceIndex].description = [
            ...newResumeData.experience[experienceIndex].description,
            description
          ];
        }
        return { resumeData: newResumeData };
      }),
      
      updateExperienceDescription: (experienceIndex, descriptionIndex, value) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (
          experienceIndex >= 0 && 
          experienceIndex < newResumeData.experience.length &&
          descriptionIndex >= 0 &&
          descriptionIndex < newResumeData.experience[experienceIndex].description.length
        ) {
          newResumeData.experience[experienceIndex].description[descriptionIndex] = value;
        }
        return { resumeData: newResumeData };
      }),
      
      removeExperienceDescription: (experienceIndex, descriptionIndex) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (
          experienceIndex >= 0 && 
          experienceIndex < newResumeData.experience.length &&
          descriptionIndex >= 0 &&
          descriptionIndex < newResumeData.experience[experienceIndex].description.length
        ) {
          newResumeData.experience[experienceIndex].description = 
            newResumeData.experience[experienceIndex].description.filter((_, i) => i !== descriptionIndex);
        }
        return { resumeData: newResumeData };
      }),
      
      removeExperience: (index) => set(state => {
        const newResumeData = { ...state.resumeData };
        if (index >= 0 && index < newResumeData.experience.length) {
          newResumeData.experience = newResumeData.experience.filter((_, i) => i !== index);
        }
        return { resumeData: newResumeData };
      }),
      
      // Reset the entire resume data
      resetResumeData: () => set({ resumeData: initialResumeData }),
      
      // Set the entire resume data (useful for importing)
      setResumeData: (data) => set({ resumeData: data }),
      
      // Set the entire state directly with a complete JSON object
      setEntireState: (completeData) => set({ resumeData: completeData }),
      
      // A more generic update function
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
