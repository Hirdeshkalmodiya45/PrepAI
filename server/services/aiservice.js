const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

async function analyzeDSA(profile) {

  const prompt = `
Analyze this LeetCode profile.

Username: ${profile.username}

Total Solved: ${profile.totalSolved}

Easy: ${profile.easySolved}

Medium: ${profile.mediumSolved}

Hard: ${profile.hardSolved}

Ranking: ${profile.ranking}

Return only JSON.
Return ONLY valid JSON.

{
  "strongest": "",
  "weakest": "",
  "recommended": [],
  "dailyRecommendation": "",
  "weeklyGoal": "",
  "readiness": {
      "label": "",
      "percent": 0
  }
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

const text = response.text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const analysis = JSON.parse(text);
return analysis;
}

module.exports = {
  analyzeDSA,
};