const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

async function splitDocuments(documents) {
  return await splitter.splitDocuments(documents);
}

module.exports = {
  splitDocuments,
};