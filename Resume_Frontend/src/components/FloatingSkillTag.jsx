import React, { useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * FloatingSkillTag Component
 * Animated floating skill tags for hero section
 * Features:
 * - Slow floating animation
 * - Glow effect
 * - Responsive positioning 
 * - High contrast dark mode readability
 */
const FloatingSkillTag = ({ skill, delay = 0, x = 50, y = 50 }) => {
  const containerRef = useRef(null);

  // Random floating direction and speed
  const duration = 4 + Math.random() * 2;
  const yOffset = 20 + Math.random() * 20;

  return (
    <motion.div
      ref={containerRef}
      className="absolute transform-gpu"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <motion.div
        animate={{
          y: [0, -yOffset, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide transform-gpu
                   bg-white/90 dark:bg-slate-900/90
                   backdrop-blur-md
                   border border-blue-200 dark:border-cyan-500/60
                   text-blue-700 dark:text-cyan-300
                   shadow-xl shadow-blue-200/60 dark:shadow-[0_0_15px_rgba(6,182,212,0.3)]
                   whitespace-nowrap`}
      >
        {skill}
      </motion.div>
    </motion.div>
  );
};

export default FloatingSkillTag;
