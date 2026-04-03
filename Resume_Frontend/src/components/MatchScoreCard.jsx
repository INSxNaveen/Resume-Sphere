import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * MatchScoreCard Component (Top 1% UI Upgrade)
 * Ultra-smooth SVG stroke animation with requestAnimationFrame-based counter.
 *
 * PERF: Replaced setInterval(fn, 16) with requestAnimationFrame + timestamp easing
 * for genuinely smooth 60fps counting aligned with the browser's paint cycle.
 */
const MatchScoreCard = ({ score }) => {
  const [currentScore, setCurrentScore] = useState(0);
  const rafRef = useRef(null);
  
  // Mathematical constants for the SVG circular progress calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2000;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrentScore(Math.round(eased * score));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  return (
    <div className="relative flex flex-col items-center justify-center group w-full pt-4 pb-8">
      {/* 3D Drop Shadow Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-400/20 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      {/* The Animated SVG Dial */}
      <div className="relative flex items-center justify-center">
        <svg className="w-56 h-56 transform -rotate-90 drop-shadow-lg">
          {/* Base Background Track */}
          <circle
            cx="112"
            cy="112"
            r={radius}
            className="stroke-gray-100 dark:stroke-slate-800"
            strokeWidth="10"
            fill="none"
          />
          {/* Interactive Glowing Neon Track */}
          <motion.circle
            cx="112"
            cy="112"
            r={radius}
            className="stroke-blue-500 dark:stroke-cyan-400"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 12px rgba(6, 182, 212, 0.4))" }}
          />
        </svg>

        {/* Centered Ticking Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-cyan-400 dark:from-cyan-300 dark:to-blue-500 drop-shadow-md">
            {currentScore}%
          </span>
          <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mt-1">Match</span>
        </div>
      </div>
    </div>
  );
};

export default MatchScoreCard;