"use client"

import Artboard from "../../components/resume_editor/Artboard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";



  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
      <div className="tools">
        <button onClick={() => zoomIn()}>+</button>
        <button onClick={() => zoomOut()}>-</button>
        <button onClick={() => resetTransform()}>x</button>
      </div>
    );
  };

  


export default function ArtboardPage() {
  const resumeRef = useRef(null)

  const generatePDF = async () => {
    const resumeElement = resumeRef.current;

    if (resumeElement) {
        try {
            console.log("DOWNLOADING PDF")
            const canvas = await html2canvas(resumeElement, {
                scale: 1,
                useCORS: true,
            });

            const imgData = canvas.toDataURL('image/png');
            console.log("imgData", imgData)
            const pdf = new jsPDF('p', 'mm', 'a4');
            console.log("pdf", pdf)
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            console.log("imgHeight", imgHeight)
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('resume.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    }
};



  return (
    
    <>
    <button onClick={generatePDF}>Generate PDF</button>
    <div ref={resumeRef}>
      <Artboard />
    </div>
    </>
    
  );
}
