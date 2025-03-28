import nextConfig from '@/next.config';
import { AnimatePresence, motion } from 'motion/react';
import { div } from 'motion/react-client';
import React, { useState, useEffect } from 'react'

const Questions = ({ questions, snippets, resume, setResume, setQuestions, setSnippets, evaluation, setEvaluation }) => {

  const [formData, setFormData] = useState(questions.map(question => ({ question, answer: '' })));
  const [loading, setLoading] = useState(false);
  const [nextIteration, setNextIteration] = useState("null");
  const [counter, setCounter] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);

  const loadingArray = [
    "Analyzing your resume",
    "Evaluating your answers",
    "Recycling your resume",
    "Generating questions",
    "ATS Check in Progress",
  ]

  useEffect(() => {
    setFormData(questions.map(question => ({ question, answer: '' })));
  }, [questions]);


  const handleInputChange = (index, value) => {
    const newFormData = [...formData];
    newFormData[index].answer = value;
    setFormData(newFormData);
  };

  const handleLoading = () => {
    const intervalId = setInterval(() => {
      setLoadingIndex(prevIndex => {
        if (prevIndex >= loadingArray.length - 1) {
          clearInterval(intervalId);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 3000);

    // Clean up interval if component unmounts
    return () => clearInterval(intervalId);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    handleLoading();
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
      setResume(data.improved_resume);
      setEvaluation(data.evaluation);
      console.log("💁🏼", data)

      if (data.evaluation[0] == "T") {
        console.log("Set evaluation to: false")
        setNextIteration("false");
      } else if (data.evaluation[0] == "F") {
        console.log("Set evaluation to: true")
        setNextIteration("true");
      }
      else {
        console.log("Set evaluation to: exit")
        setNextIteration("exit");
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setLoadingIndex(0);
      setCurrentQuestionIndex(0);
    }
  };

  const handleGenerateMoreQuestions = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/generate_more_questions', {
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
      setQuestions(data.questions.questions);
      setSnippets(data.snippets);
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

  console.log(nextIteration)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < formData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const confirmSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    if (counter > 1) {
      alert("edit")
    } else if (nextIteration === "true") {
      handleGenerateMoreQuestions(new Event('submit'));
    } else {
      handleSubmit(new Event('submit'));
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); confirmSubmit(); }} className='flex flex-col max-w-[50vw] overflow-y-scroll mx-auto justify-center p-4 h-screen'>
      {loading && (
        <div className="flex justify-center items-center w-[50vw] h-screen">
          <div className="spinner-border inline-block text-3xl" role="status">
            <motion.div
              key={counter % loadingArray.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-shimmer"
                style={{
                  backgroundSize: '200% 100%',
                  animation: '2s infinite linear'
                }}
              />
              {loadingArray[loadingIndex]}
            </motion.div>
          </div>
        </div>
      )}

      {!loading && nextIteration !== "true" && formData.length > 0 && (
        <div className="p-2 my-4">
          <div className="text-center mb-4">

          </div>
          <AnimatePresence mode="wait">
            {formData.length > 0 && (
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className='flex items-center gap-2'
              >
                <p className='text-black text-2xl w-fit italic font-bold'>{currentQuestionIndex + 1})</p>
                <p className='text-black text-lg w-fit'>{formData[currentQuestionIndex].question}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.textarea
              key={`input-${currentQuestionIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              value={formData[currentQuestionIndex].answer}
              placeholder='answer'
              onChange={(e) => handleInputChange(currentQuestionIndex, e.target.value)}
              className="p-2 rounded-md h-[256px] bg-white/50 w-full text-black  border border-black mt-2 focus:outline-none"
            />
          </AnimatePresence>

          <div className="flex justify-center gap-12 mt-6 items-center">
            <button
              type="button"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-1 py-1  rounded-full text-white font-bold ${currentQuestionIndex === 0 ? 'bg-gray-400' : 'bg-black'}`}
            >
              <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </button>

            <div className="flex items-center justify-center space-x-2">
              {formData.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: index === currentQuestionIndex ? 1.5 : 1 }}
                  animate={{ scale: index === currentQuestionIndex ? 1.5 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-full bg-black"
                  style={{
                    width: index === currentQuestionIndex ? '6px' : '4px',
                    height: index === currentQuestionIndex ? '6px' : '4px',
                    backgroundColor: index === currentQuestionIndex ? 'black' : 'gray'
                  }}
                  onClick={() => setCurrentQuestionIndex(index)}
                />
              ))}
            </div>

            {currentQuestionIndex === formData.length - 1 ? (
              <button
                type="submit"

                className="px-4 py-2 rounded-full text-white font-bold bg-black"
              >
                {counter > 1 ? "Exit" : nextIteration === "true" ? "Generate More Questions" : "Submit"}
              </button>
            ) : (
              <button
                type="button"
                onClick={goToNextQuestion}
                className="px-1 py-1 rounded-full text-white font-bold bg-black z-10"
              >
                <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </button>
            )}
          </div>
        </div>
      )}

      {!loading && nextIteration === "true" && counter <= 1 && (
        <div className="mx-auto flex flex-col items-center justify-center text-balance text-center">
          <p className='text-3xl font-bold'>⚠️ Your Resume has room for improvement</p>
          <p className='text-xl'>You can either answer more questions, edit the resume, or download it.</p>


          <div className='flex  gap-2'>


            <button type="submit" className="mt-4 text-white font-bold py-2 px-4 rounded-full bg-black/50 w-fit mx-auto hover:bg-orange-500 duration-100 ">
              Generate More Questions
            </button>
            <button type="submit" className="mt-4 text-white font-bold py-2 px-4 rounded-full bg-black/50 w-fit mx-auto hover:bg-orange-500 duration-100 ">
              Edit Resume
            </button>
            <button type="submit" className="mt-4 text-white font-bold py-2 px-4 rounded-full bg-black/50 w-fit mx-auto hover:bg-orange-500 duration-100 ">
              Download Resume
            </button>
          </div>
        </div>
      )}

      {!loading && nextIteration === "true" && counter > 1 && (
        <div className="mx-auto flex flex-col items-center justify-center text-balance text-center">
          <p className='text-3xl font-bold'>✅ Your Resume is good to go!</p>
          <p className='text-xl'>You can either download it or edit it first</p>
          <div className='flex  gap-2'>
            <button type="submit" className="mt-4 text-white font-bold py-2 px-4 rounded-full bg-black/50 w-fit mx-auto hover:bg-orange-500 duration-100 ">
              Download Resume
            </button>
            <button type="submit" className="mt-4 text-white font-bold py-2 px-4 rounded-full bg-black/50 w-fit mx-auto hover:bg-orange-500 duration-100 ">
              Edit Resume
            </button>
          </div>
        </div>
      )}







      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-black mb-4">Confirm Submission</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to submit your answers?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelSubmit}
                className="px-4 py-2 border  border-gray-300 rounded-full text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default Questions