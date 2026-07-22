from services.embeddings import store_embeddings
from db.session import db_pool
import asyncio

async def main():
    await db_pool.open()

    try:
        print("Started storing into DB")
        await store_embeddings()
        print("Successfully stored embeddings")
    finally:
        await db_pool.close()

if __name__ == "__main__":
    asyncio.run(main())