import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, GraduationCap } from "lucide-react";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Use different endpoints based on user type
      const endpoint =
        userType === "student"
          ? "/api/auth/student/login"
          : "/api/auth/company/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Failed to parse response:", e);
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.token) {
        throw new Error("No authentication token received");
      }

      // Store authentication info
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", userType);
      setIsAuthenticated(true);

      if (userType === "recruiter") {
        console.log("Recruiter login - navigating to recruiter dashboard");
        return navigate("/recruiter/dashboard");
      }

      // Only check profile completion for students
      if (userType === "student") {
        console.log("Student login - checking profile completion");
        const tokenPayload = JSON.parse(atob(data.token.split(".")[1]));
        if (tokenPayload.isProfileComplete) {
          navigate("/student/dashboard");
        } else {
          navigate("/profile-setup");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleLogin = () => {
    const endpoint =
      userType === "student"
        ? "/api/auth/google/student"
        : "/api/auth/google/company";
    window.location.href = endpoint;
  };

  return (
    <div className="min-h-screen bg-main flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Sign in to your account
        </h2>

        {/* Toggle Switch */}
        <div className="mt-4 flex justify-center">
          <div className="bg-white p-1 rounded-lg flex">
            <button
              type="button"
              onClick={() => setUserType("student")}
              className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                userType === "student"
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setUserType("recruiter")}
              className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                userType === "recruiter"
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Recruiter
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-sm text-gray-300">
          Or{" "}
          <Link
            to={userType === "student" ? "/student-signup" : "/company-signup"}
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cc-dblue focus:border-cc-dblue sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cc-dblue focus:border-cc-dblue sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              {userType === "student" ? (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  {isLoading ? "Signing in..." : "Sign in as Student"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  {isLoading ? "Signing in..." : "Sign in as Recruiter"}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cc-dblue disabled:opacity-50"
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google logo"
                />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
