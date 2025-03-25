"use client"


import React from 'react';
import { ArrowRight, FileEdit } from "lucide-react";
import Link from 'next/link';
import GeometricBackground from '@/components/GeometricBackground';
import resumeStore from '@/store/resume_store';

import { useRouter } from 'next/navigation';
const App = () => {

  const router = useRouter();

  const {resetResumeData} = resumeStore();

  //CLEWAR STORAGE BEFORE NAVOIGATING

//   <Link
//   href="/edit"
//   className="hero-button-primary group text-base sm:text-lg h-12 sm:h-14 flex items-center justify-center border px-4 rounded-xl z-[11] bg-[#ef7f1a]/70 hover:bg-[#ef7f1a] transition-all duration-300 hover:-translate-y-1  shadow text-white"
// >
//   Create From Scratch
//   <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
// </Link>
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen px-4 md:px-6 lg:px-8 relative max-w-[1440px] mx-auto z-10">
    <GeometricBackground/>
      <div className="absolute top-0 left-0 max-w-[1440px] mx-auto py-6 px-4">
        <div className="flex items-center gap-2">
          <Link href="/">
          <img src="/jim_logo.png" alt="Jaipuria" className="text-black font-semibold w-32 px-2"/>
          </Link>
          <span className="bg-jaipuria-orange  w-0.5 mx-1 text-orange-500 text-3xl">/</span>
          <span className="text-jaipuria-orange  text-lg text-gray-500 px-2 font-bold">OneCV</span>
        </div>
      </div>
      
      <div className="w-full max-w-5xl mx-auto text-center">
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-black/5 backdrop-blur-sm border border-black/10  ">
          <p className="text-sm font-medium text-black">
            Exclusively for Jaipuria Students
          </p>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter-plus text-black leading-[1.1] mb-6">
  One Jaipuria  ---  One CV  <br className="hidden md:block" />
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ef7f1a] from-30%  via-black via-70% to-[#ef7f1a] animate-gradient-x">
    Powered by AI
  </span>
</h1>

        
        <p className="text-lg md:text-xl text-black/80 mb-10 max-w-3xl mx-auto text-balance ">
          Build a professional resume that stands out with our intelligent AI assistant. 
          Tailored for Jaipuria students to showcase their skills and achievements.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center ">
          <button
            onClick={() => {
              resetResumeData();
              router.push('/edit')

            }}
            className="hero-button-primary group text-base sm:text-lg h-12 sm:h-14 flex items-center justify-center border px-4 rounded-xl z-[11] bg-[#ef7f1a]/70 hover:bg-[#ef7f1a] transition-all duration-300 hover:-translate-y-1  shadow text-white"
          >
            Create From Scratch
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <Link 
            href="/upload"
            className="hero-button-primary group text-base sm:text-lg h-12 sm:h-14 flex items-center justify-center border px-4 rounded-xl z-[11] bg-black/70 hover:bg-black transition-all duration-300 hover:-translate-y-1  shadow text-white"
          >
            <FileEdit className="mr-2 h-5 w-5" />
            Refine Existing Resume
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center  animate-fade-in-delayed-2">
        <div className="flex gap-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-black">500+</span>
            <span className="text-sm text-black/70">Resumes Created</span>
          </div>
          <div className="w-px h-14 bg-jaipuria-black/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-black">98%</span>
            <span className="text-sm text-black/70">Success Rate</span>
          </div>
          <div className="w-px h-14 bg-jaipuria-black/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-black">24/7</span>
            <span className="text-sm text-black/70">AI Support</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default App;