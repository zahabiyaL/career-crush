import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    recruiterName: { type: String, required: true },
    recruiterEmail: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, default: "company" },
    isProfileComplete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Company", companySchema);
