const CoachConversation = require("../models/CoachConversation");
const CoachMessage = require("../models/CoachMessage");

/**
 * Create or get conversation
 */
async function getOrCreateConversation(userId, coach) {
    let conversation = await CoachConversation.findOne({
        user: userId,
        coach,
    });

    if (!conversation) {
        conversation = await CoachConversation.create({
            user: userId,
            coach,
            title: `${coach.toUpperCase()} Coach`,
        });
    }

    return conversation;
}

/**
 * Save message
 */
async function saveMessage(conversationId, role, content) {
    return await CoachMessage.create({
        conversation: conversationId,
        role,
        content,
    });
}

/**
 * Get chat history
 */
async function getHistory(conversationId, limit = 5) {
    const messages = await CoachMessage.find({
        conversation: conversationId,
    })
        .sort({ createdAt: 1 })
        .limit(limit);

    return messages;
}

/**
 * Delete conversation history
 */
async function clearHistory(conversationId) {
    await CoachMessage.deleteMany({
        conversation: conversationId,
    });
}

module.exports = {
    getOrCreateConversation,
    saveMessage,
    getHistory,
    clearHistory,
};