import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    resumeId: {
      type: String,
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    breakdown: {
      hirability: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      professionalism: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
    },
    tips: [{
      type: String,
      required: true,
    }],
    previousScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    implementedSuggestions: [{
      type: String,
    }],
    resumeSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

resumeAnalysisSchema.index({ userId: 1, resumeId: 1 });

const ResumeAnalysis = mongoose.models.ResumeAnalysis || mongoose.model("ResumeAnalysis", resumeAnalysisSchema);

export default ResumeAnalysis;