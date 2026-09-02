const dsaPrompt=require("../prompts/dsaPrompt");
const {invokeLLM}=require("../services/groqService.js");
const {getLeetcodeProfile}=require("../tool/leetcodeTool");

const {
    getOrCreateConversation,
    getHistory,
    saveMessage,
} = require("../memory/memoryManager");

async function dsaAgent(userId,message){
const conversation=await getOrCreateConversation(
    userId,
    "dsa"
)


//memory
const history=await getHistory(conversation._id);
 const profile =
        await getLeetcodeProfile(userId);

            const userContext = profile
        ? `
Leetcode Progress

Total Solved : ${profile.totalSolved}

Easy : ${profile.easySolved}

Medium : ${profile.mediumSolved}

Hard : ${profile.hardSolved}

Ranking : ${profile.ranking}

AI Analysis

Strongest :

${profile.aiAnalysis?.strongest}

Weakest :

${profile.aiAnalysis?.weakest}

Readiness :

${profile.aiAnalysis?.readiness?.label}

Recommended :

${profile.aiAnalysis?.recommended?.join(", ")}
`
        : "No Leetcode profile available.";


  const messages=[
    {
        role:"system",
        content: dsaPrompt,

    },

    {
      role: "system",
     content: userContext,
    },
    ...history.map((msg)=>({
              role: msg.role,
            content: msg.content,
    })),
       {
            role: "user",
            content: message,
        },
  ]    
      await saveMessage(
        conversation._id,
        "user",
        message
    );  
        const aiReply =
        await invokeLLM(messages);

    // Save AI
    await saveMessage(
        conversation._id,
        "assistant",
        aiReply
    );

    return aiReply;
}
module.exports = dsaAgent;