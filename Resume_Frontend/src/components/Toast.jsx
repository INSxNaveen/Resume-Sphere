import React from 'react';
import { motion } from 'framer-motion';

/**
 * Toast Component - Professional SaaS notification
 */
const Toast = ({ message, type = 'info', onClose }) => {
  const iconMap = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  const colorMap = {
    success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    error: 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400',
    info: 'border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    warning: 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`pointer-events-auto min-w-[320px] max-w-md p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-4 ${colorMap[type]}`}
    >
      <span className="text-xl flex-shrink-0">{iconMap[type]}</span>
      <div className="flex-1 text-sm font-semibold tracking-tight">
        {message}
      </div>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        ✕
      </button>
    </motion.div>
  );
};

export default Toast;
