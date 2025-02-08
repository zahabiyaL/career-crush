import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthCallback = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      try {
        // Decode token to check user type and profile status
        const decoded = jwtDecode(token);

        // Store token and authentication state
        localStorage.setItem("token", token);
        localStorage.setItem("userType", decoded.type); // Make sure your token includes user type
        setIsAuthenticated(true);

        // Handle navigation based on user type
        if (decoded.type === "company") {
          navigate("/recruiter/dashboard");
        } else {
          // For students, check profile completion
          if (!decoded.isProfileComplete) {
            navigate("/profile-setup");
          } else {
            navigate("/student/dashboard");
          }
        }
      } catch (error) {
        console.error("Error processing authentication:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [location, navigate, setIsAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Completing sign in...</h2>
        <p className="text-gray-500">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
