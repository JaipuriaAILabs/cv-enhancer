from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
import os
from dotenv import load_dotenv
from models.questions_model import QuestionsModel
from models.snippets_model import SnippetsModel
from models.resume_model import ResumeModel
from typing import List
# Initialize environment variables
load_dotenv()


# Retrieve API keys from environment
anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")


# Initialize LLM instances with appropriate API keys
try:
    gpt = LLM(model="claude-3-7-sonnet-20240620", api_key=anthropic_api_key)
    # claude = LLM(model="claude-3-7-sonnet-20240620", api_key=anthropic_api_key)
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

