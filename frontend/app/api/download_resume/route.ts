import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  try {
    const { resumeData } = await req.json();
    
    // Create a promise that will resolve with the PDF data
    const pdfPromise = (async () => {
      // Launch Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
      });
      
      const page = await browser.newPage();
      
      // Inject resume data with the correct localStorage key
      await page.evaluateOnNewDocument((data) => {
        localStorage.setItem('resume-storage', JSON.stringify({ 
          state: { 
            resumeData: data 
            // Include other state properties if needed
          },
          version: 0
        }));
      }, resumeData);
      
      // Navigate to your resume preview page
      const baseUrl = 'http://localhost:3000';
      await page.goto(`${baseUrl}/preview`, { waitUntil: 'networkidle0' });
      
      // Wait for the resume to render
      await page.waitForSelector('#resume-renderer', { timeout: 10000 });
      
      // Generate PDF
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
        preferCSSPageSize: true,
      });
      
      await browser.close();
      return pdf;
    })();
    
    // Wait for the PDF generation to complete
    const pdf = await pdfPromise;
    
    // Return PDF as downloadable file
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=resume.pdf',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
