"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import resumeStore from "@/store/store"

const Artboard = () => {
    // Get initial values from the store
    const { resumeData, color } = resumeStore();
    const resumeRef = useRef(null);
    
    // Local state for immediate updates
    const [localResumeData, setLocalResumeData] = useState(resumeData);
    const [localColor, setLocalColor] = useState(color);
    const [isPrinting, setIsPrinting] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    // Update local state when store values change
    useEffect(() => {
        setLocalResumeData(resumeData);
    }, [resumeData]);

    useEffect(() => {
        setLocalColor(color);
    }, [color]);

    // Mouse event handlers for panning
    const handleMouseDown = (e) => {
        if (e.button === 0) { // Left mouse button
            setIsDragging(true);
            setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - startPos.x,
                y: e.clientY - startPos.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Reset pan position
    const resetPosition = () => {
        setPosition({ x: 0, y: 0 });
    };

    // Define message handler using useCallback to ensure it's stable
    // but still has access to the latest state through function closures
    const handleMessage = useCallback((event) => {
        console.log("Artboard received message:", event.data);
        const data = event.data;
        
        // Acknowledge receipt
        if (data.messageId) {
            window.parent.postMessage({
                type: 'ack',
                messageId: data.messageId
            }, '*');
        }
        
        // Force update for initialization messages
        if (data.action === 'init') {
            if (data.resumeData) setLocalResumeData(data.resumeData);
            if (data.color) setLocalColor(data.color);
            console.log("Initialized with data from parent");
            return;
        }
        
        // Handle normal updates
        if (data.resumeData) {
            console.log("Updating local resume data");
            setLocalResumeData(data.resumeData);
        }
        
        if (data.color) {
            console.log("Updating color");
            setLocalColor(data.color);
        }
        
        // Handle zoom action
        if (data.action === 'zoom' && data.value !== undefined) {
            setZoom(data.value);
            resetPosition(); // Reset pan position when zooming
        }
        
        // Handle PDF preparation
        if (data.action === 'prepare-pdf') {
            setIsPrinting(true);
            // Reset printing state after print dialog closes
            window.onafterprint = () => {
                setIsPrinting(false);
            };
        }
    }, []);  // Empty dependency array since the setters don't change

    // Set up message listener
    useEffect(() => {
        // Add event listener
        window.addEventListener('message', handleMessage);
        window.addEventListener('mouseup', handleMouseUp);
        
        // Clean up
        return () => {
            window.removeEventListener('message', handleMessage);
            window.removeEventListener('mouseup', handleMouseUp);
            window.onafterprint = null;
        };
    }, [handleMessage]);

    // Add mouse move listener
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
        }
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDragging, handleMouseMove]);

    // Add a "ready" signal when the iframe first loads
    useEffect(() => {
        // Signal to parent that iframe is ready
        const signalReady = () => {
            console.log("Artboard signaling ready to parent");
            window.parent.postMessage({ type: 'iframe-ready' }, '*');
        };
        
        // Signal immediately and again after a short delay to ensure parent received it
        signalReady();
        const timer = setTimeout(signalReady, 300);
        
        return () => clearTimeout(timer);
    }, []);

    // Print-specific styles
    const printStyles = `
        @media print {
            @page {
                size: A4;
                margin: 0.5cm;
            }
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                background-color: white !important;
            }
            .resume-container {
                padding: 0 !important;
                margin: 0 !important;
                transform: none !important;
                max-width: none !important;
                box-shadow: none !important;
            }
            h2 {
                page-break-after: avoid;
            }
            h3, h4 {
                page-break-after: avoid;
            }
            section {
                page-break-inside: avoid;
            }
        }
    `;

  return (
        <>
            <style jsx global>{printStyles}</style>
            
            <div 
                className={`min-h-screen ${isPrinting ? 'p-0' : 'p-0'} font-sans overflow-hidden`}
                style={{ backgroundColor: isPrinting ? 'white' : localColor }}
                onMouseDown={!isPrinting ? handleMouseDown : undefined}
            >
                <div 
                    ref={resumeRef}
                    className={`resume-container bg-white p-8 ${isPrinting ? 'max-w-none shadow-none' : 'max-w-2xl mx-auto shadow-lg'}`}
                    style={{
                        transform: isPrinting ? 'none' : `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                        transformOrigin: 'center top',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                >
                    {/* Header / Personal Info */}
                    <section className="border-b pb-4 mb-6">
                        <h1 className="text-3xl font-bold mb-1">{localResumeData.personalInfo.name}</h1>
                        <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                            {localResumeData.personalInfo.email && (    
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {localResumeData.personalInfo.email}
                                </div>
                            )}
                            {localResumeData.personalInfo.contactNo && (
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {localResumeData.personalInfo.contactNo}
                                </div>
                            )}
                            {localResumeData.personalInfo.linkedinId && (
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                    {localResumeData.personalInfo.linkedinId}
                                </div>
                            )}
                            {localResumeData.personalInfo.address && (
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {localResumeData.personalInfo.address}
                                </div>
                            )}
                        </div>
                    </section>
                    
                    {/* Education Section */}
                    {localResumeData.education.length > 0  && (
                        <section className="mb-6">
                            <h2 className="text-xl font-bold mb-3 border-b pb-1">Education</h2>
                            <div className="space-y-4">
                                {localResumeData.education.map((edu, index) => (
                                    <div key={index} className="flex flex-col md:flex-row">
                                        <div className="md:w-1/4 font-medium text-gray-600">
                                            {edu.period}
                                        </div>
                                        <div className="md:w-3/4">
                                            <h3 className="font-semibold">{edu.title}</h3>
                                            <p>{edu.institution}</p>
                                            {edu.percentage && <p className="text-sm text-gray-600">Grade: {edu.percentage}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {Array.isArray(localResumeData.academicAchievements) && localResumeData.academicAchievements.length > 0 && localResumeData.academicAchievements[0] && (
                                <div className="mt-3">
                                    <h3 className="font-semibold">Academic Achievements</h3>
                                    <ul className="list-disc pl-5">
                                        {localResumeData.academicAchievements.map((achievement, index) => (
                                            <li key={index}>{achievement}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </section>
                    )}
                    
                    {/* Experience Section */}
                    {localResumeData.experience && localResumeData.experience.length > 0 && localResumeData.experience[0].title && (
                        <section className="mb-6">
                            <h2 className="text-xl font-bold mb-3 border-b pb-1">Experience</h2>
                            <div className="space-y-6">
                                {localResumeData.experience.map((exp, index) => (
                                    <div key={index}>
                                        <div className="flex flex-col md:flex-row justify-between mb-1">
                                            <h3 className="font-semibold">{exp.title}</h3>
                                            <div className="text-sm text-gray-600">
                                                {exp.organization && <span>{exp.organization} • </span>}
                                                {exp.period}
                                                {exp.duration && <span> ({exp.duration})</span>}
                                            </div>
                                        </div>
                                        {exp.description && exp.description.length > 0 && (
                                            <ul className="list-disc pl-5 text-sm">
                                                {exp.description.map((point, i) => (
                                                    <li key={i}>{point}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {/* Projects Section */}
                    {localResumeData.projects && localResumeData.projects.length > 0 && localResumeData.projects[0].title && (
                        <section className="mb-6">
                            <h2 className="text-xl font-bold mb-3 border-b pb-1">Projects</h2>
                            <div className="space-y-6">
                                {localResumeData.projects.map((project, index) => (
                                    <div key={index}>
                                        <div className="flex flex-col md:flex-row justify-between mb-1">
                                            <h3 className="font-semibold">{project.title}</h3>
                                            <div className="text-sm text-gray-600">
                                                {project.organization && <span>{project.organization} • </span>}
                                                {project.period}
                                                {project.duration && <span> ({project.duration})</span>}
                                            </div>
                                        </div>
                                        {project.description && (
                                            <p className="mb-2">{project.description}</p>
                                        )}
                                        {project.learning && project.learning.length > 0 && project.learning[0] && (
                                            <div className="mb-2">
                                                <h4 className="text-sm font-semibold">Key Learnings:</h4>
                                                <ul className="list-disc pl-5 text-sm">
                                                    {project.learning.map((point, i) => (
                                                        <li key={i}>{point}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {project.skillsDeveloped && (
                                            <div className="text-sm">
                                                <span className="font-semibold">Skills:</span> {project.skillsDeveloped}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {/* Skills Section */}
                    {localResumeData.skills && localResumeData.skills.length > 0 && localResumeData.skills[0] && (
                        <section className="mb-6">
                            <h2 className="text-xl font-bold mb-3 border-b pb-1">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {localResumeData.skills.map((skill, index) => (
                                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm border border-gray-300">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {/* Achievements Section */}
                    {localResumeData.achievements && localResumeData.achievements.length > 0 && localResumeData.achievements[0] && (
                        <section className="mb-6">
                            <h2 className="text-xl font-bold mb-3 border-b pb-1">Achievements</h2>
                            <ul className="list-disc pl-5">
                                {localResumeData.achievements.map((achievement, index) => (
                                    <li key={index} className="mb-1">{achievement}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                    
                    {/* Certifications Section */}
                    {localResumeData.certifications && localResumeData.certifications.length > 0 && 
                     (typeof localResumeData.certifications[0] === 'string' ? 
                        localResumeData.certifications[0] : 
                        localResumeData.certifications[0].title) && (
                        <section className="mb-6">
                            <h2 className="text-xl font-bold mb-3 border-b pb-1">Certifications</h2>
                            <ul className="list-disc pl-5">
                                {localResumeData.certifications.map((cert, index) => (
                                    <li key={index} className="mb-1">
                                        {typeof cert === 'string' ? 
                                            cert : 
                                            <>
                                                <strong>{cert.title}</strong>
                                                {cert.organization && <> - {cert.organization}</>}
                                                {cert.period && <> ({cert.period})</>}
                                            </>
                                        }
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
        </div>
    </div>
        </>
  )
}

export default Artboard