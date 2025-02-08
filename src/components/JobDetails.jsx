const JobDetails = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg max-h-[90vh] relative overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Job Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <Building className="w-5 h-5 mr-2" />
              <span>{job.companyName}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
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
            <div className="flex items-center text-gray-600 col-span-2">
              <CreditCard className="w-4 h-4 mr-2" />
              <span>{job.salaryRange}</span>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {job.description}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.required.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {job.skills.preferred && job.skills.preferred.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-2">Preferred Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.preferred.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {job.responsibilities && job.responsibilities.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-2">Responsibilities</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </section>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-2">Benefits</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {job.applicationUrl && (
            <div className="mt-8 sticky bottom-0 bg-white pt-4">
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
