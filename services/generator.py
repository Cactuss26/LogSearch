from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

model = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    temperature=0.2
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

chain = generation_template | model