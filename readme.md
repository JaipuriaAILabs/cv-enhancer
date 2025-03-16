# CV Enhancer - AI-Powered Resume Improvement

![Resume Enhancer Screenshot](https://example.com/screenshot1.png)
![Resume Analysis Demo](https://example.com/screenshot2.png)
![Enhancement Suggestions](https://example.com/screenshot3.png)

## 📋 What is Resume Enhancer?

Resume Enhancer is an intelligent platform that helps job seekers improve their resumes through AI-powered analysis and personalized suggestions. Our application uses advanced AI-Agents to analyze your resume, identify improvement opportunities, and provide actionable recommendations.

## 🌟 Why Use Resume Enhancer?
- **Build a Stronger Resume**: Learn how to present academic projects and limited work experience effectively
- **Highlight Relevant Skills**: Identify and emphasize the skills that matter most for your target roles
- **Prepare for Job Market**: Get guidance on how to position yourself competitively as you enter the workforce
- **Continuous Improvement**: Refine your resume as you gain new experiences throughout your academic career

## 🚀 How It Works

1. **Upload Your Resume**: Simply upload your current resume in PDF format
2. **AI Analysis**: Our AI system analyzes your document for structure, content, and impact
3. **Answer Questions**: Respond to targeted questions about your experience to provide more context
4. **Get Recommendations**: Receive specific suggestions to enhance each section of your resume
5. **Download & Apply**: Download the refined resume as a word file and 

## 🌐 Live Demo
- Frontend: [https://cv-enhancer.vercel.app](https://cv-enhancer.vercel.app)
- Backend API: [https://cv-enhancer-backend.onrender.com](https://cv-enhancer-backend.onrender.com)

---

## 👨‍💻 For Developers

### 🏗️ Architecture

The project is split into two main components:
- Frontend: Next.js application deployed on Vercel
- Backend: FastAPI server deployed on Render

### Frontend (Next.js)

The frontend is built with Next.js and provides a modern, responsive user interface for resume uploads and interactions.

#### Key Technologies
- Next.js 14
- TypeScript
- Tailwind CSS
- React Markdown
- Axios for API calls

### Backend (FastAPI)

The backend is powered by FastAPI and orchestrates AI agents to process resumes and generate improvements.

#### Key Technologies
- FastAPI
- CrewAI for agent orchestration
- Anthropic Claude and OpenAI models
- PyPDF2 for PDF processing
- Pydantic for data validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Git

### Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cv-enhancer.git
cd cv-enhancer
```

2. **Frontend Setup**
```bash
cd frontend
npm install
```

Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
AGENTOPS_API_KEY=your_agentops_api_key
```

### Running Locally

1. **Start the Backend**
```bash
cd backend
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`

2. **Start the Frontend**
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:3000`

## 🔧 Development

### Frontend Development

1. **Component Structure**
- `Home.tsx`: Landing page and file upload
- `Questions.jsx`: Handles Q&A interface
- `MarkdownRederer.jsx`: Displays processed resume

2. **Styling**
- Uses Tailwind CSS for styling
- Global styles in `globals.css`
- Tailwind configuration in `tailwind.config.ts`

### Backend Development

1. **API Endpoints**
- `POST /`: Process uploaded PDF
- `POST /improve_resume`: Generate resume improvements
- `POST /enhance_more`: Generate additional questions

2. **AI System**
- Uses CrewAI for orchestrating AI agents
- Configurable through YAML files in `crew1config/` and `crew2config/`
- Supports fallback between different LLM providers

## 📦 Deployment

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure environment variables:
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY`
   - `AGENTOPS_API_KEY`
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`


## ⤵ Application Flow
<img width="293" alt="Screenshot 2025-03-07 at 1 20 19 PM" src="https://github.com/user-attachments/assets/7bb4092a-e1c1-4a8f-9afb-fd3ea0a42693" />


## 🔒 Security

- API keys are stored in environment variables
- CORS is configured for secure cross-origin requests
- File upload validation for PDFs
- Rate limiting on API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the JaipuriaAI License - see the [LICENSE](LICENSE) file for details.

## 🙏 Third-Party Libraries

- [CrewAI](https://github.com/joaomdmoura/crewAI)
- [Anthropic Claude](https://www.anthropic.com/)
- [OpenAI](https://openai.com/)
- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
