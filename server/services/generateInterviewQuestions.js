const { GoogleGenAI } = require("@google/genai");
const { invokeLLM } = require("./groqService");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

function cleanJSON(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function buildPrompt(jobRole, difficultyLevel, numberOfQuestions) {
  return `
You are a Senior Software Engineering Interviewer.

Do not repeat similar questions.
Cover different topics.
Questions should be practical and interview-oriented.

Generate ${numberOfQuestions} interview questions for a ${jobRole} position.

Difficulty: ${difficultyLevel}

Return ONLY valid JSON.

[
  {
    "id": 1,
    "question": "",
    "topic": ""
  }
]
`;
}

async function generateInterviewQuestions(
  jobRole,
  difficultyLevel,
  numberOfQuestions
) {
  const prompt = buildPrompt(
    jobRole,
    difficultyLevel,
    numberOfQuestions
  );

  // =================================
  // 1. Try Gemini
  // =================================

  try {
    console.log("🤖 Generating questions with Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const text = cleanJSON(response.text);

    const questions = JSON.parse(text);

    console.log("✅ Gemini question generation successful");

    return questions;

  } catch (geminiError) {

    console.error(
      "❌ Gemini question generation failed:",
      geminiError.message
    );

    // =================================
    // 2. Fallback → Groq
    // =================================

    try {
      console.log("🔄 Falling back to Groq...");

      const messages = [
        {
          role: "system",
          content: `
You are a Senior Software Engineering Interviewer.

Generate practical and interview-oriented questions.

Do not repeat similar questions.
Cover different technical topics.

Return ONLY valid JSON in this exact format:

[
  {
    "id": 1,
    "question": "",
    "topic": ""
  }
]
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ];

      const groqResponse = await invokeLLM(messages);

      const text = cleanJSON(groqResponse);

      const questions = JSON.parse(text);

      console.log("✅ Groq fallback question generation successful");

      return questions;

    } catch (groqError) {

      console.error(
        "❌ Groq fallback also failed:",
        groqError.message
      );

      throw new Error(
        "Interview question generation failed with both Gemini and Groq."
      );
    }
  }
}

module.exports = {
  generateInterviewQuestions,
};