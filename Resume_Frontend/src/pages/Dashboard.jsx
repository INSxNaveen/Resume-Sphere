import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DotPatternBackground from '../components/DotPatternBackground';
import SkillTag from '../components/SkillTag';
import TiltCard from '../components/TiltCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(location.state || null);
  const [isLoading, setIsLoading] = useState(!location.state);
  const [error, setError] = useState('');

  // Load analysis from API if navigated from history without state
  useEffect(() => {
    if (!data) {
      const lastAnalysis = localStorage.getItem('lastAnalysis');
      if (lastAnalysis) {
        try {
          setData(JSON.parse(lastAnalysis));
          setIsLoading(false);
        } catch {
          setError('No analysis data available.');
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
        <DotPatternBackground />
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg relative z-10">{error || 'No analysis data found.'}</p>
        <button
          onClick={() => navigate('/upload')}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors relative z-10"
        >
          Upload a Resume
        </button>
      </div>
    );
  }

  const { currentSkills = [], eligibleJobs = [], improvementSuggestions = [], unlockedOpportunities = [] } = data;
  const tabs = ['Overview', 'Current Skills', 'Eligible Jobs', 'Improve Suggestions', 'Unlocked Growth'];

  return (
    <div className="relative min-h-screen pb-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <DotPatternBackground />
      <div className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Analysis Complete
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
              Resume <span className="text-blue-600 dark:text-blue-400">Intelligence.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
              Career progression based strictly on your skillset
            </p>
          </div>
          <div className="flex bg-white/50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              <div className="lg:col-span-1 space-y-8">
                <TiltCard>
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white">{currentSkills.length}</h2>
                    <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Skills Identified</p>
                  </div>
                </TiltCard>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Jobs Found</span>
                      <span className="text-3xl font-black text-emerald-500">{eligibleJobs.length}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next Steps</span>
                      <span className="text-3xl font-black text-amber-500">{improvementSuggestions.length}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Futures Unlocked</span>
                      <span className="text-3xl font-black text-blue-500">{unlockedOpportunities.length}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SecondaryButton onClick={() => navigate('/upload')} className="w-full">
                      🔄 New Analysis
                    </SecondaryButton>
                    <PrimaryButton to="/history" className="w-full">
                      📜 Analysis History
                    </PrimaryButton>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-8">
                {/* Highlights */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Top Eligible Job</h3>
                  {eligibleJobs.length > 0 ? (
                    <div>
                      <h4 className="text-2xl font-black text-emerald-500 mb-2">{eligibleJobs[0].title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 italic">"{eligibleJobs[0].fitReason}"</p>
                      {eligibleJobs[0].matchScore && <p className="text-sm font-bold text-slate-600 mt-2">Core Match Score: {eligibleJobs[0].matchScore}%</p>}
                    </div>
                  ) : <p className="text-slate-500">No immediate roles matched perfectly. See suggestions to improve!</p>}
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Biggest Gap to Fill</h3>
                   {improvementSuggestions.length > 0 ? (
                      <div>
                        <h4 className="text-2xl font-black text-amber-500 mb-2">{improvementSuggestions[0].skill}</h4>
                        <p className="text-slate-500 dark:text-slate-400 italic">"{improvementSuggestions[0].reason}"</p>
                        <span className="inline-block mt-3 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase">Priority: {improvementSuggestions[0].priority}</span>
                      </div>
                   ) : <p className="text-slate-500">Your skills are well balanced.</p>}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Current Skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Identified Skills ({currentSkills.length})</h3>
              {currentSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentSkills.map((skill, i) => (
                    <SkillTag key={i} skill={skill} type="matched" />
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic text-sm">No skills identified from the resume.</p>
              )}
            </motion.div>
          )}

          {activeTab === 'Eligible Jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {eligibleJobs.length > 0 ? eligibleJobs.map((job, i) => (
                 <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-emerald-500/20 hover:border-emerald-500/50 transition-all shadow-sm">
                   <div className="flex justify-between items-start mb-4">
                     <h3 className="text-xl font-black text-slate-900 dark:text-white">{job.title}</h3>
                     <span className="text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg">{job.matchScore}% Match</span>
                   </div>
                   <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 italic">"{job.fitReason}"</p>
                   {job.missingSkills?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Missing Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {job.missingSkills.map(ms => (
                            <span key={ms} className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded text-xs font-bold">{ms}</span>
                          ))}
                        </div>
                      </div>
                   )}
                 </div>
              )) : (
                 <div className="col-span-full border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-12 text-center">
                    <p className="text-lg font-bold text-slate-600 dark:text-slate-400">No eligible jobs met the threshold.</p>
                 </div>
              )}
            </motion.div>
          )}

          {activeTab === 'Improve Suggestions' && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {improvementSuggestions.length > 0 ? improvementSuggestions.map((sug, i) => (
                 <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-amber-500/20 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{sug.skill}</h3>
                    <span className="inline-block mb-4 text-[10px] font-black px-2 py-1 bg-amber-500/10 text-amber-600 rounded uppercase tracking-widest">
                       Priority: {sug.priority}
                    </span>
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">"{sug.reason}"</p>
                 </div>
              )) : (
                 <div className="col-span-full border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-12 text-center">
                    <p className="text-lg font-bold text-slate-600 dark:text-slate-400">Your resume is perfectly optimized!</p>
                 </div>
              )}
            </motion.div>
          )}

          {activeTab === 'Unlocked Growth' && (
            <motion.div
              key="opportunities"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {unlockedOpportunities.length > 0 ? unlockedOpportunities.map((opp, i) => (
                 <div key={i} className="bg-gradient-to-br from-blue-900 to-indigo-900 p-8 rounded-3xl border border-blue-500/30 text-white relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-2xl rounded-full" />
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{opp.title}</h3>
                    <p className="text-sm text-indigo-200 mb-6 font-medium">"{opp.whyUnlocked}"</p>
                    {opp.requiredAddedSkills?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Required Skills to Learn</p>
                        <div className="flex flex-wrap gap-2">
                          {opp.requiredAddedSkills.map(sk => (
                            <span key={sk} className="bg-black/20 px-2 py-1 rounded text-xs font-bold text-white border border-white/10">{sk}</span>
                          ))}
                        </div>
                      </div>
                    )}
                 </div>
              )) : (
                 <div className="col-span-full border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-12 text-center">
                    <p className="text-lg font-bold text-slate-600 dark:text-slate-400">Complete missing skills first to unlock future opportunities.</p>
                 </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
