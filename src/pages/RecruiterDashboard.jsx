import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  Eye,
  Clock,
  Plus,
  Building,
  ChevronRight,
  FileText,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

const ErrorAlert = ({ title, children }) => (
  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <AlertCircle className="h-5 w-5 text-red-500" />
      </div>
      <div className="ml-3 w-full">
        <h3 className="text-sm font-medium text-red-800">{title}</h3>
        <div className="mt-2 text-sm text-red-700">{children}</div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="p-6 flex flex-col items-center justify-center">
    <div className="max-w-md w-full mb-4">
      <ErrorAlert title="Error Loading Dashboard">{error}</ErrorAlert>
    </div>
    <button
      onClick={onRetry}
      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <RefreshCcw className="w-4 h-4 mr-2" />
      Try Again
    </button>
  </div>
);

const EmptyState = ({ onCreateJob }) => (
  <div className="text-center py-12">
    <FileText className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-lg font-medium text-gray-900">
      No jobs posted yet
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Get started by creating your first job posting
    </p>
    <div className="mt-6">
      <button
        onClick={onCreateJob}
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="w-5 h-5 mr-2" />
        Post New Job
      </button>
    </div>
  </div>
);

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalViews: 0,
    totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobsAndStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const response = await fetch("/api/recruiter/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Your session has expired. Please log in again.");
        }
        throw new Error("Failed to fetch jobs. Please try again later.");
      }

      const data = await response.json();
      setJobs(data.jobs || []);
      setStats({
        totalJobs: data.stats.totalJobs || 0,
        activeJobs: data.stats.activeJobs || 0,
        totalViews: data.stats.totalViews || 0,
        totalApplications: data.stats.totalApplications || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndStats();
  }, []);

  const handleCreateJob = () => navigate("/recruiter/jobs/new");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg">
            <ErrorState error={error} onRetry={fetchJobsAndStats} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Recruiter Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your job postings and track applications
            </p>
          </div>
          <button
            onClick={handleCreateJob}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Briefcase className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Jobs
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.totalJobs}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Other stat cards... */}
        </div>

        {/* Jobs List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">
              Current Job Postings
            </h2>
          </div>
          <div className="border-t border-gray-200">
            {jobs.length === 0 ? (
              <EmptyState onCreateJob={handleCreateJob} />
            ) : (
              <ul className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <li key={job._id} className="hover:bg-gray-50">
                    {/* Job item content... */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
