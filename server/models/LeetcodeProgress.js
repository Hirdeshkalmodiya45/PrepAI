const mongoose = require("mongoose");

const leetcodeProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    totalSolved: {
        type: Number,
        default: 0
    },

    easySolved: {
        type: Number,
        default: 0
    },

    mediumSolved: {
        type: Number,
        default: 0
    },

    hardSolved: {
        type: Number,
        default: 0
    },

    ranking: {
        type: Number,
        default: 0
    },

    lastSynced: {
        type: Date,
        default: Date.now
    },
    aiAnalysis: {
  strongest: {
    type: String,
    default: "",
  },
  weakest: {
    type: String,
    default: "",
  },
  recommended: {
    type: [String],
    default: [],
  },
  dailyRecommendation: {
    type: String,
    default: "",
  },
  weeklyGoal: {
    type: String,
    default: "",
  },
  readiness: {
    label: {
      type: String,
      default: "",
    },
    percent: {
      type: Number,
      default: 0,
    },
  },
},
});

module.exports = mongoose.model(
    "LeetcodeProgress",
    leetcodeProgressSchema
);