import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import ThemeToggle component for light/dark mode switching
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.svg';

/**
 * NavLink Component
 * Internal helper for Navbar links with sliding underline animation
 */
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center justify-center px-4 py-2 group cursor-pointer"
    >
      <Link
        to={to}
        className={`relative z-10 font-medium transition-colors duration-300
                    ${isActive
                      ? 'text-blue-600 dark:text-cyan-400'
                      : 'text-gray-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-cyan-400'
                    }`}
      >
        {children}
        {/* Animated sliding underline */}
        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-600 dark:bg-cyan-400 
                         transition-all duration-300 ease-out group-hover:w-full" />
      </Link>
    </motion.div>
  );
};

/**
 * Navbar Component
 * Displays navigation menu on top of every page with theme toggle
 * Features glassmorphism UI with backdrop blur
 * Responsive design with adaptive colors for light/dark modes
 */
const Navbar = () => {
  return (
    // Navigation bar with enhanced glassmorphism and theme-aware styling
    <nav className="fixed top-0 w-full z-50 
                    bg-white/70 dark:bg-slate-950/70 
                    backdrop-blur-xl
                    border-b border-slate-200/50 dark:border-white/5
                    transition-all duration-700 ease-in-out">
      {/* Container with full width and padding for responsiveness */}
      <div className="w-full px-4 sm:px-6 lg:px-12">
        {/* Flexbox for horizontal layout with nav height of 16 units */}
        <div className="flex justify-between items-center h-20">
          {/* Left side - Logo/Brand name */}
          <div className="flex items-center flex-1">
            <Link to="/" className="flex items-center gap-3 group transition-all duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                <img src={logo} alt="Resume Sphere Logo" className="w-9 h-9 relative z-10 group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-500 ease-out" />
              </div>
              <span className="text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r 
                                     dark:from-blue-400 dark:to-cyan-300
                                     font-black text-2xl tracking-tighter italic uppercase">
                Resume Sphere<span className="text-blue-600 dark:text-blue-400">.</span>
              </span>
            </Link>
          </div>
          
          {/* Center - Navigation links */}
          <div className="hidden md:flex items-center bg-slate-100/50 dark:bg-white/5 p-1 rounded-2xl backdrop-blur-md border border-slate-200/50 dark:border-white/5">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/upload">Upload</NavLink>
            <NavLink to="/dashboard">Result</NavLink>
            <NavLink to="/learning-hub">Learning</NavLink>
          </div>

          {/* Right side - Auth & Theme toggle */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 flex-1">
             <div className="hidden md:flex items-center gap-4 mr-2">
               <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                 Sign In
               </Link>
               <Link to="/register" className="text-[10px] font-black tracking-widest uppercase px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300">
                 Sign Up
               </Link>
             </div>
             <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
             <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
