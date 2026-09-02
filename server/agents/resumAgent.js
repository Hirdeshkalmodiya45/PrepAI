const resumePromt = require("../prompts/resumePrompt");
const resumeAnalysisPrompt = require("../prompts/resumeAnPrompt");
const ResumeAnalysis = require("../models/ResumeAnalysis");

const { invokeLLM} = require("../services/groqService");

const {
  getOrCreateConversation,
  getHistory,
  saveMessage,
} = require("../memory/memoryManager");

const {
  getResumeContext,
} = require("../services/resumeRetriever");


async function resumeAgent(userId, message) {

  const conversation = await getOrCreateConversation(
    userId,
    "resume"
  );

  const history = await getHistory(
    conversation._id
  );

  const resumeContext = await getResumeContext(
    userId,
    message
  );

  // =========================
  // SELECT PROMPT
  // =========================

  let systemPrompt = resumePromt;

  if (message === "RESUME_ANALYSIS") {
    systemPrompt = resumeAnalysisPrompt;
  }

  // =========================
  // LLM MESSAGES
  // =========================

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },

    {
      role: "system",
      content:
        resumeContext ||
        "User has not uploaded a resume yet.",
    },

  
    {
      role: "user",
      content: message,
    },
  ];

  // =========================
  // CALL LLM
  // =========================

  const aiReply = await invokeLLM(messages);


  // ==================================================
  // NORMAL RESUME CHAT
  // ==================================================

  if (message !== "RESUME_ANALYSIS") {

    await saveMessage(
      conversation._id,
      "user",
      message
    );

    await saveMessage(
      conversation._id,
      "assistant",
      aiReply
    );

    return aiReply;
  }


  // ==================================================
  // RESUME ANALYSIS
  // ==================================================

  try {

    let cleaned = aiReply
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(cleaned);


    // =========================
    // SAVE ANALYSIS
    // =========================

    await ResumeAnalysis.findOneAndUpdate(
      {
        user: userId,
      },
      {
        user: userId,
        ...analysis,
      },
      {
        upsert: true,
        new: true,
      }
    );


    console.log(
      "✅ Resume analysis saved successfully"
    );


    // Analysis database me save ho chuka hai
    return aiReply;

  } catch (err) {

    console.error(
      "❌ Invalid JSON from LLM:"
    );

    console.error(aiReply);

    throw new Error(
      "Resume analysis response is not valid JSON."
    );
  }
}


module.exports = resumeAgent;