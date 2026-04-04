import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/*
PrimaryButton Component

This button includes a 3D hover effect and click animation.
In light mode it uses gradient colors.
In dark mode it uses glowing neon borders.

Purpose:
Make the interface feel interactive and modern.
*/
const PrimaryButton = ({ children, to, onClick, className = '', type = 'button', disabled = false }) => {
  const isWidthFull = className.includes('w-full');
  
  // To avoid duplicate or conflicting padding/text sizes
  const defaultPadding = className.includes('px-') || className.includes('p-') || className.includes('py-') ? '' : 'px-8 py-4';
  const defaultTextSize = className.includes('text-') ? '' : 'text-sm sm:text-base';

  const baseClasses = `
    inline-flex items-center justify-center font-bold rounded-full
    transition-all duration-300
    bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
    shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1
    border border-white/20 leading-none
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
    tracking-wider ${defaultTextSize}
  `;

  const motionProps = {
    whileHover: disabled ? {} : { y: -4, scale: 1.02 },
    whileTap: disabled ? {} : { scale: 0.98 },
  };

  // Optical text alignment: tracking-wider adds 0.05em spacing.
  // We offset it with pl-[0.05em] to keep the text visually centered.
  const content = (
    <motion.span className="flex items-center justify-center gap-2 pl-[0.05em]">
      {children}
    </motion.span>
  );

  const internalClassName = `${baseClasses} ${defaultPadding} ${className}`;

  if (to && !disabled) {
    return (
      <Link to={to} className={`inline-block ${className.includes('w-full') ? 'w-full' : ''} ${className.includes('sm:w-auto') ? 'sm:w-auto' : ''}`}>
        <motion.div
           {...motionProps}
           className={`${internalClassName} w-full h-full cursor-pointer flex items-center justify-center`}
        >
          {content}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      {...motionProps}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={internalClassName}
    >
      {content}
    </motion.button>
  );
};

export default PrimaryButton;
