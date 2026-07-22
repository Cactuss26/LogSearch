from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db.session import db_pool
from routes.logRoutes import router
from services.embeddings import load_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        print("Loading embedding model")
        load_model()
        print("Completed loading embedding model")

        print("Opening db pool")
        await db_pool.open()
        print("Successfully opened database pool")

        yield
    except:
        raise BaseException("Error opening database pool")

    finally:
        await db_pool.close()
        print("Closed Database connection pool")

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected"
    }

@app.get("/api/logs")
async def get_logs():
    return {
        "logs": []
    }