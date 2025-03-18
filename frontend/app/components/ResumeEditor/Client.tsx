"use client"

import React, { useRef, useEffect, useState } from 'react'
import resumeStore from "@/store/store"
import { motion, AnimatePresence } from "motion/react"
import { useRouter } from 'next/navigation'

const Client = () => {

    const router = useRouter();
    const iframeRef = useRef(null);
    const { 
        resumeData, color, setResumeData, updatePersonalInfo, 
        updateEducation, addEducation, removeEducation,
        updateCertification, addCertification, removeCertification,
        updateProject, addProject, removeProject, updateProjectLearning, 
        addProjectLearning, removeProjectLearning,
        updateAchievement, addAchievement, removeAchievement, 
        updateSkill, addSkill, removeSkill, updateExperience, updateExperienceDescription, addExperienceDescription, 
        removeExperienceDescription, updateAcademicAchievements, setEntireState } = resumeStore();
    
    const iframeLoadedRef = useRef(false);
    const [zoom, setZoom] = useState(1);

    // Function to send updates to the iframe
    
    const sendUpdateToIframe = (data) => {
        if (iframeRef.current ) {
            const messageId = Date.now(); // Simple ID for tracking
            console.log(`Sending update to iframe [${messageId}]`, data.action || "data update");
            iframeRef.current.contentWindow.postMessage({
                ...data,
                messageId
            }, '*');
        } else {
            console.warn("Cannot send update: iframe not loaded or contentWindow not available");
        }
    };


    const updateAcademicAchievement = (index, value) => {
        const newResumeData = { ...resumeData, academicAchievements: [...resumeData.academicAchievements] };
        newResumeData.academicAchievements[index] = value;
        setResumeData(newResumeData);
    }

    const addAcademicAchievement = () => {
        const newResumeData = { ...resumeData, academicAchievements: [...resumeData.academicAchievements, ""] };
        setResumeData(newResumeData);
    }

    const removeAcademicAchievement = (index) => {
        const newResumeData = { ...resumeData, academicAchievements: [...resumeData.academicAchievements] };
        newResumeData.academicAchievements = newResumeData.academicAchievements.filter((_, i) => i !== index);
        setResumeData(newResumeData);
    }

    // Send initial values when iframe loads
    const handleIframeLoad = () => {
        console.log("Iframe loaded, sending initial data");
        iframeLoadedRef.current = true;
        
        // Add a slight delay to ensure iframe is fully initialized
        setTimeout(() => {
            sendUpdateToIframe({ 
                resumeData, 
                action: 'init'  // Add an action to identify initial load
            });
        }, 100);
    };

    // Effect to resend data when resumeData or color changes
    useEffect(() => {
        if (iframeLoadedRef.current) {
            console.log("Sending update due to data change");
            sendUpdateToIframe({ resumeData, color });
        }
    }, [resumeData, color]);

    // Function to handle downloading PDF
    const handleDownloadPDF = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            // Send a message to prepare for PDF generation
            sendUpdateToIframe({ action: 'prepare-pdf' });
            
            // Give some time for styles to be applied
            setTimeout(() => {
                iframeRef.current.contentWindow.focus();
                iframeRef.current.contentWindow.print();
            }, 200);
        }
    };
    
    // State for active section
    const [activeSection, setActiveSection] = useState('personal');

    // Handle zoom controls
    const handleZoomIn = () => {
        const newZoom = Math.min(zoom + 0.1, 2);
        setZoom(newZoom);
        sendUpdateToIframe({ action: 'zoom', value: newZoom });
    };

    const handleZoomOut = () => {
        const newZoom = Math.max(zoom - 0.1, 0.5);
        setZoom(newZoom);
        sendUpdateToIframe({ action: 'zoom', value: newZoom });
    };

    const handleZoomReset = () => {
        setZoom(1);
        sendUpdateToIframe({ action: 'zoom', value: 1 });
    };

    // Handle academic achievements update
    const handleAcademicAchievementsUpdate = (value) => {
        const achievements = Array.isArray(value) ? value : value.split('\n');
        const newResumeData = { ...resumeData, academicAchievements: achievements };
        setResumeData(newResumeData);
    };

    // Initialize experience if needed
    useEffect(() => {
        if (!resumeData.experience) {
            const newResumeData = { 
                ...resumeData, 
                experience: [{
                    title: "",
                    organization: "",
                    duration: "",
                    period: "",
                    description: [""]
                }]
            };
            setResumeData(newResumeData);
        }
    }, []);

    // Add experience function if it doesn't exist
    const handleAddExperience = () => {
        if (!resumeData.experience) {
            const newResumeData = {
                ...resumeData,
                experience: [{
                    title: "",
                    organization: "",
                    duration: "",
                    period: "",
                    description: [""]
                }]
            };
            setResumeData(newResumeData);
        } else {
            const newResumeData = {
                ...resumeData,
                experience: [
                    ...resumeData.experience,
                    {
                        title: "",
                        organization: "",
                        duration: "",
                        period: "",
                        description: [""]
                    }
                ]
            };
            setResumeData(newResumeData);
        }
    };

    // Update experience function
    const handleUpdateExperience = (index, field, value) => {
        if (!resumeData.experience) return;
        
        const newExperience = [...resumeData.experience];
        newExperience[index] = {
            ...newExperience[index],
            [field]: value
        };
        
        const newResumeData = {
            ...resumeData,
            experience: newExperience
        };
        
        setResumeData(newResumeData);
    };

    // Remove experience function
    const handleRemoveExperience = (index) => {
        if (!resumeData.experience) return;
        
        const newExperience = resumeData.experience.filter((_, i) => i !== index);
        const newResumeData = {
            ...resumeData,
            experience: newExperience
        };
        
        setResumeData(newResumeData);
    };

    const handleRemoveProject = (index) => {
        if(!resumeData.projects) return;
        const newProjects = resumeData.projects.filter((_, i) => i !== index);
        const newResumeData = {
            ...resumeData,
            projects: newProjects
        };
        setResumeData(newResumeData);
    }
    // Add a listener for acknowledgment:
    useEffect(() => {
        const handleAcknowledgment = (event) => {
            if (event.data && event.data.type === 'ack') {
                console.log(`Message ${event.data.messageId} acknowledged`);
            }
        };
        
        window.addEventListener('message', handleAcknowledgment);
        return () => window.removeEventListener('message', handleAcknowledgment);
    }, []);

  return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col md:flex-row h-screen bg-[#f8f2f3]"
        >
            <button onClick={() => router.push('/')}>Resume</button>
            {/* Left side - Form */}
            <motion.div 
                className="w-full md:w-1/2 p-4 overflow-y-auto"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex justify-between items-center mb-4">
                    <motion.h1 
                        className="text-2xl font-bold text-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Resume Builder
                    </motion.h1>
                    <div className="flex space-x-2">
                        <motion.button 
                            onClick={handleZoomIn}
                            className="px-3 py-1 bg-black/50 text-white rounded hover:bg-black transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Zoom In"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </motion.button>
                        <motion.button 
                            onClick={handleZoomOut}
                            className="px-3 py-1 bg-black/50 text-white rounded hover:bg-black transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Zoom Out"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </motion.button>
                        <motion.button 
                            onClick={handleZoomReset}
                            className="px-3 py-1 bg-black/50 text-white rounded hover:bg-black transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Reset Zoom"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                        </motion.button>
                        <motion.button 
                            onClick={handleDownloadPDF}
                            className="px-4 py-1 bg-black/50 text-white rounded hover:bg-black transition-colors flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PDF
                        </motion.button>
                    </div>
                </div>
                
                {/* Navigation Tabs */}
                <div className="flex flex-wrap mb-4 border-b border-black">
                    {[
                        { id: 'personal', label: 'Personal' },
                        { id: 'education', label: 'Education' },
                        { id: 'experience', label: 'Experience' },
                        { id: 'projects', label: 'Projects' },
                        { id: 'skills', label: 'Skills' },
                        { id: 'achievements', label: 'Achievements' },
                        { id: 'certifications', label: 'Certifications' },
                    ].map((tab) => (
                        <motion.button 
                            key={tab.id}
                            className={`px-4 py-2 border border-black ${activeSection === tab.id ? 'bg-black text-white' : 'bg-black/50 text-white hover:bg-black'}`}
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                            onClick={() => setActiveSection(tab.id)}
                        >
                            {tab.label}
                        </motion.button>
                    ))}
                </div>
                
                {/* Personal Information Section */}
                <AnimatePresence mode="wait">
                    {activeSection === 'personal' && (
                        <motion.div 
                            key="personal"
                            className="mb-6 p-4 border border-black rounded"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h2 className="text-xl font-semibold mb-3 text-black">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-black">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-black rounded"
                                        value={resumeData.personalInfo.name} 
                                        onChange={(e) => {
                                            updatePersonalInfo('name', e.target.value)
                                            sendUpdateToIframe({ resumeData, name: e.target.value })
                                        }} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-black">Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full p-2 border border-black rounded"
                                        value={resumeData.personalInfo.email} 
                                        onChange={(e) => {
                                            updatePersonalInfo('email', e.target.value)
                                            sendUpdateToIframe({ resumeData, email: e.target.value })
                                        }} 
                                        
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-black">LinkedIn ID</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-black rounded"
                                        value={resumeData.personalInfo.linkedinId} 
                                        onChange={(e) => {
                                            updatePersonalInfo('linkedinId', e.target.value)
                                            sendUpdateToIframe({ resumeData, linkedinId: e.target.value })
                                        }} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-black">Contact Number</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-black rounded"
                                        value={resumeData.personalInfo.contactNo} 
                                        onChange={(e) => {
                                            updatePersonalInfo('contactNo', e.target.value)
                                            sendUpdateToIframe({ resumeData, contactNo: e.target.value })
                                        }} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-black">Date of Birth</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-2 border border-black rounded"
                                        value={resumeData.personalInfo.dob} 
                                        onChange={(e) => {
                                            updatePersonalInfo('dob', e.target.value)
                                            sendUpdateToIframe({ resumeData, dob: e.target.value })
                                        }} 
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1 text-black">Address</label>
                                    <textarea 
                                        className="w-full p-2 border border-black rounded"
                                        value={resumeData.personalInfo.address} 
                                        onChange={(e) => {
                                            updatePersonalInfo('address', e.target.value)
                                            sendUpdateToIframe({ resumeData, address: e.target.value })
                                        }} 
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    
                    {/* Education Section */}
                    {activeSection === 'education' && (
                        <motion.div 
                            key="education"
                            className="mb-6 p-4 border border-black rounded"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-semibold text-black">Education</h2>
                                <motion.button 
                                    className="px-3 py-1 bg-black/50 text-white rounded hover:bg-black transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        addEducation()
                                        sendUpdateToIframe({ resumeData, action: 'add-education' })
                                    }}
                                >
                                    Add Education
                                </motion.button>
                            </div>
                            
                            <AnimatePresence>
                                {resumeData.education.map((edu, index) => (
                                    <motion.div 
                                        key={index}
                                        className="mb-4 p-3 border border-black rounded"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex justify-between mb-2">
                                            <h3 className="font-medium text-black">Education #{index + 1}</h3>
                                            <motion.button 
                                                className="px-2 py-1 bg-black/50 text-white rounded text-sm hover:bg-black transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    removeEducation(index)
                                                    sendUpdateToIframe({ resumeData, action: 'remove-education', index })
                                                }}
                                            >
                                                Remove
                                            </motion.button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Degree/Title</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    value={edu.title} 
                                                    onChange={(e) => {
                                                        updateEducation(index, 'title', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-education', index, field: 'title', value: e.target.value })
                                                    }} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Institution</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    value={edu.institution} 
                                                    onChange={(e) => {
                                                        updateEducation(index, 'institution', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-education', index, field: 'institution', value: e.target.value })
                                                    }} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Period</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    placeholder="e.g., 2018-2022"
                                                    value={edu.period} 
                                                    onChange={(e) => {
                                                        updateEducation(index, 'period', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-education', index, field: 'period', value: e.target.value })
                                                    }} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Percentage/GPA</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    value={edu.percentage} 
                                                    onChange={(e) => {
                                                        updateEducation(index, 'percentage', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-education', index, field: 'percentage', value: e.target.value })
                                                    }} 
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-1 text-black">Academic Achievements</label>
                                <motion.button 
                                    className="px-3 py-1 bg-black/50 text-white rounded hover:bg-black transition-colors mb-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        addAcademicAchievement()
                                        sendUpdateToIframe({ resumeData, action: 'add-academic-achievement' })
                                    }}
                                >
                                    Add Achievement
                                </motion.button>
                                
                                <AnimatePresence>
                                    {resumeData.academicAchievements && resumeData.academicAchievements.map((achievement, index) => (
                                        <motion.div 
                                            key={index}
                                            className="mb-2 flex"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <input 
                                                type="text" 
                                                className="w-full p-2 border border-black rounded mr-2"
                                                value={achievement}
                                                onChange={(e) => {
                                                    updateAcademicAchievement(index, e.target.value)
                                                    sendUpdateToIframe({ resumeData, action: 'update-academic-achievement', index, field: 'achievement', value: e.target.value })
                                                }}
                                            />
                                            <motion.button 
                                                className="px-2 py-1 bg-black/50 text-white rounded text-sm hover:bg-black transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    removeAcademicAchievement(index)
                                                    sendUpdateToIframe({ resumeData, action: 'remove-academic-achievement', index })
                                                }}
                                            >
                                                Remove
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                    
                    {/* Experience Section */}
                    {activeSection === 'experience' && (
                        <motion.div 
                            key="experience"
                            className="mb-6 p-4 border border-black rounded"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-semibold text-black">Experience</h2>
                                <motion.button 
                                    className="px-3 py-1 bg-black/50 text-white rounded hover:bg-black transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={()=>{
                                        handleAddExperience()
                                        sendUpdateToIframe({ resumeData, action: 'add-experience' })
                                    }}
                                >
                                    Add Experience
                                </motion.button>
                            </div>
                            
                            <AnimatePresence>
                                {resumeData.experience && resumeData.experience.map((exp, index) => (
                                    <motion.div 
                                        key={index}
                                        className="mb-4 p-3 border border-black rounded"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex justify-between mb-2">
                                            <h3 className="font-medium text-black">Experience #{index + 1}</h3>
                                            <motion.button 
                                                className="px-2 py-1 bg-black/50 text-white rounded text-sm hover:bg-black transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    handleRemoveExperience(index)
                                                    sendUpdateToIframe({ resumeData, action: 'remove-experience', index })
                                                }}
                                            >
                                                Remove
                                            </motion.button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Title/Position</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    value={exp.title} 
                                                    onChange={(e) => {
                                                        updateExperience(index, 'title', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-experience', index, field: 'title', value: e.target.value })
                                                    }} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Organization/Company</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    value={exp.organization} 
                                                    onChange={(e) => {
                                                        updateExperience(index, 'organization', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-experience', index, field: 'organization', value: e.target.value })
                                                    }} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Duration</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    placeholder="e.g., 2 years"
                                                    value={exp.duration} 
                                                    onChange={(e) => {
                                                        updateExperience(index, 'duration', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-experience', index, field: 'duration', value: e.target.value })
                                                    }} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Period</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    placeholder="e.g., Jan 2020 - Present"
                                                    value={exp.period} 
                                                    onChange={(e) => {
                                                        updateExperience(index, 'period', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-experience', index, field: 'period', value: e.target.value })
                                                    }} 
                                                />
                                            </div>
                                            
                                            {/* Description Points */}
                                            <div className="md:col-span-2 mt-2">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-sm font-medium">Description Points</label>
                                                    <motion.button 
                                                        className="px-2 py-1 bg-black/50 text-white rounded text-sm hover:bg-black transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            addExperienceDescription(index, "")
                                                            sendUpdateToIframe({ resumeData, action: 'add-experience-description', index })
                                                        }}
                                                    >   
                                                        Add Point
                                                    </motion.button>
                                                </div>
                                                
                                                <AnimatePresence>
                                                    {exp.description.map((point, descIndex) => (
                                                        <motion.div 
                                                            key={descIndex}
                                                            className="flex items-center mb-2"
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <input 
                                                                type="text" 
                                                                className="flex-grow p-2 border border-black rounded"
                                                                value={point} 
                                                                onChange={(e) => {
                                                                    updateExperienceDescription(index, descIndex, e.target.value)
                                                                    sendUpdateToIframe({ resumeData, action: 'update-experience-description', index, descIndex, value: e.target.value })
                                                                }}
                                                            />
                                                            <motion.button 
                                                                className="ml-2 px-2 py-1 bg-black/50 text-white rounded text-sm hover:bg-black transition-colors"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => {
                                                                    removeExperienceDescription(index, descIndex)
                                                                    sendUpdateToIframe({ resumeData, action: 'remove-experience-description', index, descIndex })
                                                                }}
                                                            >
                                                                Remove
                                                            </motion.button>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                    
                    {/* Projects Section */}
                    {activeSection === 'projects' && (
                        <motion.div 
                            key="projects"
                            className="mb-6 p-4 border border-black rounded"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-semibold text-black">Projects</h2>
                                <motion.button 
                                    className="px-3 py-1 bg-black/50 text-white rounded hover:bg-black transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        addProject()
                                        sendUpdateToIframe({ resumeData, action: 'add-project' })
                                    }}
                                >
                                    Add Project
                                </motion.button>
                            </div>
                            
                            <AnimatePresence>
                                {resumeData.projects.map((project, index) => (
                                    <motion.div 
                                        key={index}
                                        className="mb-4 p-3 border border-black rounded"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex justify-between mb-2">
                                            <h3 className="font-medium text-black">Project #{index + 1}</h3>
                                            <motion.button 
                                                className="px-2 py-1 bg-black/50 text-white rounded text-sm hover:bg-black transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    handleRemoveProject(index)
                                                    sendUpdateToIframe({ resumeData, action: 'remove-project', index })
                                                }}
                                            >
                                                Remove
                                            </motion.button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Title</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    value={project.title} 
                                                    onChange={(e) => {
                                                        updateProject(index, 'title', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-project', index, field: 'title', value: e.target.value })
                                                    }} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Organization</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    value={project.organization} 
                                                    onChange={(e) => {
                                                        updateProject(index, 'organization', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-project', index, field: 'organization', value: e.target.value })
                                                    }} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Duration</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    placeholder="e.g., 3 months"
                                                    value={project.duration} 
                                                    onChange={(e) => {
                                                        updateProject(index, 'duration', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-project', index, field: 'duration', value: e.target.value })
                                                    }} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Period</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    placeholder="e.g., Jan 2022 - Mar 2022"
                                                    value={project.period} 
                                                    onChange={(e) => {
                                                        updateProject(index, 'period', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-project', index, field: 'period', value: e.target.value })
                                                    }} 
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-1 text-black">Description</label>
                                                <textarea 
                                                    className="w-full p-2 border border-black rounded"
                                                    value={project.description} 
                                                    onChange={(e) => {
                                                        updateProject(index, 'description', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-project', index, field: 'description', value: e.target.value })
                                                    }} 
                                                    rows={3}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-1 text-black">Skills Developed</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    placeholder="e.g., React, Node.js, MongoDB"
                                                    value={project.skillsDeveloped} 
                                                    onChange={(e) => {
                                                        updateProject(index, 'skillsDeveloped', e.target.value)
                                                        sendUpdateToIframe({ resumeData, action: 'update-project', index, field: 'skillsDeveloped', value: e.target.value })
                                                    }} 
                                                />
                                            </div>
                                            
                                            {/* Learning Points */}
                                            <div className="md:col-span-2 mt-2">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-sm font-medium text-black">Learning Points</label>
                                                    <motion.button 
                                                        className="px-2 py-1 bg-black/50 text-white rounded text-sm hover:bg-black transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            addProjectLearning(index, "")
                                                            sendUpdateToIframe({ resumeData, action: 'add-project-learning', index })
                                                        }}
                                                    >
                                                        Add Point
                                                    </motion.button>
                                                </div>
                                                
                                                <AnimatePresence>
                                                    {project.learning.map((point, learningIndex) => (
                                                        <motion.div 
                                                            key={learningIndex}
                                                            className="flex items-center mb-2"
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <input 
                                                                type="text" 
                                                                className="flex-grow p-2 border border-black rounded"
                                                                value={point} 
                                                                onChange={(e) => {
                                                                    updateProjectLearning(index, learningIndex, e.target.value)
                                                                    sendUpdateToIframe({ resumeData, action: 'update-project-learning', index, learningIndex, value: e.target.value })
                                                                }} 
                                                            />
                                                            <motion.button 
                                                                className="ml-2 px-2 py-1 bg-black/50 text-white rounded text-sm hover:bg-black transition-colors"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => {
                                                                    removeProjectLearning(index, learningIndex)
                                                                    sendUpdateToIframe({ resumeData, action: 'remove-project-learning', index, learningIndex })
                                                                }}
                                                            >
                                                                Remove
                                                            </motion.button>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                    
                    {/* Skills Section */}
                    {activeSection === 'skills' && (
                        <motion.div 
                            key="skills"
                            className="mb-6 p-4 border border-black rounded"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-semibold text-black">Skills</h2>
                                <motion.button 
                                    className="px-3 py-1 bg-black/50 text-white rounded hover:bg-black transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addSkill("")}
                                >
                                    Add Skill
                                </motion.button>
                            </div>
                            
                            <AnimatePresence>
                                {resumeData.skills.map((skill, index) => (
                                    <motion.div 
                                        key={index}
                                        className="flex items-center mb-2"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <input 
                                            type="text" 
                                            className="flex-grow p-2 border border-black rounded"
                                            value={skill} 
                                            onChange={(e) => updateSkill(index, e.target.value)} 
                                            placeholder="e.g., JavaScript, Project Management, etc."
                                        />
                                        <motion.button 
                                            className="ml-2 px-2 py-1 bg-black/50 text-white rounded text-sm hover:bg-black transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => removeSkill(index)}
                                        >
                                            Remove
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                    
                    {/* Achievements Section */}
                    {activeSection === 'achievements' && (
                        <motion.div 
                            key="achievements"
                            className="mb-6 p-4 border border-black rounded"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-semibold text-black">Achievements</h2>
                                <motion.button 
                                    className="px-3 py-1 bg-black/50 text-white rounded hover:bg-black transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addAchievement("")}
                                >
                                    Add Achievement
                                </motion.button>
                            </div>
                            
                            <AnimatePresence>
                                {resumeData.achievements.map((achievement, index) => (
                                    <motion.div 
                                        key={index}
                                        className="flex items-center mb-2"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <input 
                                            type="text" 
                                            className="flex-grow p-2 border border-black rounded"
                                            value={achievement} 
                                            onChange={(e) => updateAchievement(index, e.target.value)} 
                                            placeholder="Enter your achievement"
                                        />
                                        <motion.button 
                                            className="ml-2 px-2 py-1 bg-black/50 text-white rounded text-sm hover:bg-black transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => removeAchievement(index)}
                                        >
                                            Remove
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                    
                    {/* Certifications Section */}
                    {activeSection === 'certifications' && (
                        <motion.div 
                            key="certifications"
                            className="mb-6 p-4 border border-black rounded"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-semibold text-black">Certifications</h2>
                                <motion.button 
                                    className="px-3 py-1 bg-black/50 text-white rounded hover:bg-black transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addCertification({title: "", organization: "", period: ""})}
                                >
                                    Add Certification
                                </motion.button>
                            </div>
                            
                            <AnimatePresence>
                                {resumeData.certifications.map((cert, index) => (
                                    <motion.div 
                                        key={index}
                                        className="mb-4 p-3 border border-black rounded"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex justify-between mb-2">
                                            <h3 className="font-medium text-black">Certification #{index + 1}</h3>
                                            <motion.button 
                                                className="px-2 py-1 bg-black/50 text-white rounded text-sm hover:bg-black transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => removeCertification(index)}
                                            >
                                                Remove
                                            </motion.button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Title</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    value={cert.title} 
                                                    onChange={(e) => updateCertification(index, 'title', e.target.value)} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Organization</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    value={cert.organization} 
                                                    onChange={(e) => updateCertification(index, 'organization', e.target.value)} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-black">Period</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-black rounded"
                                                    placeholder="e.g., May 2023"
                                                    value={cert.period} 
                                                    onChange={(e) => updateCertification(index, 'period', e.target.value)} 
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            
            {/* Right side - Preview */}
            <motion.div 
                className="w-full md:w-1/2 p-4 bg-[#f8f2f3] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <motion.div 
                    className="relative w-full h-full overflow-hidden border border-black rounded bg-white"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <iframe 
                        ref={iframeRef}
                        src="/artboard" 
                        className="w-full h-full"
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}
                        onLoad={handleIframeLoad}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default Client
