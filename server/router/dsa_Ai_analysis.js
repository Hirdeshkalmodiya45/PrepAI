const express = require("express");
const router   = express.Router();

const dotenv = require("dotenv");
dotenv.config();

// const langchain = require("langchain");
// const { createAgent, initChatModel }=require("langchain")

// const {groq}= require("langchain/llms/groq");
// const {ollama}= require("langchain/llms/ollama");

// const system = `You are a DSA AI Analysis Assistant. You will be provided with a user's DSA progress data from Leetcode, including the number of problems solved at different difficulty levels and the user's ranking. Your task is to analyze this data and provide insights, suggestions for improvement, and personalized recommendations for the user to enhance their DSA skills.`;

// const agent=createAgent({
//     model : initChatModel({
//         // // model: new groq({
//         // //     apiKey: process.env.GROQ_API_KEY,
//         //  }),
//         model: new ollama({
//             apiKey: process.env.NIMBLE_API_KEY,
//             model: "minimax-m3:cloud"
//         }),
//     }),
//     systemPrompt: system,
//     tools: [],
//     memory: new langchain.memory.BufferMemory(),
// });

const { analyzeDSAProgress } = require("../services/aiservice");

const { analyzeDSA } = require("../services/aiservice");
const profile = {
  username: "Hirdeshkalmodiya20",
  totalSolved: 408,
  easySolved: 116,
  mediumSolved: 222,
  hardSolved: 70,
  ranking: 294882
};
router.post("/dsa-analysis", async (req, res) => {
                           
   const result = await analyzeDSA(profile);
const analysis = await analyzeDSA(profile);
 
res.json({
    success: true,
    data: analysis
});
});
module.exports = router;


