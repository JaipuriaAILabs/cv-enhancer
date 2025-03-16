from pydantic import BaseModel
from typing import List

class SnippetItem(BaseModel):
    snippet: str
    reason: str

class SnippetsModel(BaseModel):
    snippets: List[SnippetItem]



