from db.session import get_conn
from psycopg import AsyncConnection

async def add_log(conn: AsyncConnection, timestamp: str, level: str, message: str, embedding: list[list[float]]):
    query = """
    INSERT INTO server_logs (timestamp, level, raw_message, embedding) 
    VALUES (%s, %s, %s, %s)
    RETURNING id;
    """

    async with conn.cursor() as cursor:
        try:
            await cursor.execute(query, (timestamp, level, message, embedding))
            newrow = await cursor.fetchone()

            if (newrow):
                log_id = newrow[0]

            await conn.commit()
            return log_id
        except Exception as e:
            await conn.rollback()
            raise e
        
async def batch_add_log(conn: AsyncConnection, timestamps: list[str], levels: list[str], messages: list[str], 
                        embeddings: list[list[float]]):
    query = """
    INSERT INTO server_logs (timestamp, level, raw_message, embedding)
    VALUES (%s, %s, %s, %s)
    RETURNING id;
    """
    
    async with conn.cursor() as cursor:
        try:
            await cursor.executemany(query, list(zip(timestamps, levels, messages, embeddings)))
            await conn.commit()
        except Exception as e:
            await conn.rollback()
            raise e


async def hybrid_search(conn: AsyncConnection, query: str, query_embedding: list[float], start_time: str = "",
                        end_time: str = "", log_level: str = ""):
    filter = "TRUE"
    params = {"query": query, "query_embeddings": query_embedding}

    if start_time and end_time:
        filter += " AND timestamp BETWEEN %(start_time)s AND %(end_time)s"
        params["start_time"] = start_time
        params["end_time"] = end_time

    if log_level:
        filter += " AND level = %(level)s"
        params["level"] = log_level
    
    query = f"""
    WITH keyword_search AS (
        SELECT id, timestamp, level, raw_message,
        RANK() OVER (ORDER BY ts_rank(keyword_tokens, plainto_tsquery('english', %(query)s)) DESC) AS rank
        FROM server_logs
        WHERE {filter} 
        AND keyword_tokens @@ plainto_tsquery('english', %(query)s)
        LIMIT 20
    ),

    semantic_search AS (
        SELECT id, timestamp, level, raw_message,
        RANK() OVER (ORDER BY (%(query_embeddings)s::vector <=> embedding) ASC) AS rank
        FROM server_logs
        WHERE {filter}
        LIMIT 20
    )

    SELECT 
        COALESCE(k.id, s.id) AS id,
        COALESCE(k.timestamp, s.timestamp) AS timestamp,
        COALESCE(k.level, s.level) AS level,
        COALESCE(k.raw_message, s.raw_message) AS message,
        COALESCE(1 / (60.0 + k.rank), 0.0) + COALESCE(1 / (60.0 + s.rank), 0.0) AS rrf_rank
    FROM keyword_search AS k
    FULL OUTER JOIN semantic_search AS s ON k.id = s.id
    ORDER BY rrf_rank DESC
    LIMIT 10
    """

    async with conn.cursor() as cursor:
        await cursor.execute(query, params)
        retrieved_logs = await cursor.fetchall()
        return retrieved_logs