import React, { useEffect, useState } from "react";
import Image from "next/image";
import { div } from "motion/react-client";
import QnaSnipEvalStore from "@/store/qna_snip_eval_store";
import { usePathname } from 'next/navigation'

const ResumeRenderer = ({ resume_json, loading }) => {
  const { 
    personalInfo, 
    education, 
    achievements, 
    skills, 
    internships,
    projects,
    certifications,
    languages,
    interests
  } = resume_json;

  // const { loading } = QnaSnipEvalStore();
  const pathname = usePathname()
 

  const [profileImage, setProfileImage] = useState('/placeholder_pfp.png');

  useEffect(() => {
    // Load image from IndexedDB when component mounts
    const loadImageFromIndexedDB = () => {
      const dbRequest = indexedDB.open("ImageDB", 1);
      
      dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("images", "readonly");
        const store = transaction.objectStore("images");
        const getRequest = store.get("image");

        getRequest.onsuccess = () => {
          if (getRequest.result) {
            setProfileImage(getRequest.result.data);
          }
        };
      };
    };

    loadImageFromIndexedDB();

    // Listen for image changes
    const handleImageChange = (event) => {
      setProfileImage(event.detail);
    };

    window.addEventListener('profileImageChanged', handleImageChange);

    return () => {
      window.removeEventListener('profileImageChanged', handleImageChange);
    };
  }, []);

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

  // Add this function to check content overflow
  const checkContentOverflow = () => {
    const content = document.getElementById('resume-renderer');
    if (!content) return false;
    
    // Convert mm to px (1mm = 3.779527559px)
    const maxHeight = 297 * 3.779527559 + 1;
    return content.offsetHeight > maxHeight;
  };

  // Add this to your component
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      setIsOverflowing(checkContentOverflow());
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    // Check again after images load
    window.addEventListener('load', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
      window.removeEventListener('load', checkOverflow);
    };
  }, [resume_json]); // Recheck when resume content changes

  return (
    <div className="relative">
      {/* Page size indicator wrapper */}
      <div className="relative w-[210mm] min-h-[297mm] bg-white font-sans shadow-lg mx-auto my-auto z-[0]">
        {/* Content */}
        <div id="resume-renderer">
          {loading ? (
            <div id="resume-renderer" className="w-[210mm] min-h-[297mm]  bg-white font-sans shadow-lg mx-auto my-auto z-[0]">
              {/* Header Section with shimmer effect */}
              <div className="flex items-center p-4 border-b border-gray-200">
                {/* Left - Profile Photo Shimmer */}
                <div className="h-[180px] w-[180px] overflow-hidden bg-gray-200 animate-pulse rounded-md"></div>
                
                {/* Middle - Name and Professional Summary Shimmer */}
                <div className="mx-6 flex-grow">
                  <div className="h-8 w-3/4 bg-gray-200 animate-pulse mb-2 rounded-md"></div>
                  <div className="h-6 w-1/2 bg-gray-200 animate-pulse mb-2 rounded-md"></div>
                  <div className="h-16 w-full bg-gray-200 animate-pulse rounded-md"></div>
                </div>
                
                {/* Right - Institute Logo Shimmer */}
                <div className="w-[350px] flex justify-end">
                  <div className="h-[100px] w-[350px] bg-gray-200 animate-pulse rounded-md"></div>
                </div>
              </div>
              
              {/* Contact Information Bar Shimmer */}
              <div className="bg-gray-100 px-4 py-2 flex justify-between text-sm">
                <div className="h-5 w-1/4 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-5 w-1/5 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-5 w-1/4 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
      
              {/* Main Content - Two Column Layout with Shimmer */}
              <div className="flex">
                {/* Left Column */}
                <div className="w-1/2 p-4 border-gray-200">
                  {/* INTERNSHIPS Shimmer */}
                  <div className="mb-6">
                    <div className="h-7 w-1/3 bg-gray-200 animate-pulse mb-3 rounded-md"></div>
                    {[1, 2].map((_, idx) => (
                      <div key={idx} className="mb-4">
                        <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-2 rounded-md"></div>
                        <div className="h-4 w-1/2 bg-gray-200 animate-pulse mb-2 rounded-md"></div>
                        <div className="h-4 w-1/4 bg-gray-200 animate-pulse mb-2 rounded-md"></div>
                        <div className="h-12 w-full bg-gray-200 animate-pulse mb-2 rounded-md"></div>
                        {[1, 2, 3].map((_, i) => (
                          <div key={i} className="h-4 w-11/12 bg-gray-200 animate-pulse mb-2 ml-2 rounded-md"></div>
                        ))}
                      </div>
                    ))}
                  </div>
      
                  {/* ACADEMIC PROJECTS Shimmer */}
                  <div className="mb-6">
                    {[1, 2].map((_, idx) => (
                      <div key={idx} className="mb-4">
                        <div className="h-7 w-2/3 bg-gray-200 animate-pulse mb-3 rounded-md"></div>
                        <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-2 rounded-md"></div>
                        <div className="h-4 w-1/4 bg-gray-200 animate-pulse mb-2 rounded-md"></div>
                        {[1, 2, 3].map((_, i) => (
                          <div key={i} className="h-4 w-11/12 bg-gray-200 animate-pulse mb-2 ml-2 rounded-md"></div>
                        ))}
                      </div>
                    ))}
                  </div>
      
                  {/* SKILLS Shimmer */}
                  <div className="mb-6">
                    <div className="h-7 w-1/4 bg-gray-200 animate-pulse mb-3 rounded-md"></div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6].map((_, idx) => (
                        <div key={idx} className="h-8 w-20 bg-gray-200 animate-pulse rounded-md"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* CERTIFICATES Shimmer */}
                  <div className="mb-6">
                    <div className="h-7 w-1/3 bg-gray-200 animate-pulse mb-3 rounded-md"></div>
                    {[1, 2, 3].map((_, idx) => (
                      <div key={idx} className="h-5 w-11/12 bg-gray-200 animate-pulse mb-2 ml-2 rounded-md"></div>
                    ))}
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="w-1/2 p-4">
                  {/* EDUCATION Shimmer */}
                  <div className="mb-6">
                    <div className="h-7 w-1/3 bg-gray-200 animate-pulse mb-3 rounded-md"></div>
                    {[1, 2].map((_, idx) => (
                      <div key={idx} className="mb-4">
                        <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-2 rounded-md"></div>
                        <div className="h-5 w-2/3 bg-gray-200 animate-pulse mb-2 rounded-md"></div>
                        <div className="flex justify-between">
                          <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded-md"></div>
                          <div className="h-4 w-1/6 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                      </div>
                    ))}
                  </div>
      
                  {/* ACHIEVEMENTS Shimmer */}
                  <div className="mb-6">
                    <div className="h-7 w-3/4 bg-gray-200 animate-pulse mb-3 rounded-md"></div>
                    {[1, 2, 3].map((_, idx) => (
                      <div key={idx} className="mb-3 ml-2">
                        <div className="h-5 w-2/3 bg-gray-200 animate-pulse mb-1 rounded-md"></div>
                        <div className="h-4 w-1/2 bg-gray-200 animate-pulse mb-1 rounded-md"></div>
                        <div className="h-4 w-11/12 bg-gray-200 animate-pulse rounded-md"></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* LANGUAGES Shimmer */}
                  <div className="mb-6">
                    <div className="h-7 w-1/3 bg-gray-200 animate-pulse mb-3 rounded-md"></div>
                    <div className="flex flex-wrap gap-4">
                      {[1, 2, 3].map((_, idx) => (
                        <div key={idx} className="h-5 w-16 bg-gray-200 animate-pulse rounded-md"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* INTERESTS Shimmer */}
                  <div className="mb-6">
                    <div className="h-7 w-1/3 bg-gray-200 animate-pulse mb-3 rounded-md"></div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4].map((_, idx) => (
                        <div key={idx} className="h-8 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div id="resume-renderer" className="w-[210mm] min-h-[297mm]  bg-white font-sans shadow-lg mx-auto my-auto z-[0]">
              {/* Header Section with photo and logo */}
              <div className="flex p-4 border-b border-gray-200 w-full">
                {/* Left - Profile Photo */}
                <div className="h-fit overflow-hidden w-[15vw]">
                  <Image 
                    src={profileImage}
                    alt={personalInfo.name} 
                    width={180} 
                    height={180} 
                    className="object-cover"
                  />
                </div>
                
                {/* Middle - Name and Professional Summary */}
                <div className="mx-6 flex-grow w-[50vw]">
                  <h1 className="text-3xl font-bold text-gray-800">{personalInfo.name}</h1>
                  <p className="text-lg font-medium text-gray-700 mb-1">{personalInfo.course}</p>
                  <p className="text-sm text-gray-600">{personalInfo.summary}</p>
                </div>
                
                {/* Right - Institute Logo */}
                <div className="w-[25vw] h-fit">
      
                  <Image 
                    src='/jim_logo.png'
                    alt="Institute Logo" 
                    width={350} 
                    height={100} 
                    className="object-contain w-[25vw]"
                  />
                </div>
              </div>
              
              {/* Contact Information Bar */}
              <div className="bg-gray-100 px-4 py-2 flex justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <span className="material-icons text-purple-700 text-sm">✉️</span>
                  <a href={`mailto:${personalInfo.email}`} className="text-blue-800">{personalInfo.email}</a>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="material-icons text-purple-700 text-sm">📞</span>
                  <span>{personalInfo.contactNo}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="material-icons text-purple-700 text-sm">🖇️</span>
                  {personalInfo.linkedinId && (
                    <a 
                      href={personalInfo.linkedinId.startsWith('http') ? personalInfo.linkedinId : `https://${personalInfo.linkedinId}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-800"
                    >
                      {personalInfo.linkedinId}
                    </a>
                  )}
                </div>
              </div>
      
              {/* Main Content - Two Column Layout */}
              <div className="flex">
                {/* Left Column */}
                <div className="w-1/2 p-4  border-gray-200">
                  {/* INTERNSHIPS */}
                  <div className="mb-6">
                    <h2 className="font-bold text-lg text-purple-900 mb-3 uppercase border-b border-gray-300 pb-1">{internships.length > 1 ? "INTERNSHIPS" : "INTERNSHIP"}</h2>
                    {internships.map((intern, idx) => (
                      <div key={idx} className="mb-4">
                        <h3 className="font-semibold">{intern.organization}</h3>
                        <p className="text-xs text-gray-600 italic">({intern.duration}) {intern.location}</p>
                        <p className="text-xs font-medium mb-1">Learning</p>
                        <p className="text-xs text-gray-600 mb-1">{intern.summary}</p>
                        <ul className="list-none ml-1 text-sm">
                          {intern.keypoints.map((point, i) => (
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
                    {projects && projects.map((project, idx) => (
                      <div key={idx} className="mb-4">
                        <h2 className="font-bold text-lg text-purple-900 mb-3 uppercase border-b border-gray-300 pb-1">ACADEMIC PROJECT {idx + 1}</h2>
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-xs mb-1">Learning</p>
                        <ul className="list-none ml-1 text-sm">
                          {project.keypoints.map((point, i) => (
                            <li key={i} className="mb-1 flex items-start">
                              <span className="text-xs mr-1 mt-1">○</span>
                              <span>{point}</span>
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
                      {skills.map((skill, idx) => (
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
                      {certifications && certifications.map((cert, idx) => (
                        <li key={idx} className="mb-1 flex items-start">
                          <span className="text-xs mr-1 mt-1">○</span>
                          <span>{cert.title} ({cert.period})</span>
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
                    {education.map((edu, idx) => (
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
                      {achievements.map((achieve, idx) => (
                        <li key={idx} className="mb-2 flex items-start">
                          <span className="text-xs mr-1 mt-1">○</span>
                          <div>
                            <p className="font-medium">{achieve.title}</p>
                            <p className="text-xs">{achieve.organization}</p>
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
                      {languages && languages.map((lang, idx) => (
                        <p key={idx} className="text-sm">
                          {lang} {idx < languages.length - 1 && <span className="inline-block w-2"></span>}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  {/* INTERESTS */}
                  <div className="mb-6">
                    <h2 className="font-bold text-lg text-purple-900 mb-3 uppercase border-b border-gray-300 pb-1">INTERESTS</h2>
                    <div className="flex flex-wrap gap-2">
                      {interests && interests.map((interest, idx) => (
                        <div key={idx} className="border border-blue-300 px-4 py-1 rounded text-sm">
                          {interest}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Page break indicator */}
        {pathname === '/edit' && (
        <div className="absolute top-[297mm] left-0 right-0 w-full">
          {/* Visual page break line */}
          <div className="relative h-4 -mt-2">
            <div className="absolute inset-x-0 border-t-2 border-dashed border-red-500"></div>
            
            {/* Page break label */}
            <div className="absolute -right-16 -top-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              Page Break
            </div>
         
          </div>
        </div>
        )}

       
      </div>

      {/* New warning message */}
      {isOverflowing && pathname === '/edit' && (
        <div className="fixed -bottom-12  bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
          <p className="font-medium">⚠️ Resume exceeds one page</p>
          <p className="text-sm">Please reduce content to fit within the page limits</p>
        </div>
      )}
    </div>
  );
};

export default ResumeRenderer;
