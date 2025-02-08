import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CompanySignUp from "./pages/CompanySignUp";
import StudentSignUp from "./pages/StudentSignUp";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import AuthCallback from "./components/AuthCallback";
import StudentDashboard from "./pages/StudentDashboard";
import Features from "./pages/Features";

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

      setIsAuthenticated(true);

      try {
        const response = await fetch("/api/student/profile/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHasProfile(response.ok);
      } catch (error) {
        console.error("Error checking profile:", error);
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
                <ProfileSetup
                  isAuthenticated={isAuthenticated}
                  setHasProfile={setHasProfile}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/auth/callback"
            element={<AuthCallback setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                hasProfile ? (
                  <Navigate to="/student/dashboard" />
                ) : (
                  <Navigate to="/profile-setup" />
                )
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
