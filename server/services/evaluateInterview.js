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

function buildPrompt({ role, difficulty, answers }) {
  return `
You are a Senior Technical Interviewer.

Role: ${role}

Difficulty: ${difficulty}

Evaluate every answer carefully.

Return ONLY valid JSON.

{
  "score": 85,
  "feedback": {
    "summary": "",
    "strengths": [],
    "improvements": [],
    "perQuestion": [
      {
        "questionId": 1,
        "score": 80,
        "comment": ""
      }
    ]
  }
}

Interview Answers:

${JSON.stringify(answers, null, 2)}
`;
}

async function evaluateInterview({ role, difficulty, answers }) {

  const prompt = buildPrompt({
    role,
    difficulty,
    answers,
  });

  // =========================
  // 1. Try Gemini
  // =========================

  try {

    console.log("🤖 Evaluating interview with Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const text = cleanJSON(response.text);

    const result = JSON.parse(text);

    console.log("✅ Gemini evaluation successful");

    return result;

  } catch (geminiError) {

    console.error(
      "❌ Gemini evaluation failed:",
      geminiError.message
    );

    // =========================
    // 2. Fallback → Groq
    // =========================

    try {

      console.log("🔄 Falling back to Groq...");

      const messages = [
        {
          role: "system",
          content: `
You are a Senior Technical Interviewer.

Evaluate interview answers.

Return ONLY valid JSON using exactly this structure:

{
  "score": 85,
  "feedback": {
    "summary": "",
    "strengths": [],
    "improvements": [],
    "perQuestion": [
      {
        "questionId": 1,
        "score": 80,
        "comment": ""
      }
    ]
  }
}
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ];

      const groqResponse = await invokeLLM(messages);

      const text = cleanJSON(groqResponse);

      const result = JSON.parse(text);

      console.log("✅ Groq fallback successful");

      return result;

    } catch (groqError) {

      console.error(
        "❌ Groq fallback also failed:",
        groqError.message
      );

      throw new Error(
        "Interview evaluation failed with both Gemini and Groq."
      );
    }
  }
}

module.exports = {
  evaluateInterview,
};