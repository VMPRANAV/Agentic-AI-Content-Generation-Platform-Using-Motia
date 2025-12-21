import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
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
  // Uses 'Xenova/all-MiniLM-L6-v2' by default (running locally)
  const embeddings = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2", 
  });

  return await PGVectorStore.initialize(

    embeddings, 
    config
  );
};