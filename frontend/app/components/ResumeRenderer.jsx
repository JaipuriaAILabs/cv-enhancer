import React from "react";

const ResumeRenderer = ({ resume_json }) => {

 
  
  

  return (
    <div className="m-4 p-4 border  font-sans bg-white max-h-screen overflow-y-scroll">
      <div className="mb-8">
        <h2 className="text-4xl font-bold">{resume_json.personalInfo.name}</h2>
        <p className="text-lg">{resume_json.personalInfo.email}</p>
        <p className="text-lg">{resume_json.personalInfo.contactNo}</p>
        <p className="text-lg">{resume_json.personalInfo.linkedinId}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold bg-gray-100 p-2 rounded-md mb-4">Education</h2>
        <table className="w-full border-collapse">
          <tbody>
            {resume_json.education.map((edu, index) => (
              <tr key={index}>
                <td className="border px-4 py-2 font-medium">{edu.title}</td>
                <td className="border px-4 py-2">{edu.period}</td>
                <td className="border px-4 py-2">{edu.institution}</td>
                <td className="border px-4 py-2">{edu.percentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold bg-gray-100 p-2 rounded-md mb-4">Projects</h2>
        {resume_json.projects.map((project, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-md font-semibold">{project.title}</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-medium">Description:</td>
                  <td className="border px-4 py-2">{project.description}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold bg-gray-100 p-2 rounded-md mb-4">Achievements</h2>
        <ul className="list-disc pl-5">
          {resume_json.achievements.map((achievement, index) => (
            <li key={index} className="mb-2">{achievement}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold bg-gray-100 p-2 rounded-md mb-4">Skills</h2>
        <ul className="list-disc pl-5">
          {resume_json.skills.map((skill, index) => (
            <li key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2 mb-2">{skill}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold bg-gray-100 p-2 rounded-md mb-4">Experience</h2>
        {resume_json.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-md font-semibold">{exp.title}</h3>
            <h4 className="font-medium">{exp.organization}</h4>
            <h5 className="italic">{exp.duration}</h5>
            <ul className="list-disc pl-5">
              {exp.description.map((desc, descIndex) => (
                <li key={descIndex} className="mb-2">{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeRenderer;
