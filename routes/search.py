from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from psycopg import AsyncConnection

from db.session import get_conn
from services.query_extractor import extract_constraints
from services.embeddings import generate_embedding_query
from services.dbqueries import hybrid_search
from schemas.req_schema import QueryRequest
from services.generator import chain

router = APIRouter(prefix="/api/search", tags=["Search"])

@router.post("")
async def generate_answer(request: QueryRequest):
    try:
        metadata = extract_constraints(request.query)
        query_embedding = generate_embedding_query(metadata.query)

        async with get_conn() as conn:
            retrieved_logs = await hybrid_search(
                conn=conn,
                query=metadata.query,
                query_embedding=query_embedding,
                start_time=metadata.startTimeStamp,
                end_time=metadata.endTimeStamp,
                log_level=metadata.logLevel
            )

        formatted_logs = []
        context = ""

        for index, row in enumerate(retrieved_logs):
            formatted_logs.append({
                "id": str(row[0]),
                "timestamp": str(row[1]),
                "level": str(row[2]),
                "raw-message": row[3],
                "rrf-score": float(row[4])
            })
            context += f"Log {index + 1}: [{row[1]}] [{row[2]}] {row[3]}\n"

        response = chain.invoke({
            "context": context,
            "query": request.query
        })

        return {
            "ai_analysis": response.content,
            "source-logs": formatted_logs,
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search pipeline failed: {str(e)}")

