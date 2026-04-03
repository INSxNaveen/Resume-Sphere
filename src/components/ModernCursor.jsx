import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * ModernCursor
 * A premium, lightweight custom cursor replacing the default system pointer.
 * Consists of a solid core dot and a laggy spring-animated outer ring.
 *
 * PERF: Uses useMotionValue instead of useState for mouse position
 * so the cursor moves without triggering React re-renders (~60×/sec savings).
 */
export default function ModernCursor() {
  // Motion values for mouse position — updated on every mousemove WITHOUT re-rendering
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // isHovering still uses state — it fires rarely (only on element boundary crossings)
  const [isHovering, setIsHovering] = useState(false);

  // Derive the positions: core dot with a tiny offset, ring with spring lag
  const dotX = useTransform(mouseX, (v) => v - 6);
  const dotY = useTransform(mouseY, (v) => v - 6);

  const ringXRaw = useTransform(mouseX, (v) => v - 20);
  const ringYRaw = useTransform(mouseY, (v) => v - 20);
  const ringX = useSpring(ringXRaw, { stiffness: 150, damping: 15, mass: 0.6 });
  const ringY = useSpring(ringYRaw, { stiffness: 150, damping: 15, mass: 0.6 });

  useEffect(() => {
    // Hide default cursor across the body when this component is active
    document.body.style.cursor = 'none';

    const updateMousePosition = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Detect if we are hovering over an interactive element
    const handleMouseOver = (e) => {
      const interactiveElements = ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT'];
      if (
        interactiveElements.includes(e.target.tagName) || 
        e.target.closest('button') || 
        e.target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);

    // Cleanup and restore default cursor on unmount
    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Small quick-following core dot — uses style (not animate) so no re-render */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] pointer-events-none z-[99999] transform-gpu"
        style={{ x: dotX, y: dotY }}
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.05 }}
      />
      
      {/* Large trailing spring ring — spring physics handled by useSpring above */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-[1.5px] border-cyan-400 pointer-events-none z-[99998] flex items-center justify-center mix-blend-difference transform-gpu"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          backgroundColor: isHovering ? 'rgba(34, 211, 238, 0.15)' : 'rgba(0,0,0,0)',
          borderColor: isHovering ? 'rgba(34, 211, 238, 0.8)' : 'rgba(34, 211, 238, 0.5)'
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      />
    </>
  );
}
