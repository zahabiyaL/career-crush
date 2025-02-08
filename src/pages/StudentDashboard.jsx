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
} from "lucide-react";

const StudentDashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/student/profile", {
          // Updated endpoint
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfileData(data); // Updated to use direct response as profile data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
                <div className="flex items-center text-brown-500 mb-2">
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
      </div>
    </div>
  );
};

export default StudentDashboard;
