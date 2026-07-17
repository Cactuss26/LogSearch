CREATE TABLE "server_logs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
    "level" VARCHAR(20) NOT NULL,
    "raw_message" TEXT NOT NULL,
    "embedding" VECTOR(384),
    "keyword_tokens" TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', raw_message)) STORED
);