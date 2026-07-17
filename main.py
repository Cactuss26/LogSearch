from fastapi import FastAPI
from contextlib import asynccontextmanager
from db.session import db_pool
from routes.search import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await db_pool.open()
        print("Successfully opened database pool")
        yield
    except:
        raise BaseException("Error opening database pool")

    finally:
        await db_pool.close()
        print("Closed Database connection pool")

app = FastAPI(lifespan=lifespan)

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