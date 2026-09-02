const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    atsScore: {
      type: Number,
      default: 0,
    },

    placementReadiness: {
      type: Number,
      default: 0,
    },

    summary: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    missingTechnicalSkills: {
      type: [String],
      default: [],
    },

    missingSoftSkills: {
      type: [String],
      default: [],
    },

    projectSuggestions: {
      type: [String],
      default: [],
    },

    experienceSuggestions: {
      type: [String],
      default: [],
    },

    formattingIssues: {
      type: [String],
      default: [],
    },

    grammarIssues: {
      type: [String],
      default: [],
    },

    actionVerbSuggestions: {
      type: [String],
      default: [],
    },

    recommendedTechnologies: {
      type: [String],
      default: [],
    },

    recommendedRoles: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ResumeAnalysis",
  resumeAnalysisSchema
);