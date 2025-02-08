import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

dotenv.config();

console.log("Environment variables loaded:", {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set",
  JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not set",
  CLIENT_URL: process.env.CLIENT_URL,
  PORT: process.env.PORT,
});

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

// Initialize Google OAuth client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5173/api/auth/google/callback"
);

// Temporary in-memory storage (replace with database)
const students = new Map();

// Student signup
app.post("/api/auth/student/signup", async (req, res) => {
  try {
    const { email, password, name, university, major, graduationYear } =
      req.body;

    // Validate input
    if (
      !email ||
      !password ||
      !name ||
      !university ||
      !major ||
      !graduationYear
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if student exists
    if (students.has(email)) {
      return res.status(400).json({ message: "Account already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store student
    students.set(email, {
      name,
      email,
      password: hashedPassword,
      university,
      major,
      graduationYear,
      type: "student",
    });

    // Create token
    const token = jwt.sign(
      { email, name, type: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student login
app.post("/api/auth/student/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if student exists
    const student = students.get(email);
    if (!student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign(
      { email: student.email, name: student.name, type: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Initialize Google OAuth
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

// Google OAuth callback
app.get("/api/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const data = await response.json();

    // Check if student exists
    let student = students.get(data.email);

    if (!student) {
      // Create new student account
      student = {
        email: data.email,
        name: data.name,
        type: "student",
        googleId: data.id,
        // These fields will need to be filled out later
        university: "",
        major: "",
        graduationYear: "",
      };
      students.set(data.email, student);
    }

    // Create token
    const token = jwt.sign(
      { email: student.email, name: student.name, type: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.redirect(`${process.env.CLIENT_URL}/student-signup?error=oauth_failed`);
  }
});

// Middleware to verify JWT token
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

// Protected route example
app.get("/api/student/profile", authenticateToken, (req, res) => {
  const student = students.get(req.user.email);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Don't send password in response
  const { password, ...studentData } = student;
  res.json(studentData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
