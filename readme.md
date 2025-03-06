# CV Enhancer - AI-Powered Resume Improvement Platform

CV Enhancer is a full-stack application that helps users improve their resumes through AI-powered analysis and suggestions. The platform uses advanced language models to analyze resumes, generate targeted questions, and provide enhancement suggestions.

## 🌐 Live Demo
- Frontend: [https://cv-enhancer.vercel.app](https://cv-enhancer.vercel.app)
- Backend API: [https://cv-enhancer-backend.onrender.com](https://cv-enhancer-backend.onrender.com)

## 🏗️ Architecture

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CrewAI](https://github.com/joaomdmoura/crewAI)
- [Anthropic Claude](https://www.anthropic.com/)
- [OpenAI](https://openai.com/)
- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)


