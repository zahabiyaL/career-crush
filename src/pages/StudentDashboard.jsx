import React, { useState, useEffect } from "react";
import {
  Award,
  BookOpen,
  User,
  MapPin,
  Code,
  Languages,
  Coffee,
  Heart,
  Briefcase,
  Building,
  CreditCard,
  X,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// JobCard Component
const JobCard = ({ job, onSwipe, index, active }) => {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cardRef = React.useRef(null);

  const handleDragStart = (event, info) => {
    setDragStart({ x: info.point.x, y: info.point.y });
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100;
    const deltaX = info.point.x - dragStart.x;

    if (Math.abs(deltaX) > swipeThreshold) {
      onSwipe(deltaX > 0 ? "right" : "left", job);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`absolute w-full ${active ? "z-10" : "pointer-events-none"}`}
      initial={{ scale: 0.95, translateX: "100%" }}
      animate={{ scale: 1, translateX: 0 }}
      exit={{ scale: 0.95, translateX: "-100%" }}
      transition={{ duration: 0.3 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ touchAction: "none" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 m-4">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
          <div className="flex items-center text-gray-600 mt-1">
            <Building className="w-4 h-4 mr-1" />
            <span className="text-sm">{job.companyName}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{job.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Briefcase className="w-4 h-4 mr-2" />
            <span>
              {job.jobType} · {job.workplaceType}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <CreditCard className="w-4 h-4 mr-2" />
            <span>{job.salaryRange}</span>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Required Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.required.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <div className="flex items-center text-red-500">
            <X className="w-8 h-8" />
            <span className="ml-1">Swipe Left to Pass</span>
          </div>
          <div className="flex items-center text-green-500">
            <span className="mr-1">Swipe Right to Like</span>
            <Check className="w-8 h-8" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// JobDiscovery Component
const JobDiscovery = ({ onClose }) => {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data.jobs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSwipe = async (direction, job) => {
    try {
      await fetch("/api/jobs/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          jobId: job._id,
          action: direction === "right" ? "like" : "pass",
        }),
      });

      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      console.error("Error recording swipe:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <div className="text-xl">Loading jobs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <div className="text-red-500">Error: {error}</div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-100 w-full max-w-lg rounded-lg h-[80vh] relative overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Discover Jobs</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative h-[calc(100%-4rem)] w-full">
          <AnimatePresence>
            {currentIndex < jobs.length ? (
              <JobCard
                key={jobs[currentIndex]._id}
                job={jobs[currentIndex]}
                onSwipe={handleSwipe}
                index={currentIndex}
                active={true}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">No more jobs!</h3>
                  <p className="text-gray-600">
                    Check back later for new opportunities
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Main StudentDashboard Component
const StudentDashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJobDiscovery, setShowJobDiscovery] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/student/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfileData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleResetSwipes = async () => {
    if (
      !confirm(
        "Are you sure you want to reset all your job swipes? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsResetting(true);
      const response = await fetch("/api/jobs/swipes/reset", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to reset swipes");
      }

      // If JobDiscovery is open, close it and reopen to refresh
      if (showJobDiscovery) {
        setShowJobDiscovery(false);
        setTimeout(() => setShowJobDiscovery(true), 100);
      }

      alert("Successfully reset all job swipes!");
    } catch (error) {
      console.error("Error resetting swipes:", error);
      alert("Failed to reset swipes. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-glook">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-main">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Job Discovery Button */}
        <div className="flex justify-end">
          <div className="flex justify-end gap-4">
            {/* <button
              onClick={handleResetSwipes}
              disabled={isResetting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isResetting ? "Resetting..." : "Reset All Swipes"}
            </button> */}
          </div>
          <button
            onClick={() => setShowJobDiscovery(true)}
            className="btn flex items-center gap-2"
          >
            <Briefcase className="w-5 h-5" />
            Discover Jobs
          </button>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {profileData.basicInfo.avatar ? (
              <img
                src={profileData.basicInfo.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-glook">
              {profileData.basicInfo.fullName}
            </h1>
            <p className="text-gray-600">{profileData.basicInfo.title}</p>
            <div className="flex items-center mt-2 text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              {profileData.basicInfo.location}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Story Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-glook mb-4">Your Story</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center text-yellow-500 mb-2">
                  <Award className="w-5 h-5 mr-2" />
                  <h3 className="font-glook">Proudest Achievement</h3>
                </div>
                <p className="text-gray-600">
                  {profileData.story.proudestAchievement}
                </p>
              </div>
              <div>
                <div className="flex items-center text-green-500 mb-2">
                  <BookOpen className="w-5 h-5 mr-2" />
                  <h3 className="font-glook">Currently Learning</h3>
                </div>
                <p className="text-gray-600">
                  {profileData.story.currentLearning}
                </p>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-glook mb-4">Skills & Expertise</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center text-blue-500 mb-2">
                  <Code className="w-5 h-5 mr-2" />
                  <h3 className="font-glook">Technical Skills</h3>
                </div>
                <p className="text-gray-600">{profileData.skills.technical}</p>
              </div>
              <div>
                <div className="flex items-center text-purple-500 mb-2">
                  <Languages className="w-5 h-5 mr-2" />
                  <h3 className="font-glook">Languages</h3>
                </div>
                <p className="text-gray-600">{profileData.skills.languages}</p>
              </div>
            </div>
          </div>

          {/* Work Style Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-glook mb-4">Work Style</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center text-[#5267DF] mb-2">
                  <Coffee className="w-5 h-5 mr-2" />
                  <h3 className="font-glook">Preferred Hours</h3>
                </div>
                <p className="text-gray-600">
                  {profileData.workStyle.preferredHours}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  {profileData.workStyle.workEnvironment}
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-glook mb-4">Values & Goals</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center text-red-500 mb-2">
                  <Heart className="w-5 h-5 mr-2" />
                  <h3 className="font-glook">Core Values</h3>
                </div>
                <p className="text-gray-600">{profileData.values.coreValues}</p>
              </div>
              <div>
                <p className="text-gray-600">{profileData.values.goals}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Discovery Modal */}
        {showJobDiscovery && (
          <JobDiscovery onClose={() => setShowJobDiscovery(false)} />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
