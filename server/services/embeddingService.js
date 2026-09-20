
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

const embeddings = new GoogleGenerativeAIEmbeddings({

  apiKey: process.env.GOOGLE_API_KEY,

 model: "gemini-embedding-001",

});

module.exports = embeddings;