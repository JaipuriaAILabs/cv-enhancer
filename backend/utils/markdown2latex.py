from typing import Type
from pydantic import BaseModel, Field
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
MODEL = "gpt-4o-mini"


#////////////////////////////////////////////////////////#
def markdown_to_latex(markdown_text: str) -> str:
    """
    Converts a given Markdown text to LaTeX format. Using An LLM.
    
    Args:
        markdown_text (str): The Markdown text to be converted.
    
    Returns:
        str: The equivalent LaTeX code.    
    """

    example_latex = r"""
    \documentclass[10pt]{article}
    \usepackage[utf8]{inputenc}
    \usepackage[T1]{fontenc}
    \usepackage{graphicx}
    \usepackage[export]{adjustbox}
    \graphicspath{ {./images/} }
    \usepackage{hyperref}
    \hypersetup{colorlinks=true, linkcolor=blue, filecolor=magenta, urlcolor=cyan,}
    \urlstyle{same}
    \usepackage{amsmath}
    \usepackage{amsfonts}
    \usepackage{amssymb}
    \usepackage[version=4]{mhchem}
    \usepackage{stmaryrd}
    \usepackage{tfrupee}
    \usepackage{array}
    \usepackage{geometry}

    % Reduce margins to maximize space
    \geometry{margin=1cm}

    % Remove padding from tables
    \setlength{\tabcolsep}{3pt}
    \renewcommand{\arraystretch}{0.9}

    \DeclareUnicodeCharacter{20B9}{\ifmmode\text{\rupee}\else\rupee\fi}

    \begin{document}
    \begin{center}
    \includegraphics[max width=\textwidth]{2025_03_05_00de736fdc2a3fbc5beag-1}
    \end{center}

    \noindent
    \textbf{Name:} Rupi Chaddha\\
    \textbf{E-mail:} \href{mailto:rupi.chaddha.251@jaipuria.ac.in}{rupi.chaddha.251@jaipuria.ac.in}\\
    \textbf{Linkedin Id:} \href{http://www.linkedin.com/in/rupichaddha}{www.linkedin.com/in/rupichaddha}\\
    \textbf{Contact No:} 8005217630\\
    \textbf{DOB:} 10-01-1998\\
    \textbf{Address:} 19/846 Indira Nagar, Lucknow, Uttar Pradesh - 226016

    \vspace{0.1cm}
    \noindent
    \begin{center}
    \setlength{\tabcolsep}{2pt}
    \begin{tabular}{|l|c|l|c|}
    \hline
    \textbf{Academic Record} & 2023-25 & Jaipuria Institute of Management & 86\% \\
    \hline
    PGDM & 2019-21 & National P.G. College & 66\% \\
    \hline
    M. Com & 2016-19 & National P.G. College & 65\% \\
    \hline
    B. Com & 2016 & Spring Dale College(ICSE) & 68\% \\
    \hline
    Class XII & 2014 & Spring Dale College(ICSE) & 78\% \\
    \hline
    \end{tabular}
    \end{center}

    \vspace{0.2cm}
    \noindent
    \textbf{Achievements}\\
    Won Academic Excellence Award for III$^{\text{rd}}$ Trimester and overall topper in Management Accounting and Control and Emotional Intelligence

    \vspace{0.2cm}
    \noindent
    \textbf{Certification}
    \begin{itemize}
    \setlength{\itemsep}{0pt}
    \setlength{\parskip}{0pt}
    \item Investment Analysis \& Portfolio Management: Udemy
    \item NISM Series V-A: Mutual Funds Distributor
    \item Financial Modelling: The Valuation School (In Progress)
    \end{itemize}

    \vspace{0.2cm}
    \noindent
    \begin{tabular}{|p{0.7\textwidth}|p{0.25\textwidth}|}
    \hline
    \textbf{Summer Project} & \textbf{(2 Months)} \\
    \hline
    Equitas Small Finance Bank Ltd., Varanasi & \multirow{2}{*}{1$^{\text{st}}$ May' 24- 30$^{\text{th}}$ June'24} \\
    \textbf{Strategic Insights: Enhancing Credit Operations and Risk Management at Equitas Small Finance Bank Ltd. for Profitability and Product Excellence} & \\
    \hline
    \end{tabular}

    \vspace{0.1cm}
    \noindent
    \textbf{Description}\\
    Developed a model to identify root causes of loan defaults, significantly enhancing the bank's risk assessment process. The model analyzed patterns and commonalities among defaulters, leading to more accurate creditworthiness evaluations and reduced risk of default.

    \vspace{0.1cm}
    \noindent
    \textbf{Learning}
    \begin{itemize}
    \setlength{\itemsep}{0pt}
    \setlength{\parskip}{0pt}
    \item \textbf{Financial Modeling:} Developed a model for identifying root causes of loan defaults, significantly improving the bank's risk assessment process.
    \item \textbf{Data Analytics:} Conducted extensive data analysis to identify patterns among defaulters, leading to more accurate creditworthiness evaluations.
    \item \textbf{Business Intelligence:} Contributed to tele-verification, CAM creation, and customer outreach efforts, enhancing overall credit operations.
    \end{itemize}
    \textbf{Skills Developed:} Creditworthiness Evaluation, Risk Management, Data-Driven Insights, Financial Modeling

    \vspace{0.2cm}
    \noindent
    \begin{tabular}{|p{0.7\textwidth}|p{0.25\textwidth}|}
    \hline
    \textbf{Other Project} & \textbf{(1 Week)} \\
    \hline
    \textbf{Equity Analysis and Portfolio Management} & \multirow{2}{*}{6$^{\text{th}}$ Aug' 24-13$^{\text{th}}$ Aug'24} \\
    \textbf{Optimized Trading Strategy for Siemens Ltd.} & \\
    \hline
    \end{tabular}

    \vspace{0.1cm}
    \noindent
    \textbf{Description}\\
    Developed and optimized intraday trading strategies for Siemens Ltd. using a combination of technical indicators, including moving averages and RSI, on a one-minute chart. Evaluated strategy performance over six days, leveraging a capital of ₹5 lakhs, and identified the most profitable approach for consistent returns. Demonstrated proficiency in technical analysis, strategy testing, and performance evaluation, contributing to enhanced portfolio management skills.

    \vspace{0.1cm}
    \noindent
    \textbf{Learning}
    \begin{itemize}
    \setlength{\itemsep}{0pt}
    \setlength{\parskip}{0pt}
    \item \textbf{Technical Analysis:} Developed and optimized intraday trading strategies using technical indicators (e.g., moving averages, RSI).
    \item \textbf{Performance Analysis:} Managed a capital of ₹5 lakhs, analyzing strategy performance over six days to identify the most profitable approach.
    \item \textbf{Strategic Insight:} Delivered meaningful commentary and insights on trading results, contributing to overall strategy enhancement.
    \end{itemize}
    \textbf{Skills Developed:} Financial Analysis, Trading Strategy Optimization, Technical Analysis

    \vspace{0.2cm}
    \noindent
    \textbf{Achievements}
    \begin{itemize}
    \setlength{\itemsep}{0pt}
    \setlength{\parskip}{0pt}
    \item President of Student Development Council
    \item Junior member of the Incubation Committee
    \item Won Stellar Award for I$^{\text{st}}$ and III$^{\text{rd}}$ Trimester
    \item Played basketball at district level
    \item NCC 'C' Certificate
    \end{itemize}

    \vspace{0.2cm}
    \noindent
    \textbf{Professional Skills}
    \begin{itemize}
    \setlength{\itemsep}{0pt}
    \setlength{\parskip}{0pt}
    \item Communication
    \item Team Player
    \item Problem Solving \& Decision Making
    \item Time Management
    \end{itemize}

    \end{document}
    """
  
    try:
        response = client.chat.completions.create(
            model=MODEL,
            seed=314,
            messages=[
                {"role": "system", "content": f"You are a helpful assistant that converts Markdown to A LaTeX RESUME WITH TABLES AND IMAGES INTO THIS FORMAT:{example_latex}"},
                {"role": "user", "content": f"""Look at the following example:
                   {example_latex}
                 and convert the following Markdown to LaTeX: {markdown_text}

                 MAKE SURE TO FOLLOW THE FORMAT OF THE EXAMPLE.
                """}
            ]
        )
        latex_text = response.choices[0].message.content
        return latex_text
    except Exception as e:
        print(f"Error converting Markdown to LaTeX: {e}")
        return ""
   


# Example usage
