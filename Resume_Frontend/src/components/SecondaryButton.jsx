import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/*
SecondaryButton Component

This button includes a 3D hover effect and click animation.
In light mode it has a clean border outline.
In dark mode it uses glowing neon borders on hover.

Purpose:
Make secondary actions feel interactive while maintaining a clean aesthetic.
*/
const SecondaryButton = ({ children, to, onClick, className = '', type = 'button', disabled = false }) => {
  const baseClasses = `
    inline-flex items-center justify-center font-black rounded-2xl
    transition-all duration-500
    bg-white dark:bg-slate-900 text-slate-900 dark:text-white 
    border border-slate-200 dark:border-white/10 shadow-sm
    hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-500/30
    disabled:opacity-50 disabled:cursor-not-allowed
    uppercase tracking-widest text-[10px]
  `;

  const motionProps = {
    whileHover: disabled ? {} : { y: -4, scale: 1.02, shadow: "0 20px 40px rgba(0,0,0,0.1)" },
    whileTap: disabled ? {} : { scale: 0.98 },
  };

  const content = (
    <motion.span className="flex items-center gap-2 text-inherit">
      {children}
    </motion.span>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={`inline-block w-full ${className}`}>
        <motion.div
           {...motionProps}
           className={`${baseClasses} px-8 py-4 w-full h-full cursor-pointer`}
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
      className={`${baseClasses} px-8 py-4 ${className}`}
    >
      {content}
    </motion.button>
  );
};


export default SecondaryButton;
