import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import multer from "multer";
import Student from "./models/Student.js";
import Profile from "./models/Profile.js";
import Company from "./models/Company.js";
import Job from "./models/Job.js";

dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error("Please upload an image file"));
      }
    } else if (file.fieldname === "resume") {
      if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
        return cb(new Error("Please upload a PDF or Word document"));
      }
    }
    cb(null, true);
  },
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Google OAuth client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.CLIENT_URL}/auth/callback`
);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Student Routes
app.post("/api/auth/student/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, password and name are required" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({
      name,
      email,
      password: hashedPassword,
      isProfileComplete: false,
    });

    await student.save();

    const token = jwt.sign(
      {
        id: student._id,
        email,
        name,
        type: "student",
        isProfileComplete: false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/auth/student/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
        name: student.name,
        type: "student",
        isProfileComplete: student.isProfileComplete,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      isProfileComplete: student.isProfileComplete,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Company Routes
app.post("/api/auth/company/signup", async (req, res) => {
  try {
    const { recruiterName, recruiterEmail, companyName, password } = req.body;

    if (!recruiterEmail || !password || !recruiterName || !companyName) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingCompany = await Company.findOne({ recruiterEmail });
    if (existingCompany) {
      return res.status(400).json({
        message: "Account with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const company = new Company({
      recruiterName,
      recruiterEmail,
      companyName,
      password: hashedPassword,
      isProfileComplete: false,
    });

    await company.save();

    const token = jwt.sign(
      {
        id: company._id,
        email: company.recruiterEmail,
        name: company.recruiterName,
        companyName: company.companyName,
        type: "company",
        isProfileComplete: false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Company signup error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/auth/company/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const company = await Company.findOne({ recruiterEmail: email });
    if (!company) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, company.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: company._id,
        email: company.recruiterEmail,
        name: company.recruiterName,
        companyName: company.companyName,
        type: "company",
        isProfileComplete: company.isProfileComplete,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      userType: "company",
      isProfileComplete: company.isProfileComplete,
    });
  } catch (error) {
    console.error("Company login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Job Routes
app.post("/api/recruiter/jobs", authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== "company") {
      return res.status(403).json({ message: "Not authorized as recruiter" });
    }

    const jobData = {
      ...req.body,
      company: req.user.id,
      status: "published",
      isActive: true,
    };

    // Validate required fields at top level
    const requiredFields = [
      "title",
      "description",
      "location",
      "jobType",
      "workplaceType",
      "salary",
      "experience",
      "skills",
      "education",
    ];

    for (const field of requiredFields) {
      if (!jobData[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Validate nested required fields
    if (!jobData.salary.min || !jobData.salary.max) {
      return res
        .status(400)
        .json({ message: "Salary minimum and maximum are required" });
    }

    if (jobData.salary.min > jobData.salary.max) {
      return res
        .status(400)
        .json({ message: "Minimum salary cannot be greater than maximum" });
    }

    // Validate experience
    if (!jobData.experience || typeof jobData.experience.min !== "number") {
      return res
        .status(400)
        .json({
          message: "Minimum experience is required and must be a number",
        });
    }

    // Set default values for optional nested fields
    jobData.skills = {
      required: jobData.skills.required || [],
      preferred: jobData.skills.preferred || [],
    };

    // Ensure education has required fields
    if (!jobData.education.level) {
      return res.status(400).json({ message: "Education level is required" });
    }

    // Create and save the job
    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      message: "Job posting created successfully",
      job,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      message: "Failed to create job posting",
      error: error.message,
    });
  }
});

app.get("/api/recruiter/jobs", authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== "company") {
      return res.status(403).json({ message: "Not authorized as recruiter" });
    }

    const jobs = await Job.find({ company: req.user.id }).sort({
      createdAt: -1,
    });

    const stats = {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(
        (job) => job.status === "published" && job.isActive
      ).length,
      totalViews: jobs.reduce((sum, job) => sum + job.views, 0),
      totalApplications: jobs.reduce((sum, job) => sum + job.applications, 0),
    };

    res.json({
      jobs,
      stats,
    });
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

app.get("/api/recruiter/jobs/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== "company") {
      return res.status(403).json({ message: "Not authorized as recruiter" });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      company: req.user.id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ job });
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ message: "Error fetching job details" });
  }
});

// Profile Routes
app.get("/api/student/profile", authenticateToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/student/profile/details", authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      isProfileComplete: student.isProfileComplete,
      name: student.name,
      email: student.email,
    });
  } catch (error) {
    console.error("Error checking profile status:", error);
    res.status(500).json({ message: "Error checking profile status" });
  }
});

// View all candidate profiles route
app.get("/api/recruiter/candidates", authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== "company") {
      return res.status(403).json({ message: "Not authorized as recruiter" });
    }

    const profiles = await Profile.find({})
      .populate({
        path: 'userId',
        model: 'Student',
        select: 'name email' // Only get non-sensitive information
      });

    // Transform the data to include only necessary information
    const candidates = profiles.map(profile => ({
      id: profile._id,
      studentName: profile.userId?.name || 'Anonymous',
      studentEmail: profile.userId?.email || 'No email provided',
      basicInfo: profile.basicInfo,
      education: profile.education,
      skills: profile.skills,
      workStyle: profile.workStyle,
      story: profile.story
    }));

    res.json({ candidates });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Error fetching candidates" });
  }
});

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
