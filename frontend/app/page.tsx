  "use client"

import { useEffect, useState } from "react";
import Home from "./components/Home";
import Questions from "./components/Questions";
import ResumeRenderer from "./components/ResumeRenderer";

export default function PDFUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Array<{ question: string }>>([]);  
  const [snippets, setSnippets] = useState<Array<{ snippet: string, issue: string }>>([]);
  const [loading, setLoading] = useState(false);  
  const [resume, setResume] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<string>("");
  // const [userJourney, setUserJourney] = useState('home'); 💡 

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

    if (!response.ok) throw new Error("Failed to upload");

      const data = await response.json();
      console.log("data📈", data);
      
      setQuestions(data.questions.questions); // Corrected to directly access 'questions' from parsedData
      setResume(data.resume);
      setSnippets(data.snippets); // Corrected to directly access 'questions' from parsedData

      console.log("questions 👍🏻", questions);
      console.log("snippets 👍🏻", snippets);  
      console.log("resume 👍🏻", resume);
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing PDF");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    console.log("questions", questions);
    console.log("snippets", snippets);
    console.log("resume", resume);
  }, [questions, snippets, resume]);

  return (
    <div className="grid grid-cols-2 gap-4 max-h-screen">      
          {!!resume ? (
            <ResumeRenderer resume_json={resume} />
          ):
          (
      <Home handleFileChange={handleFileChange} handleUpload={handleUpload} loading={loading} file={file}/>
    )}

    {
      questions.length > 0 && (
        <div className="">
          <Questions questions={questions} snippets={snippets} resume={resume} setResume={setResume} setQuestions={setQuestions} setSnippets={setSnippets} evaluation={evaluation} setEvaluation={setEvaluation} />
        </div>    
      )
    }
      
    
    </div>
  );
  
}
