"use client"

import React, { useRef, useEffect, useState } from 'react'
import resumeStore from "@/store/resume_store"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ResumeRenderer from '../ResumeRenderer'
import GeometricBackground from '../GeometricBackground'
import Link from 'next/link'



import { 
    User, 
    GraduationCap, 
    Briefcase, 
    FolderGit2, 
    Wrench, 
    Award,
    Download, 
    Loader2,
    LucideTrash,
    Plus,
    Minus,
} from 'lucide-react';
import ImageUploader from './editor_components/user_image'
// import { Certificate } from 'node:crypto'



const Controls = ({ zoomIn, zoomOut, resetTransform }) => {
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-100 rounded-lg shadow-lg p-2 flex space-x-2 z-10">

            <button
                onClick={zoomIn}
                className="w-8 h-8  hover:bg-gray-200 rounded-md flex items-center justify-center"
            >
                <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 1C7.77614 1 8 1.22386 8 1.5V7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H8V13.5C8 13.7761 7.77614 14 7.5 14C7.22386 14 7 13.7761 7 13.5V8H1.5C1.22386 8 1 7.77614 1 7.5C1 7.22386 1.22386 7 1.5 7H7V1.5C7 1.22386 7.22386 1 7.5 1Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                </svg>
            </button>
            <button
                onClick={zoomOut}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center"
            >
                <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 7C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5C1 7.22386 1.22386 7 1.5 7H13.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                </svg>
            </button>
            <button
                onClick={resetTransform}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center"
            >
                <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.85355 2.14645C5.04882 2.34171 5.04882 2.65829 4.85355 2.85355L3.70711 4H9C11.4853 4 13.5 6.01472 13.5 8.5C13.5 10.9853 11.4853 13 9 13H5C4.72386 13 4.5 12.7761 4.5 12.5C4.5 12.2239 4.72386 12 5 12H9C10.933 12 12.5 10.433 12.5 8.5C12.5 6.567 10.933 5 9 5H3.70711L4.85355 6.14645C5.04882 6.34171 5.04882 6.65829 4.85355 6.85355C4.65829 7.04882 4.34171 7.04882 4.14645 6.85355L2.14645 4.85355C1.95118 4.65829 1.95118 4.34171 2.14645 4.14645L4.14645 2.14645C4.34171 1.95118 4.65829 1.95118 4.85355 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};





const Client = () => {

    const router = useRouter();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { 
        resumeData, color, setResumeData, updatePersonalInfo, 
        updateEducation, addEducation, removeEducation,
        updateCertification, addCertification, removeCertification,
        updateProject, addProject, removeProject, updateProjectLearning, 
        addProjectLearning, removeProjectLearning,addProjectKeypoint, updateProjectKeypoint, removeProjectKeypoint,
        updateAchievement, addAchievement, removeAchievement, 
        updateSkill, addSkill, removeSkill, updateInternship, updateInternshipKeypoint, 
        addInternshipKeypoint, removeInternshipKeypoint, removeInternship } = resumeStore();
    
    const iframeLoadedRef = useRef(false);
    const [zoom, setZoom] = useState(1);
    const [scale, setScale] = useState(0.6);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // Function to send updates to the iframe
    
    const sendUpdateToIframe = (data: any) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
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


    const updateAcademicAchievement = (index: number, value: string) => {
        const newResumeData = { ...resumeData, academicAchievements: [...resumeData.academicAchievements] };
        newResumeData.academicAchievements[index] = value;
        setResumeData(newResumeData);
    }

    const addAcademicAchievement = () => {
        const newResumeData = { ...resumeData, academicAchievements: [...resumeData.academicAchievements, ""] };
        setResumeData(newResumeData);
    }

    const removeAcademicAchievement = (index: number) => {
        const newResumeData = { ...resumeData, academicAchievements: [...resumeData.academicAchievements] };
        newResumeData.academicAchievements = newResumeData.academicAchievements.filter((_: any, i: number) => i !== index);
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

   
    // State for active section
    const [activeSection, setActiveSection] = useState('personal');

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.1, 3)); // Max zoom 3x
        // Reset position when zooming
        setPosition({ x: 0, y: 0 });
      };
      
      const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.1, 0.5)); // Min zoom 0.5x
        // Reset position when zooming
        setPosition({ x: 0, y: 0 });
      };
      
      const handleResetTransform = () => {
        setScale(0.5);
        setPosition({ x: 0, y: 0 });
      };
      
      const handleMouseDown = (e) => {
        if (e.button === 0) { // Left mouse button
          setIsDragging(true);
          setDragStart({ 
            x: e.clientX - position.x, 
            y: e.clientY - position.y 
          });
        }
      };
      
      const handleMouseMove = (e) => {
        if (isDragging) {
          setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
          });
        }
      };
      
      const handleMouseUp = () => {
        setIsDragging(false);
      };
      
      const handleMouseLeave = () => {
        setIsDragging(false);
      };

    // Handle academic achievements update
    const handleAcademicAchievementsUpdate = (value: string) => {
        const achievements = Array.isArray(value) ? value : value.split('\n');
        const newResumeData = { ...resumeData, academicAchievements: achievements };
        setResumeData(newResumeData);
    };

    // Initialize internships if needed
    useEffect(() => {
        if (!resumeData.internships) {
            const newResumeData = { 
                ...resumeData, 
                internships: [{
                    organization: "",
                    duration: "",
                    location: "",
                    period: "",
                    summary: "",
                    keypoints: [""]
                }]
            };
            setResumeData(newResumeData);
        }
    }, []);

    // Add internship function if it doesn't exist
    const handleAddInternship = () => {
        if (!resumeData.internships) {
            const newResumeData = {
                ...resumeData,
                internships: [{
                    organization: "",
                    duration: "",
                    location: "",
                    period: "",
                    summary: "",
                    keypoints: [""]
                }]
            };
            setResumeData(newResumeData);
        } else {
            const newResumeData = {
                ...resumeData,
                internships: [
                    ...resumeData.internships,
                    {
                        organization: "",
                        duration: "",
                        location: "",
                        period: "",
                        summary: "",
                        keypoints: [""]
                    }
                ]
            };
            setResumeData(newResumeData);
        }
    };

    // Add a listener for acknowledgment:
    useEffect(() => {
        const handleAcknowledgment = (event: any) => {
            if (event.data && event.data.type === 'ack') {
                console.log(`Message ${event.data.messageId} acknowledged`);
            }
        };
        
        window.addEventListener('message', handleAcknowledgment);
        return () => window.removeEventListener('message', handleAcknowledgment);
    }, []);

    const downloadPDF = async () => {
        try {
            setIsGeneratingPDF(true);
            
            // Get resume data from your store
            const { resumeData } = resumeStore.getState();
            
            const response = await fetch('/api/download_resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ resumeData }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'resume.pdf';
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setIsGeneratingPDF(false);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
            setIsGeneratingPDF(false);
        }
    };

    const sections = [
        { id: 'personal', icon: User, label: 'Personal' },
        { id: 'education', icon: GraduationCap, label: 'Education' },
        { id: 'internships', icon: Briefcase, label: 'Internships' },
        { id: 'projects', icon: FolderGit2, label: 'Projects' },
        { id: 'skills', icon: Wrench, label: 'Skills' },
        { id: 'certifications', icon: Wrench, label: 'Certifications' },
        { id: 'achievements', icon: Award, label: 'Achievements' },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col md:flex-row bg-[#f8f2f3]/30 min-h-screen w-full mx-auto"
        >   
            <GeometricBackground />

            <div className="w-full max-w-[1440px] mx-auto p-4 space-y-4">
                {/* Modern Top Bar */}
                <div className="z-50 w-full">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                        {/* Logo Section - More responsive */}
                        <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
                            <Link href="/">
                            <img 
                                src="/jim_logo.png" 
                                alt="Jaipuria Institute of Management" 
                                className="w-24 md:w-32 h-auto object-contain px-2"
                            />
                            </Link>
                            <div className="flex items-center">
                                <span className="w-0.5 mx-1 text-[#ef7f1a] text-3xl">/</span>
                                <span className="text-gray-500 text-sm md:text-lg px-2 font-bold">OneCV</span>
                                <span className="w-0.5 mx-1 text-[#ef7f1a] text-3xl">/</span>
                                <span className="text-gray-500 text-sm md:text-lg px-2 font-bold">Edit</span>
                            </div>
                        </div>

                        {/* Navigation Pills - Improved scrolling */}
                        <nav className="flex-1 w-full md:w-auto overflow-x-auto scrollbar-hide">
                            <div className="flex gap-2 justify-start md:justify-center items-center border border-black/10 bg-[#f7f0f0] py-2 px-2 rounded-full min-w-max">
                                {sections.map(({ id, icon: Icon, label }) => (
                                    <motion.button
                                        key={id}
                                        onClick={() => setActiveSection(id)}
                                        className={`
                                            flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm
                                            whitespace-nowrap transition-all duration-200 ease-in-out
                                            ${activeSection === id 
                                                ? 'bg-[#ef7f1a] text-white' 
                                                : 'hover:bg-black/10 text-gray-700'
                                            }
                                        `}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        <span className="hidden md:inline">{label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </nav>

                        {/* Actions Section - More responsive */}
                        <div className="flex items-center justify-end w-full md:w-auto">
                            <motion.button 
                                onClick={downloadPDF}
                                disabled={isGeneratingPDF}
                                className={`
                                    px-3 md:px-4 py-2 rounded-md flex items-center gap-2
                                    transition-all duration-200 min-w-[100px] justify-center
                                    ${isGeneratingPDF 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-[#ef7f1a]/70 hover:bg-[#ef7f1a]'
                                    }
                                    text-white font-medium
                                `}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isGeneratingPDF ? (
                                    <>
                                        <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                        <span className="hidden md:inline">Generating...</span>
                                        <span className="inline md:hidden">...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="hidden md:inline">Download PDF</span>
                                        <span className="inline md:hidden">PDF</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid - Improved responsiveness */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)]">
                    {/* Left side - Form */}
                    <motion.div 
                        className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2"
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AnimatePresence mode="wait">
                            {/* Personal Information Section */}
                            {activeSection === 'personal' && (
                                <motion.div 
                                    key="personal"
                                    className="mb-6 p-4 border border-black/10 rounded-md bg-[#f0e5e5]/10 backdrop-blur-sm"
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 0 }}
                                >
                                    <h2 className="text-xl mb-8 font-semibold text-black">Personal Information</h2>
                                    
                                    {/* Image uploader at the top of personal information */}
                                    <div className="flex justify-center mb-8">
                                        <ImageUploader />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-black">Full Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-2 border  "
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
                                                className="w-full p-2 border  "
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
                                                className="w-full p-2 border  "
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
                                                className="w-full p-2 border  "
                                                value={resumeData.personalInfo.contactNo} 
                                                onChange={(e) => {
                                                    updatePersonalInfo('contactNo', e.target.value)
                                                    sendUpdateToIframe({ resumeData, contactNo: e.target.value })
                                                }} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-black">Course</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-2 border "
                                                value={resumeData.personalInfo.course} 
                                                onChange={(e) => {
                                                    updatePersonalInfo('course', e.target.value)
                                                    sendUpdateToIframe({ resumeData, course: e.target.value })
                                                }} 
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1 text-black">Summary</label>
                                            <textarea 
                                                className="w-full p-2 border "
                                                value={resumeData.personalInfo.summary} 
                                                onChange={(e) => {
                                                    updatePersonalInfo('summary', e.target.value)
                                                    sendUpdateToIframe({ resumeData, summary: e.target.value })
                                                }} 
                                                rows={6}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* Education Section */}
                            {activeSection === 'education' && (
                                <motion.div 
                                    key="education"
                                    className="mb-6 p-4 border border-black/10  bg-[#f0e5e5]/10 backdrop-blur-sm rounded-md"
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 0 }}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <h2 className="text-xl font-semibold text-black">Education</h2>
                                        <div className='w-full bg-black/10 h-[1px] mx-2'></div>
                                        <motion.button 
                                            className="p-1 rounded-full border-black/50 border text-black/50 hover:text-white hover:bg-black transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                addEducation()
                                                sendUpdateToIframe({ resumeData, action: 'add-education' })
                                            }}
                                        >
                                            <Plus className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                    
                                    <AnimatePresence>
                                        {resumeData.education.map((edu: any, index: number) => (
                                            <motion.div 
                                                key={index}
                                                className="mb-4 p-3 border border-black/10 rounded-md"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="flex justify-between mb-2">
                                                    <h3 className="font-medium text-black">Education #{index + 1}</h3>
                                                    <motion.button 
                                                        className="px-2 py-2  text-black/50  hover:text-black  text-sm  rounded-full transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            removeEducation(index)
                                                            sendUpdateToIframe({ resumeData, action: 'remove-education', index })
                                                        }}
                                                    >
                                                        <LucideTrash />
                                                    </motion.button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1 text-black">Degree/Title</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full p-2 border "
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
                                                            className="w-full p-2 border "
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
                                                            className="w-full p-2 border "
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
                                                            className="w-full p-2 border "
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
                                    
                                    
                                </motion.div>
                            )}
                            
                            {/* Internships Section */}
                            {activeSection === 'internships' && (
                                <motion.div 
                                    key="internships"
                                    className="mb-6 p-4 border border-black/10  bg-[#f0e5e5]/10 backdrop-blur-sm rounded-md"
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 0 }}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <h2 className="text-xl font-semibold text-black">Internships</h2>
                                        <div className='w-full bg-black/10 h-[1px] mx-2'></div>
                                        <motion.button 
                                            className="p-1 rounded-full border-black/50 border text-black/50 hover:text-white hover:bg-black transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={()=>{
                                                handleAddInternship()
                                                sendUpdateToIframe({ resumeData, action: 'add-internship' })
                                            }}
                                        >
                                            <Plus className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                    
                                    <AnimatePresence>
                                        {resumeData.internships && resumeData.internships.map((internship: any, index: number) => (
                                            <motion.div 
                                                key={index}
                                                className="mb-4 p-3 border border-black/10 rounded-md"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="flex justify-between mb-2">
                                                    <h3 className="font-medium text-black">Internship #{index + 1}</h3>
                                                    <motion.button 
                                                        className="px-2 py-2   text-black/50  text-sm hover:text-black rounded-full transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            removeInternship(index, 0)
                                                            sendUpdateToIframe({ resumeData, action: 'remove-internship-keypoint', index, keypointIndex: 0 })
                                                        }}
                                                    >
                                                        <LucideTrash />
                                                    </motion.button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1 text-black">Organization/Company</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full p-2 border "
                                                            value={internship.organization} 
                                                            onChange={(e) => {
                                                                updateInternship(index, 'organization', e.target.value)
                                                                sendUpdateToIframe({ resumeData, action: 'update-internship', index, field: 'organization', value: e.target.value })
                                                            }} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1 text-black">Duration</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full p-2 border "
                                                            placeholder="e.g., 2 months"
                                                            value={internship.duration} 
                                                            onChange={(e) => {
                                                                updateInternship(index, 'duration', e.target.value)
                                                                sendUpdateToIframe({ resumeData, action: 'update-internship', index, field: 'duration', value: e.target.value })
                                                            }} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1 text-black">Location</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full p-2 bord
                                                            k, NY"
                                                            value={internship.location} 
                                                            onChange={(e) => {
                                                                updateInternship(index, 'location', e.target.value)
                                                                sendUpdateToIframe({ resumeData, action: 'update-internship', index, field: 'location', value: e.target.value })
                                                            }} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1 text-black">Period</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full p-2 border "
                                                            placeholder="e.g., Jan 2020 - Mar 2020"
                                                            value={internship.period} 
                                                            onChange={(e) => {
                                                                updateInternship(index, 'period', e.target.value)
                                                                sendUpdateToIframe({ resumeData, action: 'update-internship', index, field: 'period', value: e.target.value })
                                                            }} 
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium mb-1 text-black">Summary</label>
                                                        <textarea 
                                                            className="w-full p-2 border "
                                                            value={internship.summary} 
                                                            onChange={(e) => {
                                                                updateInternship(index, 'summary', e.target.value)
                                                                sendUpdateToIframe({ resumeData, action: 'update-internship', index, field: 'summary', value: e.target.value })
                                                            }} 
                                                            rows={2}
                                                        />
                                                    </div>
                                                    
                                                    {/* Key Points */}
                                                    <div className="md:col-span-2 mt-2">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="block text-sm font-medium text-nowrap">Key Points</label>
                                                            <div className='w-full bg-black/10 h-[1px] mx-2'></div>
                                                            <motion.button 
                                                                className="p-1 rounded-full border-black/50 border text-black/50 hover:text-white hover:bg-black transition-colors"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => {
                                                                    addInternshipKeypoint(index, '')
                                                                    sendUpdateToIframe({ resumeData, action: 'add-internship-keypoint', index })
                                                                }}
                                                            >   
                                                                <Plus className="w-5 h-5" />
                                                            </motion.button>
                                                        </div>
                                                        
                                                        <AnimatePresence>
                                                            {internship.keypoints.map((point: string, keypointIndex: number) => (
                                                                <motion.div 
                                                                    key={keypointIndex}
                                                                    className="flex items-center mb-2"
                                                                    initial={{ opacity: 0, y: 5 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <input 
                                                                        type="text" 
                                                                        className="flex-grow p-2 border "
                                                                        value={point} 
                                                                        onChange={(e) => {
                                                                            updateInternshipKeypoint(index, keypointIndex, e.target.value)
                                                                            sendUpdateToIframe({ resumeData, action: 'update-internship-keypoint', index, keypointIndex, value: e.target.value })
                                                                        }}
                                                                    />
                                                                    <motion.button 
                                                                        className="ml-2 px-2 py-2   text-black/50  text-sm hover:text-black rounded-full transition-colors"
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        onClick={() => {
                                                                            removeInternshipKeypoint(index, keypointIndex)
                                                                            sendUpdateToIframe({ resumeData, action: 'remove-internship-keypoint', index, keypointIndex })
                                                                        }}
                                                                    >
                                                                        <Plus className="w-5 h-5 rotate-45" />
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
                                    className="mb-6 p-4 border border-black/10 bg-[#f0e5e5]/10 backdrop-blur-sm rounded-md"
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 0 }}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <h2 className="text-xl font-semibold text-black">Projects</h2>
                                        <div className='w-full bg-black/10 h-[1px] mx-2'></div>
                                        <motion.button 
                                            className="p-1 rounded-full border-black/50 border text-black/50 hover:text-white hover:bg-black transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addProject()}
                                        >
                                            <Plus className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                    
                                    <AnimatePresence>
                                        {resumeData.projects.map((project, index) => (
                                            <motion.div 
                                                key={index}
                                                className="mb-4 p-3 border border-black/10 rounded-md"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="flex justify-between mb-2">
                                                    <h3 className="font-medium text-black">Project #{index + 1}</h3>
                                                    <motion.button 
                                                        className="px-2 py-2 text-black/50 text-sm hover:text-black rounded-full transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            removeProject(index)
                                                            sendUpdateToIframe({ resumeData, action: 'remove-project', index })
                                                        }}
                                                    >
                                                        <LucideTrash />
                                                    </motion.button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1 text-black">Title</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full p-2 border "
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
                                                            className="w-full p-2 border "
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
                                                            className="w-full p-2 border "
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
                                                            className="w-full p-2 border "
                                                            placeholder="e.g., Jan 2022 - Mar 2022"
                                                            value={project.period} 
                                                            onChange={(e) => {
                                                                updateProject(index, 'period', e.target.value)
                                                                sendUpdateToIframe({ resumeData, action: 'update-project', index, field: 'period', value: e.target.value })
                                                            }} 
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium mb-1 text-black">Summary</label>
                                                        <textarea 
                                                            className="w-full p-2 border "
                                                            value={project.summary} 
                                                            onChange={(e) => {
                                                                updateProject(index, 'summary', e.target.value)
                                                                sendUpdateToIframe({ resumeData, action: 'update-project', index, field: 'summary', value: e.target.value })
                                                            }} 
                                                            rows={3}
                                                        />
                                                    </div>

                                                    
                                                    {/* Learning Points */}
                                                    <div className="md:col-span-2 mt-2">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="block text-sm font-medium text-nowrap">Learning Points</label>
                                                            <div className='w-full bg-black/10 h-[1px] mx-2'></div>
                                                            <motion.button 
                                                                className="p-1 rounded-full border-black/50 border text-black/50 hover:text-white hover:bg-black transition-colors"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => {
                                                                    addProjectLearning(index, "")
                                                                    sendUpdateToIframe({ resumeData, action: 'add-project-learning', index })
                                                                }}
                                                            >
                                                                <Plus className="w-5 h-5" />
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
                                                                        className="flex-grow p-2 border "
                                                                        value={point} 
                                                                        onChange={(e) => {
                                                                            updateProjectLearning(index, learningIndex, e.target.value)
                                                                            sendUpdateToIframe({ resumeData, action: 'update-project-learning', index, learningIndex, value: e.target.value })
                                                                        }} 
                                                                    />
                                                                    <motion.button 
                                                                        className="ml-2 px-2 py-2 text-black/50 text-sm hover:text-black rounded-full transition-colors"
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        onClick={() => {
                                                                            removeProjectLearning(index, learningIndex)
                                                                            sendUpdateToIframe({ resumeData, action: 'remove-project-learning', index, learningIndex })
                                                                        }}
                                                                    >
                                                                        <Plus className="w-5 h-5 rotate-45" />
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
                                    className="mb-6 p-4 border border-black/10 bg-[#f0e5e5]/10 backdrop-blur-sm rounded-md"
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 0 }}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <h2 className="text-xl font-semibold text-black">Skills</h2>
                                        <div className='w-full bg-black/10 h-[1px] mx-2'></div>
                                        <motion.button 
                                            className="p-1 rounded-full border-black/50 border text-black/50 hover:text-white hover:bg-black transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addSkill("")}
                                        >
                                            <Plus className="w-5 h-5" />
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
                                                    className="flex-grow p-2 border "
                                                    value={skill} 
                                                    onChange={(e) => updateSkill(index, e.target.value)} 
                                                    placeholder="e.g., JavaScript, Project Management, etc."
                                                />
                                                <motion.button 
                                                    className="ml-2 px-2 py-2 text-black/50 text-sm hover:text-black rounded-full transition-colors"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => removeSkill(index)}
                                                >
                                                    <LucideTrash />
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
                                    className="mb-6 p-4 border border-black/10 bg-[#f0e5e5]/10 backdrop-blur-sm rounded-md"
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 0 }}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <h2 className="text-xl font-semibold text-black">Achievements</h2>
                                        <div className='w-full bg-black/10 h-[1px] mx-2'></div>
                                        <motion.button 
                                            className="p-1 rounded-full border-black/50 border text-black/50 hover:text-white hover:bg-black transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addAchievement({title: "", organization: "", summary: ""})}
                                        >
                                            <Plus className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                    
                                    <AnimatePresence>
                                        {resumeData.achievements.map((achievement, index) => (
                                            <motion.div 
                                                key={index}
                                                className="mb-4 p-3 border border-black/10 rounded-md"
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="flex justify-between mb-2">
                                                    <h3 className="font-medium text-black">Achievement #{index + 1}</h3>
                                                    <motion.button 
                                                        className="px-2 py-2 text-black/50 text-sm hover:text-black rounded-full transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => removeAchievement(index)}
                                                    >
                                                        <LucideTrash />
                                                    </motion.button>
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1 text-black">Title</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full p-2 border border-gray-300 rounded transition-colors"
                                                            value={achievement.title} 
                                                            onChange={(e) => updateAchievement(index, 'title', e.target.value)} 
                                                            placeholder="Enter achievement title"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1 text-black">Summary</label>
                                                        <textarea 
                                                            className="w-full p-2 border border-gray-300 rounded   transition-colors min-h-[80px]"
                                                            value={achievement.summary} 
                                                            onChange={(e) => updateAchievement(index, 'summary', e.target.value)} 
                                                            placeholder="Describe your achievement"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                            
                            {/* Certifications Section */}
                            {activeSection === 'certifications' && (
                                <motion.div 
                                    key="certifications"
                                    className="mb-6 p-4 border border-black/10 bg-[#f0e5e5]/10 backdrop-blur-sm rounded-md"
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 0 }}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <h2 className="text-xl font-semibold text-black">Certifications</h2>
                                        <div className='w-full bg-black/10 h-[1px] mx-2'></div>
                                        <motion.button 
                                            className="p-1 rounded-full border-black/50 border text-black/50 hover:text-white hover:bg-black transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addCertification({title: "", organization: "", period: ""})}
                                        >
                                            <Plus className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                    
                                    <AnimatePresence>
                                        {resumeData.certifications.map((cert, index) => (
                                            <motion.div 
                                                key={index}
                                                className="mb-4 p-3 border border-black/10 rounded-md"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="flex justify-between mb-2">
                                                    <h3 className="font-medium text-black">Certification #{index + 1}</h3>
                                                    <motion.button 
                                                        className="px-2 py-2 text-black/50 text-sm hover:text-black rounded-full transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => removeCertification(index)}
                                                    >
                                                        <LucideTrash />
                                                    </motion.button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1 text-black">Title</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full p-2 border "
                                                            value={cert.title} 
                                                            onChange={(e) => {
                                                                updateCertification(index, 'title', e.target.value)
                                                                sendUpdateToIframe({ resumeData, action: 'update-certification', index, field: 'title', value: e.target.value })
                                                            }} 
                                                        />
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1 text-black">Period</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full p-2 border "
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
                    
                    {/* Right side - Preview with improved responsiveness */}
                    <div 
                        className="relative w-full h-full hidden md:flex items-center justify-center overflow-hidden backdrop-blur-[3px] border border-black/10 rounded-lg bg-black/40"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            <div 
                                style={{
                                    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                                    transformOrigin: 'center center',
                                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                                }}
                                className="bg-transparent rounded-md p-2"
                                ref={iframeRef}
                            >
                                <ResumeRenderer resume_json={resumeData} loading={false}/>
                            </div>
                            <Controls 
                                zoomIn={handleZoomIn} 
                                zoomOut={handleZoomOut} 
                                resetTransform={handleResetTransform} 
                            />
                        </div>
                    </div>

                    {/* Mobile Preview Button - Improved positioning */}
                    <div className="md:hidden fixed bottom-4 right-4 z-50">
                        <motion.button 
                            className="px-4 py-2 bg-[#ef7f1a] text-white rounded-full shadow-lg flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                alert("Preview mode is optimized for larger screens. Please use a tablet or desktop for the best experience.");
                            }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Preview</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default Client
