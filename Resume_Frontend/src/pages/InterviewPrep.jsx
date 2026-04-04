// This page provides tailored interview questions based on the user's missing skills.
import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import PrimaryButton from '../components/PrimaryButton';
import DotPatternBackground from '../components/DotPatternBackground';

const InterviewPrep = () => {
  const location = useLocation();
  const missingSkills = location.state?.missingSkills || ['Docker', 'Microservices', 'System Design'];

  // Stagger animation container config for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative min-h-screen pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-700">
      <DotPatternBackground />
      <div className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-[0.3em]"
          >
            Psychological Edge Protocol
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter italic uppercase"
          >
            Readiness <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400">Simulator</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium"
          >
            Turn your weaknesses into strategic advantages. Learn how to bridge knowledge gaps with elite communication.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {missingSkills.map((skill, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl dark:shadow-none border border-slate-200 dark:border-white/5 relative overflow-hidden group hover:border-red-500/30 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl pointer-events-none"></div>
              
              <div className="flex items-start gap-6 mb-8">
                <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-2xl bg-red-500/10 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-black border border-red-500/20">
                  Q
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white italic tracking-tight leading-tight uppercase">
                  "You don't have experience with {skill}, but we use it heavily. How do you plan to handle this?"
                </h3>
              </div>

              <div className="sm:pl-16">
                <div className="p-8 bg-blue-50/50 dark:bg-slate-800/40 rounded-[24px] border-l-4 border-blue-500 shadow-inner relative">
                  <h4 className="text-[10px] font-black tracking-[0.2em] text-blue-800 dark:text-blue-300 uppercase mb-4 opacity-70">Tactical Pivot Response</h4>
                  <p className="text-slate-700 dark:text-slate-300 italic mb-6 leading-relaxed font-bold text-lg">
                    "While I haven't used {skill} in a commercial environment, I possess extremely strong fundamentals in related concepts. In previous roles, I adapted to new ecosystems rapidly by systematically absorbing documentation and building proofs of concept. I've already outlined a 2-week roadmap to start building a project using {skill} in my spare time to bridge this gap."
                  </p>
                  <div className="font-black text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 px-4 py-2 rounded-full border border-slate-200 dark:border-white/5 inline-flex items-center gap-2">
                     💡 <span className="text-blue-600 dark:text-cyan-400">Psychology Tip:</span> Focus the interviewer on your high adaptability rate rather than apologizing for the missing skill.
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center mt-20"
        >
          <PrimaryButton to="/dashboard" className="px-16 py-5">
            Return to Command Center 🚀
          </PrimaryButton>
        </motion.div>
      </div>
    </div>

  );
};

export default InterviewPrep;
