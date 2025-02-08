import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Building,
  CreditCard,
  X,
  Check,
  Info,
} from "lucide-react";
import JobDetails from "./JobDetails";

const JobCard = ({ job, onSwipe, index, active }) => {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef(null);

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
    <>
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
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
              <button
                onClick={() => setShowDetails(true)}
                className="text-blue-600 hover:text-blue-700 p-2"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
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
      {showDetails && (
        <JobDetails job={job} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
};

const JobDiscovery = ({ onClose }) => {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
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
      setCurrentIndex(0);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchJobs();
  }, []);

  const handleReset = () => {
    fetchJobs();
  };

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
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-blue-600 hover:text-blue-700"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
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
                  <p className="text-gray-600 mb-4">
                    Check back later for new opportunities
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default JobDiscovery;
