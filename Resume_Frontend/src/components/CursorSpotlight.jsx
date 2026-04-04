import React, { useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

/**
 * CursorSpotlight
 * Popularized by Next.js/Vercel - A soft light that follows the mouse cursor
 * behind the content layer, illuminating the background dynamically.
 *
 * PERF: Uses useMotionValue + useMotionTemplate to build the gradient string
 * directly — zero React re-renders on mousemove.
 */
export default function CursorSpotlight() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Build the radial-gradient string reactively without re-rendering
  const background = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(56, 189, 248, 0.12), transparent 80%)`;

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 mix-blend-screen"
      style={{ background }}
    />
  );
}
