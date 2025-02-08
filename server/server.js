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

// Student signup
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

// Student login
app.post("/api/auth/student/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if profile exists
    const profile = await Profile.findOne({ userId: student._id });
    const isProfileComplete = profile ? true : false;

    // Update profile completion status if needed
    if (student.isProfileComplete !== isProfileComplete) {
      student.isProfileComplete = isProfileComplete;
      await student.save();
    }

    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
        name: student.name,
        type: "student",
        isProfileComplete,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Google OAuth routes
app.get("/api/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  res.redirect(url);
});

app.get("/api/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    const googleData = await response.json();

    let student = await Student.findOne({ email: googleData.email });

    if (!student) {
      student = new Student({
        email: googleData.email,
        name: googleData.name,
        type: "student",
        googleId: googleData.id,
        password: await bcrypt.hash(Math.random().toString(36), 10),
        isProfileComplete: false,
      });
      await student.save();
    }

    // Check if profile exists
    const profile = await Profile.findOne({ userId: student._id });
    const isProfileComplete = profile ? true : false;

    if (student.isProfileComplete !== isProfileComplete) {
      student.isProfileComplete = isProfileComplete;
      await student.save();
    }

    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
        name: student.name,
        type: "student",
        isProfileComplete,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.redirect(`${process.env.CLIENT_URL}/student-signup?error=oauth_failed`);
  }
});

// Profile routes
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

app.post(
  "/api/student/profile",
  authenticateToken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const profileData = JSON.parse(req.body.profileData);

      // Handle file uploads
      if (req.files) {
        // Update avatar path if uploaded
        if (req.files.avatar && req.files.avatar[0]) {
          profileData.basicInfo.avatar = `/uploads/${req.files.avatar[0].filename}`;
        }

        // Update resume path if uploaded
        if (req.files.resume && req.files.resume[0]) {
          profileData.resume = `/uploads/${req.files.resume[0].filename}`;
        }
      }

      let profile = await Profile.findOne({ userId: req.user.id });

      if (profile) {
        // If updating existing profile, handle old files
        if (req.files.avatar && profile.basicInfo.avatar) {
          // Delete old avatar file
          try {
            fs.unlinkSync(path.join(process.cwd(), profile.basicInfo.avatar));
          } catch (err) {
            console.error("Error deleting old avatar:", err);
          }
        }

        if (req.files.resume && profile.resume) {
          // Delete old resume file
          try {
            fs.unlinkSync(path.join(process.cwd(), profile.resume));
          } catch (err) {
            console.error("Error deleting old resume:", err);
          }
        }
      }

      // Update or create profile
      profile = await Profile.findOneAndUpdate(
        { userId: req.user.id },
        {
          ...profileData,
          userId: req.user.id,
          lastUpdated: Date.now(),
        },
        { upsert: true, new: true }
      );

      // Update student's profile completion status
      await Student.findByIdAndUpdate(req.user.id, {
        isProfileComplete: true,
      });

      const token = jwt.sign(
        {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          type: "student",
          isProfileComplete: true,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Profile updated successfully",
        profile,
        token,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  }
);

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
