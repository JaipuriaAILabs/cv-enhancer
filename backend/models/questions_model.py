from pydantic import BaseModel
from typing import List


class QuestionsModel(BaseModel):
    questions: List[str]
