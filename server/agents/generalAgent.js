const generalPrompt = require("../prompts/generalPrompt");

const { invokeLLM } = require("../services/groqService");
const memory=require("../memory/memoryManager")

const {
    getOrCreateConversation,
    getHistory,
    saveMessage,
} = require("../memory/memoryManager");

async function generalAgent(userId, message) {

    // Get Conversation
    const conversation = await getOrCreateConversation(
        userId,
        "general"
    );

    // Load History
    const history = await getHistory(conversation._id);

    // Build Messages
    const messages = [

        {
            role: "system",
            content: generalPrompt,
        },

        ...history.map((msg) => ({
            role: msg.role,
            content: msg.content,
        })),

        {
            role: "user",
            content: message,
        },

    ];

    // Save User Message
    await saveMessage(
        conversation._id,
        "user",
        message
    );

    // LLM Call
    const aiReply = await invokeLLM(messages);

    // Save AI Reply
    await saveMessage(
        conversation._id,
        "assistant",
        aiReply
    );

    return aiReply;
}


module.exports = generalAgent;