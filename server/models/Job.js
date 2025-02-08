import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    // Company/Recruiter Reference
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // Basic Job Information
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Job Type and Work Setup
    jobType: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "contract", "internship", "temporary"],
    },
    workplaceType: {
      type: String,
      required: true,
      enum: ["on-site", "hybrid", "remote"],
    },

    // Compensation
    salary: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "USD",
      },
      period: {
        type: String,
        enum: ["hourly", "monthly", "yearly"],
        default: "yearly",
      },
    },
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],

    // Requirements
    experience: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
      },
      preferred: {
        type: Number,
      },
    },
    skills: {
      required: [
        {
          type: String,
          trim: true,
        },
      ],
      preferred: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    education: {
      level: {
        type: String,
        enum: ["high-school", "bachelor", "master", "phd", "other"],
        required: true,
      },
      field: String,
    },

    // Additional Information
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    qualifications: [
      {
        type: String,
        trim: true,
      },
    ],

    // Application Details
    applicationDeadline: {
      type: Date,
    },
    applicationUrl: {
      type: String,
      trim: true,
    },
    applicationEmail: {
      type: String,
      trim: true,
    },

    // Job Status
    status: {
      type: String,
      enum: ["draft", "published", "closed", "filled"],
      default: "draft",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Tracking
    views: {
      type: Number,
      default: 0,
    },
    applications: {
      type: Number,
      default: 0,
    },

    // Additional Metadata
    department: {
      type: String,
      trim: true,
    },
    teamSize: {
      type: Number,
    },
    industry: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,

    // Add a virtual field for formatted salary range
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted salary range
jobSchema.virtual("salaryRange").get(function () {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: this.salary.currency,
  });

  return `${formatter.format(
    this.salary.min
  )} - ${formatter.format(this.salary.max)} per ${this.salary.period}`;
});

// Index for better search performance
jobSchema.index({
  title: "text",
  description: "text",
  "skills.required": "text",
  location: "text",
});

// Methods
jobSchema.methods.incrementViews = async function () {
  this.views += 1;
  return this.save();
};

jobSchema.methods.incrementApplications = async function () {
  this.applications += 1;
  return this.save();
};

// Statics for common queries
jobSchema.statics.findActive = function () {
  return this.find({
    status: "published",
    isActive: true,
    applicationDeadline: { $gt: new Date() },
  });
};

jobSchema.statics.findByCompany = function (companyId) {
  return this.find({ company: companyId }).sort({ createdAt: -1 });
};

export default mongoose.model("Job", jobSchema);
