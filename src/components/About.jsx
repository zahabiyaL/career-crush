import React, { useState } from "react";
import { motion } from "framer-motion";

function AboutSection() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-cc-lblue to-cc-nblue p-10">
  
      <h1 className="text-[8rem] font-glook text-white tracking-widest mb-20">ABOUT</h1>

      <div className="relative w-200 h-200">
        <motion.div
          className="w-full h-full rounded-full cursor-pointer"
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => setFlipped(!flipped)}
        >
        
          <div className={`absolute w-full h-full flex items-center justify-center rounded-full bg-cc-nblue border-4 border-white shadow-xl
            ${flipped ? "hidden" : "flex"}`}>
            <p className="text-6xl text-white font-glook italic">Problem</p>
          </div>

        
          <div className={`absolute w-full h-full flex items-center justify-center rounded-full bg-cc-nblue border-4 border-white shadow-xl
            transform rotate-y-180 ${flipped ? "flex" : "hidden"}`}>
            <p className="text-4xl text-white font-glook italic p-5 text-center">
              "Companies seeking top Computer Science students face time-consuming
              and inefficient hiring processes that require sifting through
              numerous generic applications. At the same time, qualified CS
              students struggle to stand out and connect with companies that
              match their skills and interests."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AboutSection;
