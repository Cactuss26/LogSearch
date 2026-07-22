from psycopg_pool import AsyncConnectionPool
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os

load_dotenv()

db_pool = AsyncConnectionPool(
    conninfo=os.getenv("DATABASE_URL", ""),
    open=False,
    min_size=1,
    max_size=10
)

@asynccontextmanager
async def get_conn():
    async with db_pool.connection() as conn:
        yield conn