import React, { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';

/**
 * ParallaxHero Component
 * Creates subtle parallax depth effect on hero section
 * Background elements move slightly when user moves mouse
 *
 * PERF: Uses useMotionValue + useSpring + useTransform instead of useState
 * so the parallax offset updates without React re-renders.
 */
const ParallaxHero = ({ children }) => {
  // Raw mouse position as motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse → parallax offset (max 15px) with spring for smoothness
  const rawOffsetX = useTransform(mouseX, (v) => {
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 1;
    return ((v - centerX) / centerX) * 15;
  });
  const rawOffsetY = useTransform(mouseY, (v) => {
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 1;
    return ((v - centerY) / centerY) * 15;
  });

  const offsetX = useSpring(rawOffsetX, { stiffness: 120, damping: 20, mass: 0.5 });
  const offsetY = useSpring(rawOffsetY, { stiffness: 120, damping: 20, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative overflow-hidden">
      {/* Static background layer - moves with parallax via motion values */}
      <motion.div
        className="absolute inset-0 pointer-events-none transform-gpu"
        style={{ x: offsetX, y: offsetY }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 
                       dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/30" />

        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 dark:bg-cyan-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </motion.div>

      {/* Content layer - stays in place with z-index */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ParallaxHero;
