import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    basicInfo: {
      fullName: { type: String, default: "" },
      title: { type: String, default: "" },
      location: { type: String, default: "" },
      avatar: { type: String, default: "" },
    },
    story: {
      proudestAchievement: { type: String, default: "" },
      currentLearning: { type: String, default: "" },
      teamSpirit: { type: String, default: "" },
    },
    education: {
      university: { type: String, default: "" },
      degree: { type: String, default: "" },
      graduationYear: { type: String, default: "" },
      gpa: { type: String, default: "" },
    },
    skills: {
      technical: { type: [String], default: [] },
      soft: { type: [String], default: [] },
      languages: { type: [String], default: [] },
    },
    workStyle: {
      preferredHours: { type: String, default: "" },
      workEnvironment: { type: String, default: "" },
      communicationStyle: { type: String, default: "" },
    },
    values: {
      coreValues: { type: [String], default: [] },
      interests: { type: [String], default: [] },
      goals: { type: [String], default: [] },
    },
    resume: { type: String, default: "" },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", profileSchema);
