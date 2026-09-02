const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    id: Number,
    question: String,
    topic: String,
});

const interviewQuestionSchema = new mongoose.Schema({

    role: {
        type: String,
        required: true,
    },

    difficulty: {
        type: String,
        required: true,
    },

    setNumber: {
        type: Number,
        required: true,
    },

    totalQuestions: {
        type: Number,
        default: 10,
    },

    questions: [questionSchema],

}, {
    timestamps: true,
});

module.exports = mongoose.model(
    "InterviewQuestion",
    interviewQuestionSchema
);