"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import resumeStore from "@/store/resume_store"
import Image from "next/image"

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
        console.log("localResumeData", localResumeData);
    }, [localResumeData]);
    

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
                ref={resumeRef}
            >
                <div 
                    ref={resumeRef}
                    className={`resume-container bg-white ${isPrinting ? 'max-w-none shadow-none' : 'w-[210mm] shadow-lg mx-auto my-auto z-[0]'}`}
                    style={{
                        transform: isPrinting ? 'none' : `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                        transformOrigin: 'center top',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                >
                    {/* Header Section with photo and logo */}
                    <div className="flex items-center p-4 border-b border-gray-200">
                        {/* Left - Profile Photo */}
                        <div className="h-fit overflow-hidden">
                            <Image 
                                src="/placeholder_pfp.png"
                                alt={localResumeData.personalInfo.name} 
                                width={180} 
                                height={180} 
                                className="object-cover"
                            />
                        </div>
                        
                        {/* Middle - Name and Professional Summary */}
                        <div className="mx-6 flex-grow">
                            <h1 className="text-3xl font-bold text-gray-800">{localResumeData.personalInfo.name}</h1>
                            <p className="text-lg font-medium text-gray-700 mb-1">{localResumeData.personalInfo.course}</p>
                            <p className="text-sm text-gray-600">{localResumeData.personalInfo.summary}</p>
                        </div>
                        
                        {/* Right - Institute Logo */}
                        <div className="w-[350px] flex justify-end">
                            <Image 
                                src='/jim_logo.png'
                                alt="Institute Logo" 
                                width={350} 
                                height={100} 
                                className="object-contain w-[350px]"
                            />
                        </div>
                    </div>
                    
                    {/* Contact Information Bar */}
                    <div className="bg-gray-100 px-4 py-2 flex justify-between text-sm">
                        <div className="flex items-center space-x-1">
                            <span className="material-icons text-purple-700 text-sm">✉️</span>
                            <a href={`mailto:${localResumeData.personalInfo.email}`} className="text-blue-800">{localResumeData.personalInfo.email}</a>
                        </div>
                        <div className="flex items-center space-x-1">
                            <span className="material-icons text-purple-700 text-sm">📞</span>
                            <span>{localResumeData.personalInfo.contactNo}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <span className="material-icons text-purple-700 text-sm">🖇️</span>
                            {localResumeData.personalInfo.linkedinId && (
                                <a 
                                    href={localResumeData.personalInfo.linkedinId.startsWith('http') ? localResumeData.personalInfo.linkedinId : `https://${localResumeData.personalInfo.linkedinId}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-800"
                                >
                                    {localResumeData.personalInfo.linkedinId}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Main Content - Two Column Layout */}
                    <div className="flex">
                        {/* Left Column */}
                        <div className="w-1/2 p-4 border-gray-200">
                            {/* INTERNSHIPS */}
                            <div className="mb-6">
                                <h2 className="font-bold text-lg text-purple-900 mb-3 uppercase border-b border-gray-300 pb-1">INTERNSHIPS</h2>
                                {localResumeData.internships && localResumeData.internships.map((intern, idx) => (
                                    <div key={idx} className="mb-4">
                                        <h3 className="font-semibold">{intern.organization}</h3>
                                        <p className="text-xs text-gray-600 italic">({intern.duration}) {intern.location}</p>
                                        <p className="text-xs font-medium mb-1">Learning</p>
                                        <p className="text-xs text-gray-600 mb-1">{intern.summary}</p>
                                        <ul className="list-none ml-1 text-sm">
                                            {intern.keypoints && intern.keypoints.map((point, i) => (
                                                <li key={i} className="mb-1 flex items-start">
                                                    <span className="text-xs mr-1 mt-1">○</span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* ACADEMIC PROJECTS */}
                            <div className="mb-6">
                                {localResumeData.projects && localResumeData.projects.map((project, idx) => (
                                    <div key={idx} className="mb-4">
                                        <h2 className="font-bold text-lg text-purple-900 mb-3 uppercase border-b border-gray-300 pb-1">ACADEMIC PROJECT {idx + 1}</h2>
                                        <h3 className="font-semibold">{project.title}</h3>
                                        <p className="text-xs mb-1">{project.summary}</p>
                                        <p className="text-xs mb-1">Learning</p>
                                        <ul className="list-none ml-1 text-sm">
                                            {project.learning && project.learning.map((learning, i) => (
                                                <li key={i} className="mb-1 flex items-start">
                                                    <span className="text-xs mr-1 mt-1">○</span>
                                                    <span>{learning}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* SKILLS */}
                            <div className="mb-6">
                                <h2 className="font-bold text-lg text-purple-900 mb-3 uppercase border-b border-gray-300 pb-1">SKILLS:</h2>
                                <div className="flex flex-wrap gap-2">
                                    {localResumeData.skills && localResumeData.skills.map((skill, idx) => (
                                        <div key={idx} className="bg-gray-200 px-3 py-1 rounded text-sm">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* CERTIFICATES */}
                            <div className="mb-6">
                                <h2 className="font-bold text-lg text-purple-900 mb-3 uppercase border-b border-gray-300 pb-1">CERTIFICATES:</h2>
                                <ul className="list-none ml-1 text-sm">
                                    {localResumeData.certifications && localResumeData.certifications.map((cert, idx) => (
                                        <li key={idx} className="mb-1 flex items-start">
                                            <span className="text-xs mr-1 mt-1">○</span>
                                            <span>{typeof cert === 'string' ? cert : `${cert.title} (${cert.period})`}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        {/* Right Column */}
                        <div className="w-1/2 p-4">
                            {/* EDUCATION */}
                            <div className="mb-6">
                                <h2 className="font-bold text-lg text-purple-900 mb-3 uppercase border-b border-gray-300 pb-1">EDUCATION:</h2>
                                {localResumeData.education && localResumeData.education.map((edu, idx) => (
                                    <div key={idx} className="mb-4">
                                        <h3 className="font-semibold">{edu.title}</h3>
                                        <p className="text-sm">{edu.institution}</p>
                                        <div className="flex justify-between text-sm">
                                            <p className="text-gray-600">({edu.period})</p>
                                            {edu.percentage && <p className="text-right">{edu.percentage}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ACHIEVEMENTS */}
                            <div className="mb-6">
                                <h2 className="font-bold text-lg text-purple-900 mb-3 uppercase border-b border-gray-300 pb-1">ACHIEVEMENTS/ EXTRA-CURRICULAR ACTIVITIES:</h2>
                                <ul className="list-none ml-1 text-sm">
                                    {localResumeData.achievements && localResumeData.achievements.map((achieve, idx) => (
                                        <li key={idx} className="mb-2 flex items-start">
                                            <span className="text-xs mr-1 mt-1">○</span>
                                            <div>
                                                <p className="font-medium">{achieve.title}</p>
                                                {achieve.organization && <p className="text-xs">{achieve.organization}</p>}
                                                {achieve.summary && <p className="text-xs text-gray-600">{achieve.summary}</p>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* LANGUAGES */}
                            <div className="mb-6">
                                <h2 className="font-bold text-lg text-purple-900 mb-3 uppercase border-b border-gray-300 pb-1">LANGUAGES:</h2>
                                <div className="flex flex-wrap gap-4">
                                    {localResumeData.languages && localResumeData.languages.map((lang, idx) => (
                                        <p key={idx} className="text-sm">
                                            {lang} {idx < localResumeData.languages.length - 1 && <span className="inline-block w-2"></span>}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            
                            {/* INTERESTS */}
                            <div className="mb-6">
                                <h2 className="font-bold text-lg text-purple-900 mb-3 uppercase border-b border-gray-300 pb-1">INTERESTS</h2>
                                <div className="flex flex-wrap gap-2">
                                    {localResumeData.interests && localResumeData.interests.map((interest, idx) => (
                                        <div key={idx} className="border border-blue-300 px-4 py-1 rounded text-sm">
                                            {interest}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}

export default Artboard