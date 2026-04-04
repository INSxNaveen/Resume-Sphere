import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DotPatternBackground from '../components/DotPatternBackground';
import { getDashboardSummary } from '../services/api';

const AuthenticatedHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        const res = await getDashboardSummary();
        if (isMounted) {
          setDashboardSummary(res.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard summary:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  }, []);

  const userStatus = dashboardSummary?.userStatus || (isLoading ? "loading" : "new");
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleJobClick = (analysisId) => {
    if (analysisId) {
      navigate(`/dashboard?analysisId=${analysisId}`);
    }
  };

  const handleCompanyClick = (companyName) => {
    navigate(`/companies/${encodeURIComponent(companyName)}`);
  };

  // Section Data
  const activityJobs = dashboardSummary?.activityRecommendedJobs || [];
  const featuredCompanies = dashboardSummary?.featuredCompanies || [];
  const insights = dashboardSummary?.latestAnalysis || null;
  const assistantMessages = insights?.assistantMessages || [];

  return (
    <div className="relative min-h-screen pb-20 bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      <DotPatternBackground />
      
      <div className="relative z-10 pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* SECTION A: SEARCH JOBS (HERO) */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3"
          >
            Find Your Next High-Impact Role
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg font-medium mb-10 max-w-2xl"
          >
            Searching across millions of live job listings to find your perfect match.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-3xl"
          >
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-6">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by role, company, or skill..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-2 outline-none"
                />
                <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-full transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  Explore
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (Sections B & D) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* SECTION B: JOBS BASED ON ACTIVITY */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Recommended For You</h2>
                  <p className="text-sm text-slate-400">Based on your latest skills and career track.</p>
                </div>
                <button onClick={() => navigate('/jobs')} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">View All</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-32 bg-slate-900/50 animate-pulse rounded-2xl border border-white/5" />
                  ))
                ) : userStatus === 'new' ? (
                  <div className="col-span-full py-12 bg-slate-900/40 border border-dashed border-white/10 rounded-3xl flex flex-col items-center text-center px-6 group transition-all hover:bg-slate-900/60">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Analysis Pending</h3>
                    <p className="text-sm text-slate-400 max-w-xs mb-6">Upload your resume to see high-precision job matches based on your profile.</p>
                    <button onClick={() => navigate('/upload')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest py-3 px-8 rounded-full transition-all">Upload Now</button>
                  </div>
                ) : activityJobs.length === 0 ? (
                  <div className="col-span-full py-12 bg-slate-900/40 border border-white/5 rounded-3xl flex items-center justify-center text-slate-500 italic">
                    No live matching jobs available for your track right now.
                  </div>
                ) : (
                  activityJobs.map((job) => (
                    <motion.div 
                      key={job.id}
                      whileHover={{ y: -4 }}
                      className="p-5 bg-slate-900/50 backdrop-blur-md border border-white/5 hover:border-blue-500/30 transition-all rounded-3xl flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                            💼
                          </div>
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">{job.matchScore}% Match</span>
                        </div>
                        <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{job.title}</h4>
                        <p className="text-xs text-slate-400 mb-3">{job.companyName} • {job.location}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(job.createdAt).toLocaleDateString()}</span>
                        <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-blue-500 hover:text-white transition-colors">Apply External →</a>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </section>

            {/* SECTION D: EXPLORE COMPANIES */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Explore Companies</h2>
                  <p className="text-sm text-slate-400">Discover who's hiring in the industry right now.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-40 bg-slate-900/30 animate-pulse rounded-3xl border border-white/5" />
                  ))
                ) : featuredCompanies.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-slate-500 italic">
                    Live company data currently unavailable.
                  </div>
                ) : (
                  featuredCompanies.map((company) => (
                    <motion.div 
                      key={company.name}
                      whileHover={{ rotate: 2, scale: 1.05 }}
                      onClick={() => handleCompanyClick(company.name)}
                      className="p-6 bg-slate-900/30 backdrop-blur-lg border border-white/5 hover:border-purple-500/20 hover:bg-slate-800/40 rounded-3xl transition-all flex flex-col items-center text-center cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-xl font-bold text-slate-400 group-hover:bg-blue-600/20 transition-colors">
                        {company.name.charAt(0)}
                      </div>
                      <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1 truncate w-full">{company.name}</h4>
                      <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">{company.activeOpenings} Active Roles</p>
                    </motion.div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (Section C: My Insights) */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-6">My Insights</h2>
            
            <div className="bg-[#131620] border border-white/5 rounded-3xl p-8 relative shadow-2xl overflow-hidden space-y-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
              
              {isLoading ? (
                <div className="flex flex-col gap-6">
                  <div className="h-32 bg-slate-900/50 animate-pulse rounded-2xl" />
                  <div className="h-32 bg-slate-900/50 animate-pulse rounded-2xl" />
                </div>
              ) : userStatus !== 'analyzed' ? (
                <div className="text-center py-12">
                   <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   </div>
                   <h3 className="text-white font-bold mb-2">Insights Locked</h3>
                   <p className="text-slate-400 text-sm">Please complete an analysis to view your personalized career insights.</p>
                </div>
              ) : (
                <>
                  {/* INSIGHT 1: TOP TRACK */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2 block">Detected Track</span>
                    <h3 className="text-xl font-bold text-white mb-2">{insights.resumeCategory}</h3>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  {/* INSIGHT 2: STRENGTHS */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-3 block">Top Strengths</span>
                    <div className="flex flex-wrap gap-2">
                       {insights.topSkills.map(skill => (
                         <span key={skill} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-slate-300">
                            {skill}
                         </span>
                       ))}
                    </div>
                  </div>

                  {/* INSIGHT 3: ASSISTANT CHAT */}
                  <div className="pt-6 border-t border-white/5">
                    <div className="flex gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                         <span className="text-[10px] font-bold">AI</span>
                      </div>
                      <div className="space-y-3">
                         {assistantMessages.map((msg, i) => (
                           <div key={i} className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-2xl border border-white/5">
                             {msg}
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>

                  <button onClick={() => navigate('/learning-hub')} className="w-full bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl border border-white/5 transition-all">
                    View Full Strategy Hub →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedHome;
