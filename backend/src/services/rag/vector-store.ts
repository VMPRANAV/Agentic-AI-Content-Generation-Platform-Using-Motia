import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { CohereEmbeddings } from "@langchain/cohere";
import { PoolConfig } from "pg";

const config = {
  postgresConnectionOptions: {
    type: "postgres",
    connectionString: process.env.DATABASE_URL,
  } as PoolConfig,
  tableName: "document_embeddings", 
  columns: {
    idColumnName: "id",
    vectorColumnName: "vector",
    contentColumnName: "content",
    metadataColumnName: "metadata",
  },
};

export const getVectorStore = async () => {
  const embeddings = new CohereEmbeddings({
    apiKey: process.env.COHERE_API_KEY, // In Node.js defaults to process.env.COHERE_API_KEY
    batchSize: 48, // Default value if omitted is 48. Max value is 96
    model: "embed-english-v3.0",
  });

  return await PGVectorStore.initialize(
    embeddings, 
    config
  );
};