import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, default: "student" },
    isProfileComplete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Student", studentSchema);
