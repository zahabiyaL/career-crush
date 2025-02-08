import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCcw, Users, X } from 'lucide-react';

const CandidatesList = ({ isOpen, onClose }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const renderCandidateCard = (candidate) => {
    // Safely access nested properties with fallbacks
    const fullName = candidate.basicInfo?.fullName || candidate.studentName || 'Anonymous';
    const title = candidate.basicInfo?.title || 'No title provided';
    const location = candidate.basicInfo?.location || 'Location not specified';
    const skills = candidate.skills?.technical || candidate.skills || [];
    const education = candidate.education || {};
    const story = candidate.story || {};

    return (
      <div key={candidate.id} className="border rounded-lg p-4 hover:bg-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{fullName}</h3>
            <p className="text-sm text-gray-500">{title}</p>
          </div>
          <div className="text-sm text-gray-500">{location}</div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium">Education</h4>
            <p className="text-sm text-gray-600">
              {education.degree ? 
                `${education.degree} at ${education.university || 'Unknown University'}` : 
                'Education details not provided'}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium">Skills</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {Array.isArray(skills) ? (
                skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">No skills listed</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium">About</h4>
          <p className="text-sm text-gray-600 mt-1">
            {story.proudestAchievement || 'No achievement information provided'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Users className="mr-2" />
            Available Candidates
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            Loading candidates...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
            <button
              onClick={fetchCandidates}
              className="mt-3 flex items-center text-sm text-red-600 hover:text-red-500"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Try Again
            </button>
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No candidates found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {candidates.map(renderCandidateCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesList;