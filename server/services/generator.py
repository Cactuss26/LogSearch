from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os

model = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    temperature=0.2,
    api_key=os.getenv("GOOGLE_API_KEY"),
    timeout=300,
    max_tokens=None,
    max_retries=1,
)

system_prompt = """
    You are a senior DevOps engineer analyzing server logs to troubleshoot issues.
    Answer the user's question using ONLY the provided log context. 
    If the logs do not contain the answer, just state that you do not have enough information.

    Retrieved Log Context:
    {context}
"""

generation_template = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{query}")
])

chain = generation_template | model | StrOutputParser()