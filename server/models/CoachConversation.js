const mongoose = require("mongoose");

const coachConversationSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    coach: {
        type: String,
        enum: ["general", "dsa", "gate", "resume", "task"],
        required: true,
    },

    title: {
        type: String,
        default: "",
    }

}, {
    timestamps: true,
});

module.exports = mongoose.model(
    "CoachConversation",
    coachConversationSchema
);