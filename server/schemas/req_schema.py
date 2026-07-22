from pydantic import BaseModel
from typing import List, Dict, Any
class SearchRequest(BaseModel):
    query: str

class GenerateRequest(BaseModel):
    query: str
    context_logs: List[Dict[str, Any]]
