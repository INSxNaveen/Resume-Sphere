import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DotPatternBackground from '../components/DotPatternBackground';
import TiltCard from '../components/TiltCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

/**
 * LearningHub Page
 * This page acts as a "Tracker" for the skills the user needs to learn.
 * It reads the "missing skills" from the analysis and gives them a roadmap.
 */
const LearningHub = () => {
  // Navigation hook to let us click buttons to go to other pages
  const navigate = useNavigate();
  // State to hold the skills the user is missing
  const [missingSkills, setMissingSkills] = useState([]);
  
  // Simulated mastery data (in a real app, this would come from the backend/user profile)
  const [masteryData, setMasteryData] = useState({});

  useEffect(() => {
    // Get missing skills from local storage or session (from Dashboard)
    const stored = localStorage.getItem('lastAnalysis');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const skills = parsed.missingSkills || [];
        setMissingSkills(skills);
        
        // Initialize mastery with random progress for demo impact
        const initialMastery = {};
        skills.forEach(skill => {
          initialMastery[skill] = Math.floor(Math.random() * 40); // Standard starting point
        });
        setMasteryData(initialMastery);
      } catch (e) {
        console.error('Failed to parse analytics data:', e);
        setMissingSkills(['Docker', 'Redis', 'Kubernetes', 'React']); // Fallback demo data
      }
    } else {
        setMissingSkills(['Docker', 'Redis', 'Kubernetes', 'React']); // Fallback demo data
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 15 } }
  };

  return (
    <div className="relative min-h-screen pb-32 overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-inter selection:bg-blue-500/30 transition-colors duration-700">
      <DotPatternBackground />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Superior Header */}
        <div className="text-center mb-16 space-y-4">
           <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block p-1 px-4 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-[0.3em] mb-4 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
           >
             Personalized Skill Intelligence
           </motion.div>
           <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none italic uppercase">
             Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">Center</span>
           </h1>
           <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium">
             Consolidated mastery tracking for all identified gaps. Your roadmap to senior-level engineering status starts here.
           </p>
        </div>

        {/* Tracker Overview Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {missingSkills.map((skill, index) => (
            <motion.div key={index} variants={cardVariants} className="group">
              <TiltCard>
                 <div className="relative h-full bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[32px] p-8 overflow-hidden group-hover:border-blue-500/40 transition-all duration-500 shadow-xl dark:shadow-none">
                    {/* Glowing Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-all"></div>
                    
                    <div className="relative z-10 space-y-6">
                       <div className="flex justify-between items-start">
                          <div>
                             <h3 className="text-3xl font-black text-slate-800 dark:text-white italic tracking-tighter uppercase">{skill}</h3>
                             <p className="text-blue-600 dark:text-blue-400/60 text-[10px] font-black tracking-widest uppercase">Target Mastery</p>
                          </div>
                          <div className="w-10 h-10 flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 text-xl font-black border border-blue-500/20">
                             {index + 1}
                          </div>
                       </div>

                       {/* Progress Tracker */}
                       <div className="space-y-3">
                          <div className="flex justify-between items-end">
                             <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Mastery Index</span>
                             <span className="text-xl font-black text-blue-600 dark:text-blue-400">{masteryData[skill] || 0}%</span>
                          </div>
                          <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300/30 dark:border-white/5">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${masteryData[skill] || 0}%` }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + index * 0.1 }}
                                className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-purple-500 relative"
                             >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                             </motion.div>
                          </div>
                       </div>

                       {/* Quick Access Grid */}
                       <div className="grid grid-cols-2 gap-3 pt-4">
                          <button 
                            onClick={() => navigate(`/skill/${skill}`)}
                            className="p-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-blue-500 dark:hover:bg-blue-500 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-[10px] font-black uppercase tracking-widest text-center text-slate-700 dark:text-white hover:text-white"
                          >
                            🗺️ Roadmap
                          </button>
                          <button 
                            onClick={() => navigate(`/skill/${skill}`)}
                            className="p-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-red-500 dark:hover:bg-red-500 hover:border-red-500 dark:hover:border-red-500 transition-all text-[10px] font-black uppercase tracking-widest text-center text-slate-700 dark:text-white hover:text-white"
                          >
                            ▶️ Videos
                          </button>
                          <button 
                            onClick={() => navigate(`/skill/${skill}`)}
                            className="p-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-[10px] font-black uppercase tracking-widest text-center text-slate-700 dark:text-white hover:text-white"
                          >
                            📄 Docs
                          </button>
                          <button 
                            onClick={() => navigate(`/skill/${skill}`)}
                            className="p-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:border-indigo-600 dark:hover:border-indigo-600 transition-all text-[10px] font-black uppercase tracking-widest text-center text-slate-700 dark:text-white hover:text-white"
                          >
                            ☢️ Projects
                          </button>
                       </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                       <span className="text-[10px] font-black text-slate-500 dark:text-slate-500 tracking-tighter">AI-OPTIMIZED PATH</span>
                       <motion.span 
                         whileHover={{ x: 5 }}
                         onClick={() => navigate(`/skill/${skill}`)}
                         className="text-[10px] font-black text-blue-600 dark:text-blue-400 cursor-pointer underline flex items-center gap-1"
                       >
                         DEEP DIVE →
                       </motion.span>
                    </div>
                 </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
        {/* Final Navigation Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-20 flex justify-center"
        >
          <SecondaryButton to="/dashboard" className="px-10 py-4 shadow-xl">
            Return to Intelligence Dashboard
          </SecondaryButton>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LearningHub;

