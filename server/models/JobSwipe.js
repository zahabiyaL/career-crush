import mongoose from "mongoose";

const jobSwipeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    action: {
      type: String,
      enum: ["like", "pass"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a student can only swipe once on each job
jobSwipeSchema.index({ student: 1, job: 1 }, { unique: true });

export default mongoose.model("JobSwipe", jobSwipeSchema);
