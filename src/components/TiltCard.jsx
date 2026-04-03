import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * TiltCard
 * A reusable wrapper that adds an elegant 3D tilt effect on hover to any content inside it.
 * Uses Framer Motion instead of rigid CSS transforms for an organic 'weighty' feel.
 */
export default function TiltCard({ children, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ perspective: 1200 }}
      className={`relative group h-full ${className}`}
    >
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="h-full w-full relative"
      >
        <div 
          className="absolute -inset-1 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"
          style={{ transform: "translateZ(-10px)" }}
        />
        <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
