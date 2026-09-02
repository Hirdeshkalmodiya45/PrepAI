const { ChatGroq } = require("@langchain/groq");

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
  temperature: 0.2,
});

async function invokeLLM(messages) {
  const response = await llm.invoke(messages);
  return response.content;
}

module.exports = {
  invokeLLM,
};