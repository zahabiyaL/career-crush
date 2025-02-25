import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CompanySignUp from "./pages/CompanySignUp";
import StudentSignUp from "./pages/StudentSignUp";
import Home from "./components/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import AuthCallback from "./components/AuthCallback";
import AboutSection from "./components/About";
import Features from "./pages/Features";
import StudentDashboard from "./pages/StudentDashboard";
import ProfileSetup from "./pages/ProfileSetup";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateJob from "./pages/CreateJob";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/student/profile/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setHasProfile(data.isProfileComplete);
        } else {
          // If token is invalid or expired
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setHasProfile(false);
        }
      } catch (error) {
        console.error("Error checking auth/profile:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setHasProfile(false);
      }

      setLoading(false);
    };

    checkAuthAndProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return (
    <Router>
      <div className="main-container bg-main">
        <Navbar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/company-signup" element={<CompanySignUp />} />
          <Route
            path="/student-signup"
            element={
              <StudentSignUp
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/student/dashboard"
            element={
              isAuthenticated ? (
                hasProfile ? (
                  <StudentDashboard />
                ) : (
                  <Navigate to="/profile-setup" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile-setup"
            element={
              isAuthenticated ? (
                hasProfile ? (
                  <Navigate to="/student/dashboard" />
                ) : (
                  <ProfileSetup
                    isAuthenticated={isAuthenticated}
                    setHasProfile={setHasProfile}
                  />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/auth/callback"
            element={<AuthCallback setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                localStorage.getItem("userType") === "recruiter" ? (
                  <Navigate to="/recruiter/dashboard" />
                ) : hasProfile ? (
                  <Navigate to="/student/dashboard" />
                ) : (
                  <Navigate to="/profile-setup" />
                )
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route path="/features" element={<Features />} />
          <Route
            path="/recruiter/jobs/new"
            element={
              localStorage.getItem("userType") === "recruiter" ? (
                <CreateJob />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
