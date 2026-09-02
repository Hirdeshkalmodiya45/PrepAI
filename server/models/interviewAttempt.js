const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({

    questionId: Number,

    question: String,

    answer: String,

});

const interviewAttemptSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

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

    answers: [answerSchema],

    score: {
        type: Number,
        default: 0,
    },

    feedback: {
        type: Object,
        default: {},
    },

    completed: {
        type: Boolean,
        default: false,
    },
    questionBankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InterviewQuestion",
}

},
 {
    timestamps: true,
}
);

module.exports = mongoose.model(
    "InterviewAttempt",
    interviewAttemptSchema
);