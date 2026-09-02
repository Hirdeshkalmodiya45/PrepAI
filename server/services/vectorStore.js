const { MemoryVectorStore } = require("@langchain/classic/vectorstores/memory");
const embeddings = require("./embeddingService");

// User-wise vector stores
const vectorStores = new Map();

async function createVectorStore(chunks, userId) {
  const vectorStore = await MemoryVectorStore.fromDocuments(
    chunks,
    embeddings
  );

  vectorStores.set(userId.toString(), vectorStore);

  return vectorStore;
}

async function getRetriever(userId) {
  const vectorStore = vectorStores.get(userId.toString());

  if (!vectorStore) {
    throw new Error("Resume not uploaded yet.");
  }

  return vectorStore.asRetriever(5);
}

module.exports = {
  createVectorStore,
  getRetriever,
};