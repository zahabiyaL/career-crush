import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Target,
  Clock,
  MapPin,
  Star,
  Coffee,
  Users,
  Code,
  Zap,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

const Card = ({ children, className = "", onClick = null }) => (
  <div
    className={`bg-white rounded-lg shadow-lg ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const Badge = ({ children, className = "" }) => (
  <span className={`px-2 py-1 rounded-full text-sm font-medium ${className}`}>
    {children}
  </span>
);

const CandidatesList = ({ isOpen, onClose }) => {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("/api/recruiter/candidates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch candidates");
      }

      const data = await response.json();
      setCandidates(data.candidates);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCandidates();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setSelectedStory(null);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(candidates.length - 1, prev + 1));
    setSelectedStory(null);
  };

  const currentCandidate = candidates[currentIndex];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg max-w-md">
          <div className="flex items-center gap-2 text-red-500 mb-4">
            <AlertCircle />
            <h3 className="font-semibold">Error</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCandidates}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentCandidate) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg">
          <p className="text-gray-600">No candidates available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 w-full max-w-3xl">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-10 text-white hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="relative">
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-12 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentIndex < candidates.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-12 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div className="space-y-6">
            {/* Top Banner */}
            <div className="relative h-64 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-30" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white p-1">
                    <img
                      src="/api/placeholder/80/80"
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">
                      {currentCandidate.studentName}
                    </h1>
                    <p className="text-lg opacity-90">
                      {currentCandidate.basicInfo?.title ||
                        "Product Designer & Developer"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Connect Section */}
            <div className="flex gap-4">
              <button className="flex-1 bg-purple-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors">
                <MessageSquare className="w-5 h-5" />
                Quick Chat
              </button>
              <button className="flex-1 border border-purple-500 text-purple-500 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors">
                <Star className="w-5 h-5" />
                Save Profile
              </button>
            </div>

            {/* Match Highlights */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-xl font-semibold">Why We Match</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Education</p>
                      <p className="text-sm text-gray-600">
                        {currentCandidate.education?.degree ||
                          "Degree not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Availability</p>
                      <p className="text-sm text-gray-600">Ready to start</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-gray-600">
                        {currentCandidate.basicInfo?.location ||
                          "Location not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Team Fit</p>
                      <p className="text-sm text-gray-600">
                        {currentCandidate.workStyle?.communicationStyle ||
                          "Collaborative & mentor"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Career Stories */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold">Career Stories</h2>
              </div>

              <div className="grid gap-4">
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedStory === "proud" ? "ring-2 ring-purple-500" : ""
                  }`}
                  onClick={() => setSelectedStory("proud")}
                >
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">
                      Proudest Achievement
                    </h3>
                    <p className="text-gray-600">
                      {currentCandidate.story?.proudestAchievement ||
                        "No achievement story provided"}
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Skills & Interests */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Code className="w-5 h-5 text-purple-500" />
                  <h2 className="text-xl font-semibold">Skills & Interests</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentCandidate.skills?.technical?.map((skill, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Work Style */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Coffee className="w-5 h-5 text-purple-500" />
                  <h2 className="text-xl font-semibold">Work Style</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">How I Thrive</h3>
                    <p className="text-gray-600">
                      {currentCandidate.workStyle?.preferredHours ||
                        "Work style preferences not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">What I Value</h3>
                    <p className="text-gray-600">
                      {currentCandidate.workStyle?.workEnvironment ||
                        "Values not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="text-center text-white mt-4">
          {currentIndex + 1} of {candidates.length} candidates
        </div>
      </div>
    </div>
  );
};

export default CandidatesList;
