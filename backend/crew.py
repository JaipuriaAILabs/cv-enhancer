from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
import os
from dotenv import load_dotenv
from models.questions_model import QuestionsModel
from models.snippets_model import SnippetsModel
from models.resume_mode import ResumeModel
from typing import List
# Initialize environment variables
load_dotenv()


# Retrieve API keys from environment
anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")


# Initialize LLM instances with appropriate API keys
try:
    gpt = LLM(model="gpt-4o-mini", api_key=openai_api_key)
    claude = LLM(model="claude-3-5-sonnet-20240620", api_key=anthropic_api_key)
    # meta = LLM(model="llama-3.1-8b-instruct", api_key=meta_api_key)
except Exception as e:
    raise RuntimeError("Failed to initialize LLM models") from e


# Defining the crew for question and snippet generation
@CrewBase
class QuestionAndSnippetGeneratorCrew:
    """
    A crew responsible for analyzing resumes and generating relevant questions.
    Handles the identification of key snippets and generation of targeted questions.
    """

    agents_config = "crew1config/agents.yaml"
    tasks_config = "crew1config/tasks.yaml"

    @agent
    def question_generator(self) -> Agent:
        """
        Creates an agent specialized in generating questions from resume content.
        
        Returns:
            Agent: Configured question generation agent
            
        Raises:
            RuntimeError: If agent creation fails
        """
        try:
            return Agent(
                config=self.agents_config['question_generator'],
                verbose=True,
                llm=gpt,
            )
        except Exception as e:
            raise RuntimeError("Failed to create question generator agent") from e

    @task
    def snippet_identification_task(self) -> Task:
        """
        Creates a task for identifying relevant snippets from the resume.
        
        Returns:
            Task: Configured snippet identification task
            
        Raises:
            RuntimeError: If task creation fails
        """
        try:
            return Task(config=self.tasks_config['snippet_identification_task'], output_json=SnippetsModel)
        except Exception as e:
            raise RuntimeError("Failed to create snippet identification task") from e

    @task
    def generate_questions_task(self) -> Task:
        """
        Creates a task for generating questions based on identified snippets.
        
        Returns:
            Task: Configured question generation task
            
        Raises:
            RuntimeError: If task creation fails
        """
        try:
            return Task(config=self.tasks_config['generate_questions_task'], output_json=QuestionsModel)
        except Exception as e:
            raise RuntimeError("Failed to create generate questions task") from e

    @crew
    def crew(self) -> Crew:
        """
        Assembles the crew for resume analysis and question generation.
        
        Returns:
            Crew: Configured crew with sequential processing
            
        Raises:
            RuntimeError: If crew creation fails
        """
        try:
            return Crew(
                agents=self.agents, 
                tasks=self.tasks,  
                process=Process.sequential,
                verbose=True,
                memory=True
            )
        except Exception as e:
            raise RuntimeError("Failed to create question generator crew") from e

@CrewBase
class ResumeUpdationAndFlowControlCrew:
    """
    A crew responsible for managing resume updates and controlling the iteration flow.
    Handles the processing of user responses and updates to resume content.
    """

    agents_config = "crew2config/agents.yaml"
    tasks_config = "crew2config/tasks.yaml"

    @agent
    def response_updater(self) -> Agent:
        """
        Creates an agent for processing user responses and updating resume content.
        
        Returns:
            Agent: Configured response updater agent
            
        Raises:
            RuntimeError: If agent creation fails
        """
        try:
            return Agent(config=self.agents_config['response_updater'], verbose=True, llm=gpt)
        except Exception as e:
            raise RuntimeError("Failed to create response updater agent") from e

    @agent
    def iteration_manager(self) -> Agent:
        """
        Creates an agent for managing the iteration process of resume updates.
        
        Returns:
            Agent: Configured iteration manager agent
            
        Raises:
            RuntimeError: If agent creation fails
        """
        try:
            return Agent(config=self.agents_config['iteration_manager'], verbose=True, llm=gpt)
        except Exception as e:
            raise RuntimeError("Failed to create iteration manager agent") from e

    @task
    def update_resume_content_task(self) -> Task:
        """
        Creates a task for updating resume content based on user responses.
        
        Returns:
            Task: Configured resume update task
            
        Raises:
            RuntimeError: If task creation fails
        """
        try:
            return Task(
                config=self.tasks_config['update_resume_content_task'],
                output_json=ResumeModel
            )
        except Exception as e:
            raise RuntimeError("Failed to create update resume content task") from e

    @task
    def iterate_process_task(self) -> Task:
        """
        Creates a task for managing the iteration process of resume updates.
        
        Returns:
            Task: Configured iteration process task
            
        Raises:
            RuntimeError: If task creation fails
        """
        try:
            return Task(
                config=self.tasks_config['iterate_process_task'],
            )
        except Exception as e:
            raise RuntimeError("Failed to create iterate process task") from e

    @crew
    def crew(self) -> Crew:
        """
        Assembles the crew for resume updating and flow control.
        
        Returns:
            Crew: Configured crew with sequential processing
            
        Raises:
            RuntimeError: If crew creation fails
        """
        try:
            return Crew(
                agents=[self.response_updater(), self.iteration_manager()],
                tasks=[self.update_resume_content_task(), self.iterate_process_task()],
                process=Process.sequential,
                verbose=True,
                memory=True
            )
        except Exception as e:
            raise RuntimeError("Failed to create resume updation crew") from e




resume = r"""
{
    "resume": {
        "personalInfo": {
            "name": "Ananya Singh",
            "email": "ux.ananya@gmail.com",
            "linkedinId": "https://www.linkedin.com/in/ananya-singh-95bb83242",
            "contactNo": "+918822910379",
            "dob": "",
            "address": ""
        },
        "education": [
            {
                "title": "Bachelor of Design (Interaction Design)",
                "period": "Sep 2022 - Present",
                "institution": "JK Lakshmipat University",
                "percentage": "8.1 CGPA"
            },
            {
                "title": "Bachelor of Design (Dropped)",
                "period": "Sep 2021 - Aug 2022",
                "institution": "NID AP",
                "percentage": ""
            },
            {
                "title": "Higher Secondary School Certificate (Science: PCM)",
                "period": "Graduated May 2021",
                "institution": "Assam Valley School",
                "percentage": "98.33% in ICSE and 98.4% in ISC"
            }
        ],
        "academicAchievements": [
            "Achieved 100% and 75% Merit Scholarships for academic excellence.",
            "Received the Carling Award for Academic Excellence for achieving the highest scores in the batch at both ISC and ICSE level.",
            "Won the award for Outstanding Performance in Still Life Art at Indian Public Schools Conference - Visual Arts Competition 2019, held at Daly College Indore.",
            "Secured the first position in Imaginative Composition Painting and third position in Still Life Painting at the Srijanya National Visual Arts Competition."
        ],
        "certifications": [],
        "projects": [],
        "achievements": [],
        "skills": [
            "Wireframing",
            "Prototyping",
            "Interaction Design",
            "Web Design",
            "Visual Design",
            "Micro-Animations",
            "User Interface/UI Design",
            "Data Visualization",
            "Digital Art",
            "Illustration",
            "Design for Augmented Reality (AR)",
            "User Research",
            "Usability Analysis",
            "Contextual Enquiry",
            "Hierarchical Task Analysis",
            "Competitor Analysis",
            "Benchmarking",
            "Surveys",
            "User Journey Mapping",
            "Quantitative and Qualitative Analysis",
            "Information Architecture",
            "Figma",
            "Framer",
            "Xmind",
            "Procreate",
            "Miro",
            "Slack",
            "Creative Cloud (Adobe XD, Aero, Premiere Pro, Illustrator, Photoshop)",
            "Working Knowledge of TouchDesigner, Blender, and Arduino"
        ],
        "experience": [
            {
                "title": "UX Design Intern",
                "organization": "HDFC Bank",
                "duration": "May 2024 - Aug 2024",
                "period": "",
                "description": [
                    "Designed the interfaces for the Payment Gateway (B2C) and Commercial Cards Portal (B2B), implementing research-driven solutions aimed at innovation within these product ecosystems.",
                    "Conducted user research and competitor studies, synthesized findings into comprehensive research reports, and transformed key insights into interactive prototypes that optimized usability and feature functionality."
                ]
            },
            {
                "title": "User Experience Specialist Intern",
                "organization": "Ohilo Game Studio",
                "duration": "Jun 2024 - Jul 2024",
                "period": "",
                "description": [
                    "Led the interface design for two motion-tracking based mobile games — creating UX flows, gameplay tutorials, UI, and visual design — supported by benchmarking studies.",
                    "Collaborated closely with game developers, a UX manager, and graphic artists to ensure smooth handoff and cohesive implementation of designs."
                ]
            },
            {
                "title": "Freelance Web and Visual Designer",
                "organization": "Decorise, CandleCraft Co.",
                "duration": "Aug 2024 - Oct 2024",
                "period": "",
                "description": [
                    "Developed a Shopify website for Decorise, revamping their visual brand identity and improving usability, working directly with a developer for implementation.",
                    "Designed visual identity and branding assets for CandleCraft Co. including print collateral (business cards, instruction cards, gift cards, stickers, etc.), logo design, and Shopify website UI."
                ]
            },
            {
                "title": "UX Design Intern",
                "organization": "The Janki",
                "duration": "Feb 2024 - Mar 2024",
                "period": "",
                "description": [
                    "Led a comprehensive redesign of Janki's jewelry website with a modern theme targeting a younger, luxury-oriented audience while reimagining brand identity."
                ]
            },
            {
                "title": "UX Design Intern",
                "organization": "Brand Baker",
                "duration": "Sep 2023 - May 2024",
                "period": "",
                "description": [
                    "Conceptualized and created the complete UX/UI for a habit-building edutainment app for children, creating habit tracking screens and mini-educational games, while collaborating closely with cross-functional teams."
                ]
            }
        ]
    },
    "questions": {
        "questions": [
            "Can you provide specific metrics or examples of how usability and feature functionality were optimized during your user research and competitor studies at HDFC Bank?",
            "What were the measurable outcomes or improvements in website metrics (e.g., conversion rates, user engagement) after the redesign of Janki's jewelry website?",
            "Can you describe specific outcomes or performance metrics resulting from the interfaces you designed for the Payment Gateway and Commercial Cards Portal at HDFC Bank?",
            "What quantifiable results did you observe in usability or engagement scores after developing the Shopify website for Decorise?",
            "Could you explain the reason for discontinuing the Bachelor of Design program at NID AP to provide clarity on your educational timeline?"
        ]
    },
    "snippets": {
        "snippets": [
            {
                "snippet": "Conducted user research and competitor studies, synthesized findings into comprehensive research reports, and transformed key insights into interactive prototypes that optimized usability and feature functionality.",
                "reason": "This statement lacks specific metrics or details about how the usability and feature functionality were optimized, hindering its impact."
            },
            {
                "snippet": "Led a comprehensive redesign of Janki's jewelry website with a modern theme targeting a younger, luxury-oriented audience while reimagining brand identity.",
                "reason": "This entry does not provide any measurable outcomes or improvements in website metrics such as conversion rates or user engagement post-redesign."
            },
            {
                "snippet": "Designed the interfaces for the Payment Gateway (B2C) and Commercial Cards Portal (B2B), implementing research-driven solutions aimed at innovation within these product ecosystems.",
                "reason": "This statement could be enhanced by including specific outcomes or performance metrics resulting from the designed interfaces."
            },
            {
                "snippet": "Developed a Shopify website for Decorise, revamping their visual brand identity and improving usability, working directly with a developer for implementation.",
                "reason": "It lacks quantifiable results regarding the improvement in usability or engagement scores after the website development."
            },
            {
                "snippet": "Bachelor of Design (Dropped), Sep 2021 - Aug 2022, NID AP",
                "reason": "The reason for discontinuing the Bachelor of Design program is not mentioned, which could lead to gaps or concerns about the interrupted educational timeline."
            }
        ]
    }
}
"""

snippets = r"""
[
    {
        "snippet": "Conducted user research and competitor studies, synthesized findings into comprehensive research reports, and transformed key insights into interactive prototypes that optimized usability and feature functionality.",
        "reason": "This statement lacks specific metrics or details about how the usability and feature functionality were optimized, hindering its impact."
    },
    {
        "snippet": "Led a comprehensive redesign of Janki's jewelry website with a modern theme targeting a younger, luxury-oriented audience while reimagining brand identity.",
        "reason": "This entry does not provide any measurable outcomes or improvements in website metrics such as conversion rates or user engagement post-redesign."
    },
    {
        "snippet": "Designed the interfaces for the Payment Gateway (B2C) and Commercial Cards Portal (B2B), implementing research-driven solutions aimed at innovation within these product ecosystems.",
        "reason": "This statement could be enhanced by including specific outcomes or performance metrics resulting from the designed interfaces."
    },
    {
        "snippet": "Developed a Shopify website for Decorise, revamping their visual brand identity and improving usability, working directly with a developer for implementation.",
        "reason": "It lacks quantifiable results regarding the improvement in usability or engagement scores after the website development."
    },
    {
        "snippet": "Bachelor of Design (Dropped), Sep 2021 - Aug 2022, NID AP",
        "reason": "The reason for discontinuing the Bachelor of Design program is not mentioned, which could lead to gaps or concerns about the interrupted educational timeline."
    }
]
"""

questions = r"""

"""