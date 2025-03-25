'use client'

import React, { useEffect, useState } from 'react'
import QnaSnipEvalStore from '@/store/qna_snip_eval_store'
import resumeStore from '@/store/resume_store'
import ResumeRenderer from '@/components/ResumeRenderer'
import QuestionsArea from '@/components/QuestionsArea'
import GeometricBackground from '@/components/GeometricBackground'
import Link from 'next/link'




const Controls = ({ zoomIn, zoomOut, resetTransform }) => {
    return (
        <div className="absolute bottom-4 right-1/2 translate-x-1/2 bg-gray-100 rounded-lg shadow-lg p-2 flex space-x-2 z-10">

            <button
                onClick={zoomIn}
                className="w-8 h-8 bg-gray-00 hover:bg-gray-200 rounded-md flex items-center justify-center"
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




const EnhancePage = () => {
    const { setEvaluation, setQuestions, setSnippets } = QnaSnipEvalStore();
    const { setResumeData } = resumeStore();

    const questions = QnaSnipEvalStore(state => state.questions);
    const snippets = QnaSnipEvalStore(state => state.snippets);
    const loading = QnaSnipEvalStore(state => state.loading);
    const evaluation = QnaSnipEvalStore(state => state.evaluation);
    const resumeData = resumeStore(state => state.resumeData);

    const [zoom, setZoom] = useState(1);
    const [scale, setScale] = useState(0.6);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });



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




    useEffect(() => {
        console.log(questions)
        console.log(snippets)
        console.log(evaluation)
        console.log(resumeData)
        console.log(123)
    }, [])

    return (
        <div className='w-full '>
            <GeometricBackground />


            <div className='relative max-w-[1440px] mx-auto justify-center'>
                <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10  mx-auto">
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <img src="/jim_logo.png" alt="Jaipuria" className="text-black font-semibold w-32 px-2" />
                        </Link>
                        <span className="bg-jaipuria-orange  w-0.5 mx-1 text-orange-500 text-3xl">/</span>
                        <span className="text-jaipuria-orange  text-lg text-gray-500 px-2 font-bold">OneCV</span>
                        <span className="bg-jaipuria-orange  w-0.5 mx-1 text-orange-500 text-3xl">/</span>
                        <span className="text-jaipuria-orange  text-lg text-gray-500 px-2 font-bold">Enhance</span>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-2 items-center justify-center h-screen  mx-auto'>


                <div

                    className="relative h-full w-[50vw] flex flex-col items-center justify-center overflow-hidden"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >

                    <div className="flex flex-col items-center justify-center">
                        <p className="text-2xl font-bold">{resumeData.name}'s Resume</p>
                        <p className="text-sm text-gray-500">{resumeData.email}</p>
                        <div
                            style={{
                                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                                transformOrigin: 'center center',
                                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                            }}
                            className="border border-black/50 p-2 rounded"
                        >
                            <ResumeRenderer resume_json={resumeData} loading={loading} />
                        </div>

                        <Controls
                            zoomIn={handleZoomIn}
                            zoomOut={handleZoomOut}
                            resetTransform={handleResetTransform}
                        />


                    </div>
                </div>
                <div className='flex flex-col items-center justify-center'>

                    <QuestionsArea questions={questions} snippets={snippets} resume={resumeData} setResume={setResumeData} setQuestions={setQuestions} setSnippets={setSnippets} evaluation={evaluation} setEvaluation={setEvaluation} loading={loading} />

                </div>
            </div>
        </div>
    )
}

export default EnhancePage