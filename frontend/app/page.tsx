  "use client"

import { useEffect, useState } from "react";
import Home from "./components/Home";
import Questions from "./components/Questions";
import MarkdownRenderer from "./components/MarkdownRederer";

export default function PDFUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Array<{ question: string }>>([]);  
  const [snippets, setSnippets] = useState<Array<{ snippet: string, issue: string }>>([]);
  const [loading, setLoading] = useState(false);  
  const [resume, setResume] = useState<string>("");
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
      console.log(data);
     
      setQuestions(JSON.parse(data.questions.tasks_output[1].raw.replace(/^```json\s*|\s*```$/g, ''))); // Corrected to directly access 'questions' from parsedData
      setResume(data.resume);
      setSnippets(data.questions.tasks_output[0].raw); // Corrected to directly access 'questions' from parsedData
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
  }, [questions, snippets]);

  return (
    <div className="flex h-[100vh] overflow">
  
      
          {resume.length < 1 ? (
      <Home handleFileChange={handleFileChange} handleUpload={handleUpload} loading={loading} file={file}/>
    ):
    (
      <MarkdownRenderer markdown={resume.replace(/^```markdown\s*|\s*```$/g, '')} snippets={snippets} />
    )}
      {
        questions.length > 0 &&(
          <Questions questions={questions} snippets={snippets} resume={resume} setResume={setResume} setQuestions={setQuestions} setSnippets={setSnippets} evaluation={evaluation} setEvaluation={setEvaluation}/>
        )
      }
    </div>
  );
  
}
