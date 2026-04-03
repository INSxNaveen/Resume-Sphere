import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ATS_LOGS = [
  "INITIALIZING NEURAL MATCH ENGINE v2.4.1...",
  "ESTABLISHING SECURE CONNECTION...",
  "PARSING RESUME METADATA...",
  "EXTRACTING TEXT VECTORS...",
  "WARNING: IMPERFECT FORMATTING DETECTED. AUTO-CORRECTING...",
  "TOKENIZING JOB DESCRIPTION REQUIREMENTS...",
  "MAPPING SEMANTIC SIMILARITIES...",
  "RUNNING TF-IDF COSINE ANALYSIS...",
  "IDENTIFYING MISSING TECHNICAL NODES...",
  "CALCULATING ATS READABILITY SCORE...",
  "GENERATING ACTIONABLE PAYLOAD...",
  "MATCH INTELLIGENCE CALIBRATED. REDIRECTING..."
];

const ATSTerminal = () => {
  const [currentLogs, setCurrentLogs] = useState([]);
  
  useEffect(() => {
    let currentIndex = 0;
    
    const popLog = () => {
      if (currentIndex < ATS_LOGS.length) {
        setCurrentLogs(prev => [...prev, ATS_LOGS[currentIndex]]);
        currentIndex++;
        
        // Randomize typing speed for realism (between 150ms and 500ms)
        const nextSpeed = Math.random() * 350 + 150;
        setTimeout(popLog, nextSpeed);
      }
    };
    
    // Start after a very short delay
    setTimeout(popLog, 200);
    
    return () => currentIndex = ATS_LOGS.length; // Cleanup
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.15)] border border-green-500/20 bg-[#0A0A0A] font-mono text-xs sm:text-sm">
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-2 bg-[#1A1A1A] border-b border-green-500/20">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="mx-auto text-green-500/50 font-bold uppercase tracking-widest text-[10px]">
          Neural_ATS_Scanner_Node
        </div>
      </div>
      
      {/* Terminal Body */}
      <div className="p-6 h-64 sm:h-80 overflow-y-auto flex flex-col justify-end">
        <div className="space-y-2">
          <AnimatePresence>
            {currentLogs.map((log, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-3 ${index === ATS_LOGS.length - 1 ? 'text-green-400 font-bold' : 'text-green-500/70'}`}
              >
                <span className="text-green-500/40 select-none">
                  ❯
                </span>
                <span>{log}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {/* Blinking Cursor */}
           <motion.div 
             animate={{ opacity: [1, 0] }} 
             transition={{ repeat: Infinity, duration: 0.8 }}
             className="w-2.5 h-4 bg-green-500 ml-4 mt-2"
           />
        </div>
      </div>
    </div>
  );
};

export default ATSTerminal;
