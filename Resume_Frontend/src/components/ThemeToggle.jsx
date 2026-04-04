import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

/**
 * ThemeToggle Component
 * Animated toggle button to switch between Light and Dark modes
 * Theme preference is saved to localStorage
 * Features:
 * - Smooth sliding animation
 * - Glowing border effect
 * - Animated circle indicating current theme
 * - Color transitions for light/dark modes
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center w-14 h-7 rounded-full 
                 bg-gradient-to-r from-purple-500 to-cyan-500
                 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2
                 dark:focus:ring-offset-slate-950
                 transition-all duration-500"
      aria-label="Toggle theme"
    >
      {/* Outer glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0"
        animate={{
          opacity: isLight ? 0 : 0.3,
        }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow: isLight
            ? 'none'
            : '0 0 20px rgba(34, 211, 238, 0.6)',
        }}
      />

      {/* Animated sliding circle */}
      <motion.div
        className="relative inline-flex h-6 w-6 transform items-center justify-center 
                   rounded-full bg-white shadow-md"
        animate={{
          x: isLight ? 4 : 28,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      >
        {/* Sun icon (light mode) */}
        <motion.div
          animate={{ opacity: isLight ? 1 : 0, scale: isLight ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <svg
            className="w-3 h-3 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-1.414-1.414a2 2 0 00-2.828 0l-.707.707a1 1 0 001.414 1.414l.707-.707a.5.5 0 01.707 0l1.414 1.414a1 1 0 001.414-1.414zM2.05 13.464a2 2 0 00 0 2.828l.707.707a1 1 0 001.414-1.414l-.707-.707a.5.5 0 00-.707 0zM16.95 2.05a2 2 0 012.828 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a.5.5 0 00-.707 0zM2.757 4.464a1 1 0 011.414-1.414l-.707-.707a2 2 0 00-2.828 0l-.707.707a1 1 0 001.414 1.414l.707-.707z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>

        {/* Moon icon (dark mode) */}
        <motion.div
          animate={{ opacity: isLight ? 0 : 1, scale: isLight ? 0.5 : 1 }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <svg
            className="w-3 h-3 text-slate-700"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Background glow animation */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isLight
            ? '0 0 0px rgba(234, 211, 238, 0)'
            : '0 0 15px rgba(34, 211, 238, 0.5)',
        }}
        transition={{ duration: 0.5 }}
      />
    </button>
  );
};

export default ThemeToggle;
