import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DotPatternBackground from '../components/DotPatternBackground';
import TiltCard from '../components/TiltCard';
import SecondaryButton from '../components/SecondaryButton';
import { getLearningPlan, updateProgress } from '../services/api';

const LearningHub = () => {
  const navigate = useNavigate();
  const [learningItems, setLearningItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlan = async () => {
      const stored = localStorage.getItem('lastAnalysis');
      if (!stored) {
        setError('No analysis found. Please run an analysis first.');
        setIsLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        const analysisId = parsed.analysisId;
        if (!analysisId) {
          setError('Invalid analysis data. Please run a new analysis.');
          setIsLoading(false);
          return;
        }
        const res = await getLearningPlan(analysisId);
        setLearningItems(res.data);
      } catch (e) {
        console.error('Failed to load learning plan:', e);
        setError('Failed to load learning plan from server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, []);

  const handleUpdateProgress = async (skill, newPercent) => {
    newPercent = Math.max(0, Math.min(100, newPercent));

    // Optimistic UI update
    setLearningItems(prev => prev.map(item =>
      item.skillName === skill
        ? { ...item, progress: { ...item.progress, percentComplete: newPercent, status: newPercent === 100 ? 'completed' : newPercent > 0 ? 'in_progress' : 'not_started' } }
        : item
    ));

    // API Call
    const stored = localStorage.getItem('lastAnalysis');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.analysisId) {
          const status = newPercent === 100 ? 'completed' : newPercent > 0 ? 'in_progress' : 'not_started';
          await updateProgress({
            analysisId: parsed.analysisId,
            skillName: skill,
            status,
            percentComplete: newPercent
          });
        }
      } catch (e) {
        console.error('Failed to sync progress:', e);
      }
    }
  };

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
        {/* Header */}
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
             Mastery tracking for all identified skill gaps. Resources, projects, and progress — all in one place.
           </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-16 space-y-4">
            <p className="text-slate-500 dark:text-slate-400 font-medium">{error}</p>
            <button onClick={() => navigate('/upload')} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
              Upload a Resume
            </button>
          </div>
        ) : learningItems.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-4">No Learning Gaps Detected</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm font-medium">Your resume already covers all the skills required for the target role. Keep up the good work!</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {learningItems.map((item, index) => (
              <motion.div key={index} variants={cardVariants} className="group">
                <TiltCard>
                   <div className="relative h-full bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[32px] p-8 overflow-hidden group-hover:border-blue-500/40 transition-all duration-500 shadow-xl dark:shadow-none">
                      {/* Glowing Accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-all"></div>
                      
                      <div className="relative z-10 space-y-6">
                         <div className="flex justify-between items-start">
                            <div>
                               <h3 className="text-2xl font-black text-slate-800 dark:text-white italic tracking-tighter uppercase">{item.skillName}</h3>
                               <div className="flex items-center gap-2 mt-1">
                                 <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                                   item.priority === 'high' ? 'bg-red-500/10 text-red-500' : item.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                                 }`}>{item.priority}</span>
                                 <span className="text-[10px] text-slate-400 font-bold">{item.difficulty} · {item.estimatedHours}h</span>
                               </div>
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 text-xl font-black border border-blue-500/20">
                               {index + 1}
                            </div>
                         </div>

                         {/* Why it matters */}
                         {item.whyItMatters && (
                           <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">{item.whyItMatters}</p>
                         )}

                         {/* Progress Tracker */}
                         <div className="space-y-3">
                            <div className="flex justify-between items-end">
                               <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Mastery Index</span>
                               <span className="text-xl font-black text-blue-600 dark:text-blue-400">{item.progress?.percentComplete || 0}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300/30 dark:border-white/5">
                               <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.progress?.percentComplete || 0}%` }}
                                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + index * 0.1 }}
                                  className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-purple-500 relative"
                               >
                                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                               </motion.div>
                            </div>
                         </div>

                         {/* Resources */}
                         <div className="space-y-2 pt-2">
                           {item.freeResource && (
                             <a href={item.freeResource.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 dark:text-blue-400 hover:underline truncate">
                               🆓 {item.freeResource.title}
                             </a>
                           )}
                           {item.paidResource && (
                             <a href={item.paidResource.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-purple-600 dark:text-purple-400 hover:underline truncate">
                               💰 {item.paidResource.title}
                             </a>
                           )}
                           {item.practiceProject && (
                             <p className="text-xs text-slate-500 mt-1">
                               🔨 <span className="font-bold">Project:</span> {item.practiceProject}
                             </p>
                           )}
                         </div>

                         {/* Progress controls */}
                         <div className="grid grid-cols-2 gap-2 pt-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUpdateProgress(item.skillName, (item.progress?.percentComplete || 0) + 10); }}
                              className="py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest transition-all"
                            >+10%</button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUpdateProgress(item.skillName, (item.progress?.percentComplete || 0) - 10); }}
                              className="py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-500 dark:text-red-400 text-[10px] font-black uppercase tracking-widest transition-all"
                            >-10%</button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUpdateProgress(item.skillName, 100); }}
                              className="py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest transition-all"
                            >Mark Complete</button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUpdateProgress(item.skillName, 0); }}
                              className="py-2 bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/20 rounded-xl text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all"
                            >Reset</button>
                         </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] font-black text-slate-500 dark:text-slate-500 tracking-tighter">AI-OPTIMIZED PATH</span>
                         <motion.span 
                           whileHover={{ x: 5 }}
                           onClick={() => navigate(`/skill/${item.skillName}`)}
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
        )}

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
