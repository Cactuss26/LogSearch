from pydantic import BaseModel, Field
from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import datetime
from dotenv import load_dotenv
import os

load_dotenv()

model = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.0,
    timeout=300,
    max_retries=1,
)

class ResponseConstraints(BaseModel):
    startTimeStamp: Optional[str] = Field(
        None,
        description="Strict starting timestamp in the ISO 8601 format (YYYY-MM-DD HH:MM:SS+5:30)"
    )
    endTimeStamp: Optional[str] = Field(
        None,
        description="Strict ending timestamp in the ISO 8601 format (YYYY-MM-DD HH:MM:SS+5:30)"
    )
    logLevel: Optional[str] = Field(
        None,
        description="Severity level of the log between (It's an HTTP status code), if not mentioned then leave it as null"
    )
    query: str = Field(
        ...,
        description="The main question, not including any timestamp or severity level"
    )


def extract_constraints(user_prompt: str):
    prompt_template = ChatPromptTemplate([
        ("system", """
        You are a logging knowledge specialist, You can understand user's queries regarding log outputs and
        specify the time constraints in which the user is asking their query, and what query itself they are asking.
        
        You job is to find the starting timestamp and the ending timestamp (from the user input string) between which the 
        user is asking their query about the log files. Output the response according to the structure: startTimeStamp,
        endTimeStamp, and the rest of the query (the problem that they are asking).
         
        If time is mentioned using relative terms like 'yesterday', or 'tomorrow', use the current time provided in the
        input"""),
        ("human", "{input}"),
    ])

    structured_model = model.with_structured_output(ResponseConstraints, method="json_schema")

    current_time = datetime.datetime.today()
    extended_input = f"Current time: {current_time}, query: {user_prompt}"
    chain = prompt_template | structured_model
    return chain.invoke({"input": extended_input})