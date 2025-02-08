import React from "react";

function AboutSection() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <div className="text-center p-10">
        <h1 className="text-6xl font-glook text-white tracking-widest">ABOUT</h1>
        <div className="mt-10 bg-blue-700 rounded-2xl p-10 shadow-xl">
          <p className="text-2xl text-white font-light leading-relaxed italic">
            "Companies seeking top Computer Science talent face time-consuming
            and inefficient hiring processes that require sifting through
            numerous generic applications. At the same time, qualified CS
            students struggle to stand out and connect with companies that
            match their skills and interests."
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
