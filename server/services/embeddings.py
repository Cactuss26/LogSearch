from langchain_huggingface import HuggingFaceEndpointEmbeddings
from coresettings.config import EMBEDDINGS_BATCH_SIZE
from .regexpattern import log_pattern
from .dbqueries import batch_add_log, hybrid_search
from db.session import get_conn, db_pool
from services.query_extractor import extract_constraints
import asyncio, os, dotenv

dotenv.load_dotenv()
model = None

def load_model():
    global model

    try:
        print("Loading model")
        model = HuggingFaceEndpointEmbeddings(
            model="sentence-transformers/all-MiniLM-L6-v2",    
            task="feature-extraction"
        )
        print("Model loaded")
    except Exception as e:
        print("Failed to load model")

def generate_embedding_query(query: str) -> list[float]:
    if (model):
        return model.embed_query(query)
    return []


def generate_embeddings(logs: list[str]) -> list[list[float]]:
    if (model):
        embeddings = model.embed_documents(logs)
        return embeddings
    return []


# extracting logfiles
async def store_embeddings():
    with open("data/ApacheHttp.log", "r", encoding="utf-8", errors="replace") as f:
        current_batch_metadata = {
            "timestamps": [],
            "levels": [],
            "raw_messages": [],
        }

        load_model()
        async with get_conn() as conn:                
            for line in f:
                res = log_pattern.match(line)

                if (res):
                    timestamp = res.group(1)
                    level = res.group(2)
                    message = res.group(3)
                    current_batch_metadata["timestamps"].append(timestamp)
                    current_batch_metadata["levels"].append(level)
                    current_batch_metadata["raw_messages"].append(message)
            
                if (len(current_batch_metadata["raw_messages"]) == EMBEDDINGS_BATCH_SIZE):
                    embeddings = generate_embeddings(current_batch_metadata["raw_messages"])

                    t = await batch_add_log(
                        conn, 
                        current_batch_metadata["timestamps"],
                        current_batch_metadata["levels"],
                        current_batch_metadata["raw_messages"],
                        embeddings,
                        )
                    
                    current_batch_metadata = {
                       "timestamps": [],
                        "levels": [],
                        "raw_messages": [],
                    }
            
            # final block
            if (len(current_batch_metadata["raw_messages"]) > 0):
                embeddings = generate_embeddings(current_batch_metadata["raw_messages"])

                t = await batch_add_log(
                    conn, 
                    current_batch_metadata["timestamps"],
                    current_batch_metadata["levels"],
                    current_batch_metadata["raw_messages"],
                    embeddings,
                    )
                
                current_batch_metadata = {
                    "timestamps": [],
                    "levels": [],
                    "raw_messages": [],
                }


# async def main():
#     # await db_pool.open()

#     # try:
#     #     print("Started storing into DB")
#     #     await store_embeddings()
#     #     print("Finished storing into DB")

#     # finally:
#     #     await db_pool.close()


# if __name__ == "__main__":
#     # asyncio.run(main())
#     ...