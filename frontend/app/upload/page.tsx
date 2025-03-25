"use client"

import React, { useState } from 'react'
import QnaSnipEvalStore from '@/store/qna_snip_eval_store'
import resumeStore from '@/store/resume_store'
import { useRouter } from 'next/navigation';
import GeometricBackground from '@/components/GeometricBackground';
import Link from 'next/link';
import { ArrowRight } from "lucide-react";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setQuestions, setSnippets } = QnaSnipEvalStore();
  const { setResumeData } = resumeStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000", {
        method: "POST",
        body: formData,
      });

      if (!response.ok){
        throw new Error("Failed to upload file, check your internet connection.");
        return;
      } 

      const data = await response.json();
      console.log("data📈", data);
      
      setQuestions(data.questions.questions);
      setResumeData(data.resume);
      setSnippets(data.snippets);

      console.log("questions 👍🏻", QnaSnipEvalStore.getState().questions);
      console.log("snippets 👍🏻", QnaSnipEvalStore.getState().snippets);  
      console.log("resume 👍🏻", resumeStore.getState().resumeData);

      router.push("/enhance");
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>  
      <GeometricBackground/>
      <div className="flex flex-col min-h-screen max-w-[1440px] mx-auto relative">
        {/* Header with logo */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
        <div className="flex items-center gap-2">
          <Link href="/">
            <img src="/jim_logo.png" alt="Jaipuria" className="text-black font-semibold w-32 px-2"/>
          </Link>
          <span className="bg-jaipuria-orange  w-0.5 mx-1 text-orange-500 text-3xl">/</span>
          <span className="text-jaipuria-orange  text-lg text-gray-500 px-2 font-bold">OneCV</span>
          <span className="bg-jaipuria-orange  w-0.5 mx-1 text-orange-500 text-3xl">/</span>
          <span className="text-jaipuria-orange  text-lg text-gray-500 px-2 font-bold">Upload</span>
        </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row items-center justify-center h-screen w-full px-4 md:px-8 lg:px-12">
          {/* Left side - Resume Upload */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8">
            <label htmlFor="file-upload" className={`items-center justify-center mb-6 w-full max-w-[360px] h-[420px] cursor-pointer rounded-xl duration-200 text-white font-bold py-2 px-4 flex-col flex gap-4 group border border-black/10 ${file==null ? "bg-black/50 hover:bg-black/60" : "bg-black/70"} transition-all hover:-translate-y-1 hover:shadow-lg`}>
              {
                !file ? (
                  <div className='items-center flex flex-col'>
                    <svg className="group-hover:-translate-y-4 duration-200" width="80" height="80" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    <p className="text-lg mt-4">Click to upload your resume</p>
                    <p className="text-sm text-gray-300 mt-2">(PDF format only)</p>
                  </div>
                ):
                (
                  <div className='items-center flex flex-col'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium mb-2">File selected:</p>
                    <p className="text-sm text-center max-w-xs overflow-hidden text-ellipsis">{file.name}</p>
                  </div>
                )
              }
            </label>
            <input id="file-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
            <button 
              onClick={handleUpload} 
              disabled={loading || !file} 
              className={`rounded-xl w-full max-w-[360px] py-4 duration-300 text-white font-bold px-6 disabled:opacity-50 flex items-center justify-center gap-2 group ${loading ? "bg-gray-500" : "bg-[#ef7f1a]/70 hover:bg-[#ef7f1a] hover:-translate-y-1 hover:shadow-md"}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Resume...
                </>
              ) : (
                <>
                  Generate Questions
                  <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
          
          {/* Right side - Instructions */}
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center p-4 md:p-8 lg:p-12">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-black/5 backdrop-blur-sm border border-black/10">
              <p className="text-sm font-medium text-black">
                Exclusively for Jaipuria Students
              </p>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight mb-6">
              Upload your resume to get started!
            </h1>
            
            <p className="text-lg mb-4">
              Our AI will analyze your resume and generate tailored interview questions based on your experience.
            </p>
            
            <p className="text-md  mb-8">
              We'll help you prepare for interviews by identifying key strengths and areas for improvement in your resume.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="flex flex-col items-center p-4 rounded-lg backdrop-blur-sm bg-[#ef7f1a] border border-black/10 hover:-translate-y-1 transition-all duration-300 text-white">
                <span className="text-2xl font-bold ">Step 1</span>
                <span className="text-sm text-center  mt-2">Upload your resume in PDF format</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg backdrop-blur-sm bg-[#ef7f1a] border border-black/10 hover:-translate-y-1 transition-all duration-300 text-white">
                <span className="text-2xl font-bold ">Step 2</span>
                <span className="text-sm text-center  mt-2">Answer AI Powered questions</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg backdrop-blur-sm bg-[#ef7f1a] border border-black/10 hover:-translate-y-1 transition-all duration-300 text-white">
                <span className="text-2xl font-bold ">Step 3</span>
                <span className="text-sm text-center  mt-2">Edit & Download your enhanced resume</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UploadPage