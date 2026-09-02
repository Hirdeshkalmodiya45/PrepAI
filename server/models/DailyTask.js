const mongoose = require("mongoose");

const dailyTaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "DSA",
        "APTITUDE",
        "INTERVIEW",
        "RESUME",
        "GENERAL",
      ],
      default: "GENERAL",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    taskDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DailyTask", dailyTaskSchema);