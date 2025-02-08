import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Award, BookOpen, Users, Coffee, Upload } from "lucide-react";

const ProfileSetup = ({ isAuthenticated, setHasProfile }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [fileNames, setFileNames] = useState({
    avatar: "",
    resume: "",
  });
  const [formData, setFormData] = useState({
    basicInfo: {
      fullName: "",
      title: "",
      location: "",
      avatar: null,
    },
    story: {
      proudestAchievement: "",
      currentLearning: "",
      teamSpirit: "",
    },
    education: {
      university: "",
      degree: "",
      graduationYear: "",
      gpa: "",
    },
    skills: {
      technical: "",
      soft: "",
      languages: "",
    },
    workStyle: {
      preferredHours: "",
      workEnvironment: "",
      communicationStyle: "",
    },
    values: {
      coreValues: "",
      interests: "",
      goals: "",
    },
    resume: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/student-signup");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/student/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData((prevData) => ({
            ...prevData,
            ...data,
          }));

          // If there are existing files, update the file names
          if (data?.basicInfo?.avatar) {
            setFileNames((prev) => ({
              ...prev,
              avatar: "Current Profile Picture",
            }));
            setAvatarPreview(data.basicInfo.avatar);
          }
          if (data?.resume) {
            setFileNames((prev) => ({
              ...prev,
              resume: "Current Resume",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Convert data to the format expected by the server
      const profileDataToSend = {
        basicInfo: {
          fullName: formData.basicInfo.fullName,
          title: formData.basicInfo.title,
          location: formData.basicInfo.location,
          // Don't include the file in JSON
          avatar: null,
        },
        story: formData.story,
        education: formData.education,
        skills: formData.skills,
        workStyle: formData.workStyle,
        values: formData.values,
      };

      // Add JSON data
      formDataToSend.append("profileData", JSON.stringify(profileDataToSend));

      // Add files if they exist
      if (formData.basicInfo.avatar instanceof File) {
        formDataToSend.append("avatar", formData.basicInfo.avatar);
      }

      if (formData.resume instanceof File) {
        formDataToSend.append("resume", formData.resume);
      }

      const response = await fetch("/api/student/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Remove Content-Type header to let browser set it with boundary for FormData
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();

      // Update the token if a new one was returned
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setHasProfile(true);
      navigate("/student/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message || "Error updating profile. Please try again.");
    }
  };

  // Update handleFileUpload function
  const handleFileUpload = useCallback(
    (event, type) => {
      const file = event.target.files[0];
      if (file) {
        if (type === "avatar") {
          if (avatarPreview && avatarPreview.startsWith("blob:")) {
            URL.revokeObjectURL(avatarPreview);
          }
          const previewUrl = URL.createObjectURL(file);
          setAvatarPreview(previewUrl);
          setFormData((prev) => ({
            ...prev,
            basicInfo: {
              ...prev.basicInfo,
              avatar: file, // Store the actual file
            },
          }));
          setFileNames((prev) => ({
            ...prev,
            avatar: file.name,
          }));
        } else if (type === "resume") {
          setFormData((prev) => ({
            ...prev,
            resume: file, // Store the actual file
          }));
          setFileNames((prev) => ({
            ...prev,
            resume: file.name,
          }));
        }
      }
    },
    [avatarPreview]
  );

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "story", label: "Your Story" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "workstyle", label: "Work Style" },
    { id: "values", label: "Values" },
  ];

  return (
    <div className="min-h-screen bg-main">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit}>
          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab.id
                    ? "bg-cc-dblue text-white"
                    : "bg-white text-cc-dblue"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-cc-dblue">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                      {formData.basicInfo.avatar ? (
                        <img
                          src={URL.createObjectURL(formData.basicInfo.avatar)}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "avatar")}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cc-dblue file:text-white hover:file:bg-blue-700"
                    />
                    {fileNames.avatar && (
                      <span className="ml-2 text-sm text-gray-600">
                        Selected: {fileNames.avatar}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.basicInfo.fullName}
                    onChange={(e) =>
                      handleInputChange("basicInfo", "fullName", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={formData.basicInfo.title}
                    onChange={(e) =>
                      handleInputChange("basicInfo", "title", e.target.value)
                    }
                    placeholder="e.g. Full Stack Developer"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.basicInfo.location}
                    onChange={(e) =>
                      handleInputChange("basicInfo", "location", e.target.value)
                    }
                    placeholder="City, Country"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Story Tab */}
          {activeTab === "story" && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-cc-dblue">Your Story</h2>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 mb-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Proudest Achievement
                  </label>
                  <textarea
                    value={formData.story.proudestAchievement}
                    onChange={(e) =>
                      handleInputChange(
                        "story",
                        "proudestAchievement",
                        e.target.value
                      )
                    }
                    placeholder="Share your most significant professional achievement"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue h-32"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 mb-2">
                    <BookOpen className="w-5 h-5 text-green-500" />
                    Current Learning
                  </label>
                  <textarea
                    value={formData.story.currentLearning}
                    onChange={(e) =>
                      handleInputChange(
                        "story",
                        "currentLearning",
                        e.target.value
                      )
                    }
                    placeholder="What are you currently learning or interested in?"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue h-32"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 mb-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Team Spirit
                  </label>
                  <textarea
                    value={formData.story.teamSpirit}
                    onChange={(e) =>
                      handleInputChange("story", "teamSpirit", e.target.value)
                    }
                    placeholder="Describe your experience working in teams"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue h-32"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-cc-dblue">Education</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">University</label>
                  <input
                    type="text"
                    value={formData.education.university}
                    onChange={(e) =>
                      handleInputChange(
                        "education",
                        "university",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Degree</label>
                  <input
                    type="text"
                    value={formData.education.degree}
                    onChange={(e) =>
                      handleInputChange("education", "degree", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Graduation Year
                    </label>
                    <input
                      type="number"
                      value={formData.education.graduationYear}
                      onChange={(e) =>
                        handleInputChange(
                          "education",
                          "graduationYear",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">GPA</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.education.gpa}
                      onChange={(e) =>
                        handleInputChange("education", "gpa", e.target.value)
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Resume Upload
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, "resume")}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cc-dblue file:text-white hover:file:bg-blue-700"
                  />
                  {fileNames.resume && (
                    <span className="ml-2 text-sm text-gray-600">
                      Selected: {fileNames.resume}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-cc-dblue">
                Skills & Expertise
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Technical Skills
                  </label>
                  <textarea
                    value={formData.skills.technical}
                    onChange={(e) =>
                      handleInputChange("skills", "technical", e.target.value)
                    }
                    placeholder="e.g. JavaScript, React, Node.js"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue h-32"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Soft Skills
                  </label>
                  <textarea
                    value={formData.skills.soft}
                    onChange={(e) =>
                      handleInputChange("skills", "soft", e.target.value)
                    }
                    placeholder="e.g. Leadership, Communication, Problem-solving"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue h-32"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Languages</label>
                  <input
                    type="text"
                    value={formData.skills.languages}
                    onChange={(e) =>
                      handleInputChange("skills", "languages", e.target.value)
                    }
                    placeholder="e.g. English (Native), Spanish (Intermediate)"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Work Style Tab */}
          {activeTab === "workstyle" && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-cc-dblue">Work Style</h2>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 mb-2">
                    <Coffee className="w-5 h-5 text-brown-500" />
                    Preferred Working Hours
                  </label>
                  <input
                    type="text"
                    value={formData.workStyle.preferredHours}
                    onChange={(e) =>
                      handleInputChange(
                        "workStyle",
                        "preferredHours",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Early bird (6am-3pm)"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Preferred Work Environment
                  </label>
                  <textarea
                    value={formData.workStyle.workEnvironment}
                    onChange={(e) =>
                      handleInputChange(
                        "workStyle",
                        "workEnvironment",
                        e.target.value
                      )
                    }
                    placeholder="Describe your ideal work environment"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue h-32"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Communication Style
                  </label>
                  <textarea
                    value={formData.workStyle.communicationStyle}
                    onChange={(e) =>
                      handleInputChange(
                        "workStyle",
                        "communicationStyle",
                        e.target.value
                      )
                    }
                    placeholder="How do you prefer to communicate with your team?"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue h-32"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Values Tab */}
          {activeTab === "values" && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-cc-dblue">
                Values & Goals
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Core Values
                  </label>
                  <textarea
                    value={formData.values.coreValues}
                    onChange={(e) =>
                      handleInputChange("values", "coreValues", e.target.value)
                    }
                    placeholder="What principles guide your work?"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue h-32"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Professional Interests
                  </label>
                  <textarea
                    value={formData.values.interests}
                    onChange={(e) =>
                      handleInputChange("values", "interests", e.target.value)
                    }
                    placeholder="What aspects of your field interest you most?"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue h-32"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Career Goals
                  </label>
                  <textarea
                    value={formData.values.goals}
                    onChange={(e) =>
                      handleInputChange("values", "goals", e.target.value)
                    }
                    placeholder="What are your short and long-term career goals?"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-cc-dblue h-32"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-cc-dblue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
