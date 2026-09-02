const { getRetriever } = require("./vectorStore");

async function getResumeContext(userId, question) {
  const retriever = await getRetriever(userId);

  const docs = await retriever.invoke(question);

  if (!docs || docs.length === 0) {
    return "No relevant information found in the resume.";
  }

  return docs.map((doc) => doc.pageContent).join("\n\n");
}

module.exports = {
  getResumeContext,
};