import React, { useState, useEffect } from 'react'

const Questions = ({questions, snippets, resume, setResume, setQuestions, setSnippets, evaluation, setEvaluation}) => {

  const [formData, setFormData] = useState(questions.map(question => ({ question, answer: '' })));
  const [loading, setLoading] = useState(false);
  const [nextIteration, setNextIteration] = useState("null");
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setFormData(questions.map(question => ({ question, answer: '' })));
  }, [questions]);

  const handleInputChange = (index, value) => {
    const newFormData = [...formData];
    newFormData[index].answer = value;
    setFormData(newFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
   
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/improve_resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          QuestionsAndAnswers: formData,
          Snippets: snippets,
          Resume: resume
        })
      });
      setCounter(counter + 1);
      const data = await response.json();
      setResume(data.tasks_output[0].raw);
      setEvaluation(data.tasks_output[1].raw);
      console.log(data, counter)

      if (data.tasks_output[1].raw[0] === "T") {
        setNextIteration("false");
      } else if (data.tasks_output[1].raw[0] === "F") {
        setNextIteration("true");
      }
      else if(data.tasks_output[1].raw[0] === "Exit"){
        setNextIteration("exit");
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceMore = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/enhance_more', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Resume: resume,
          Evaluation: evaluation  
        })
      });
      const data = await response.json();
      setQuestions(JSON.parse(data.tasks_output[1].raw));
      setSnippets(data.tasks_output[0].raw);
      setNextIteration("false");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadEnhancedResume = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/download_enhanced_resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Resume: resume
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to download resume');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Enhanced_Resume.docx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading resume:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={counter >0 ? handleDownloadEnhancedResume : nextIteration === "true"? handleEnhanceMore : handleSubmit} className='flex flex-col max-w-[50vw] mx-auto justify-center p-4 text-blue-600 h-screen '>
      {loading ? (
        <div className="flex justify-center items-center w-[50vw] h-screen">
          <div className="spinner-border animate-spin inline-block text-9xl" role="status">
            ⏳
          </div>
        </div>
      ) : (
        formData.map((item, index) => (
          <div key={index} className="p-2 my-4">
            <div className='flex items-center gap-2'>
              <p className='text-black text-2xl w-fit italic font-bold'>{index + 1})</p>
              <p className='text-black text-lg w-fit'>{item.question}</p>
            </div>
            <input
              value={item.answer}
              placeholder='answer'
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="py-2 w-full text-black bg-transparent border-b border-black mt-2 focus:outline-none"
            />
          </div>
        ))
      )}
      <button type="submit" className={`mt-4 text-white font-bold py-2 px-4 rounded ${loading ? "hidden" : ""}`}>
        {counter > 0 ? "Exit" : nextIteration === "true" ? "Enhance More" : "Submit Answers"}
      </button>
    </form>
  )
}

export default Questions
