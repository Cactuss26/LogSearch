from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from psycopg import AsyncConnection
import json

from db.session import get_conn
from services.query_extractor import extract_constraints
from services.embeddings import generate_embedding_query
from services.dbqueries import hybrid_search
from schemas.req_schema import SearchRequest, GenerateRequest
from services.generator import chain

router = APIRouter(prefix="/api", tags=["Search"])

@router.post("/search")
async def get_logs(request: SearchRequest):
    print("Received request")
    try:
        metadata = extract_constraints(request.query)
        print("got constraints")
        query_embedding = generate_embedding_query(metadata.query)

        print("Got embeddings")

        async with get_conn() as conn:
            print("Opened db conn")
            retrieved_logs = await hybrid_search(
                conn=conn,
                query=metadata.query,
                query_embedding=query_embedding,
                start_time=metadata.startTimeStamp,
                end_time=metadata.endTimeStamp,
                log_level=metadata.logLevel
            )

        print("Got logs")
        formatted_logs = []

        for row in retrieved_logs:
            formatted_logs.append({
                "id": str(row[0]),
                "timestamp": str(row[1]),
                "level": str(row[2]),
                "raw_message": row[3],
                "rrf-score": float(row[4])
            })

        return formatted_logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search pipeline failed: {str(e)}")


@router.post("/generate")
async def generate_answer(request: GenerateRequest):
    try:
        context = ""

        if not request.context_logs:
            context = "No logs available"
        else:
            for index, log in enumerate(request.context_logs):
                context += f"Log {index + 1}: [{log['timestamp']}] [{log['level']}] {log['raw_message']}\n"

        async def token_generator():
            async for chnk in chain.astream({
                "context": context,
                "query": request.query
            }):
                if chnk:
                    yield chnk

        return StreamingResponse(token_generator(), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

