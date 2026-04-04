import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * HeroMockup
 * A "Top 1%" Vercel-style floating UI window that shows off the app's capabilities
 * directly in the Hero section before the user even signs up.
 * Features 3D tilting physics and internal micro-animations (ticking score).
 *
 * PERF FIXES:
 * - Fixed broken useMotionTemplate (was being passed to useSpring which expects a number)
 * - Fixed nested setInterval memory leak
 * - Uses requestAnimationFrame for smooth score counting
 */
export default function HeroMockup() {
  const [score, setScore] = useState(0);

  // 3D Tilt Physics — raw motion values for mouse position
  const mouseXVal = useMotionValue(0);
  const mouseYVal = useMotionValue(0);

  // Spring-smoothed rotation (useSpring takes a MotionValue<number>, not a string)
  const rotateX = useSpring(mouseYVal, { stiffness: 100, damping: 20 });
  const rotateY = useSpring(mouseXVal, { stiffness: 100, damping: 20 });

  // Add "deg" suffix via useTransform for the style binding
  const rotateXDeg = useTransform(rotateX, (v) => `${v}deg`);
  const rotateYDeg = useTransform(rotateY, (v) => `${v}deg`);

  // Optimized 3D Tilt — reduced sensitivity for performance
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const rX = ((mouseYPos / rect.height) - 0.5) * -8;
    const rY = ((mouseXPos / rect.width) - 0.5) * 8;

    mouseXVal.set(rY);
    mouseYVal.set(rX);
  };

  const handleMouseLeave = () => {
    mouseXVal.set(0);
    mouseYVal.set(0);
  };

  // Score animation using requestAnimationFrame for smooth 60fps counting
  // Both intervals are properly cleaned up to prevent memory leaks
  useEffect(() => {
    let outerTimeout;
    let rafId;
    let cancelled = false;

    const runScoreAnimation = () => {
      if (cancelled) return;
      setScore(0);

      const startTime = performance.now();
      const duration = 800; // ms to count up
      const targetScore = 95;

      const tick = (now) => {
        if (cancelled) return;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out curve for natural deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        setScore(Math.round(eased * targetScore));

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          // Schedule next cycle
          outerTimeout = setTimeout(runScoreAnimation, 5000);
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    runScoreAnimation();

    return () => {
      cancelled = true;
      clearTimeout(outerTimeout);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="perspective-[1500px] w-full max-w-4xl mx-auto flex justify-center items-center mt-12 z-20 relative">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: rotateXDeg,
          rotateY: rotateYDeg,
          transformStyle: "preserve-3d"
        }}
        className="w-full relative shadow-2xl dark:shadow-blue-500/5 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg overflow-hidden transform-gpu"
      >
        {/* Mockup Header/Mac Window Controls */}
        <div className="h-10 bg-gray-100/50 dark:bg-slate-800/50 border-b border-gray-200/50 dark:border-slate-700/50 flex items-center px-4 gap-2">
           <div className="w-3 h-3 rounded-full bg-red-400"></div>
           <div className="w-3 h-3 rounded-full bg-amber-400"></div>
           <div className="w-3 h-3 rounded-full bg-green-400"></div>
           <div className="ml-4 text-[10px] font-black font-mono text-gray-500 dark:text-slate-500 uppercase tracking-tighter">analysis_dashboard.exe</div>
        </div>

        {/* Mockup Body Content */}
        <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6 transform-gpu">
           
           {/* Left Mockup Panel - Ticking Score */}
           <div 
             style={{ transform: "translateZ(30px)" }} 
             className="md:col-span-1 bg-white dark:bg-black/40 rounded-xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center transition-transform"
           >
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                 <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-slate-800"></div>
                 <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
                 <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">
                   {score}%
                 </span>
              </div>
              <div className="text-sm font-bold text-gray-800 dark:text-slate-200">Match Score</div>
           </div>

           {/* Right Mockup Panel - Semantic Data */}
           <div className="md:col-span-2 flex flex-col gap-4">
              <div 
                style={{ transform: "translateZ(20px)" }} 
                className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/50 flex items-center gap-4"
              >
                 <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg shadow-lg animate-pulse">
                   🧠
                 </div>
                 <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">Semantic TF-IDF Scan</div>
                    <div className="w-48 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-blue-500" 
                         animate={{ width: ["0%", "100%", "0%"] }} 
                         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                       />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div style={{ transform: "translateZ(40px)" }} className="bg-white dark:bg-black/40 rounded-xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="text-xs text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-bold">Skills Found</div>
                    <div className="flex gap-2 flex-wrap">
                       <span className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">React</span>
                       <span className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">Node.js</span>
                    </div>
                 </div>
                 <div style={{ transform: "translateZ(50px)" }} className="bg-white dark:bg-black/40 rounded-xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500"></div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-bold">Missing Nodes</div>
                    <div className="flex gap-2 flex-wrap">
                       <span className="px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold">Docker</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </motion.div>
    </div>
  );
}
