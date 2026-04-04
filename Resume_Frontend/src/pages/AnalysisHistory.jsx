import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DotPatternBackground from '../components/DotPatternBackground';
import { getAnalysisHistory, getAnalysis, deleteAnalysis } from '../services/api';
import { useToast } from '../context/ToastContext';

const AnalysisHistory = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getAnalysisHistory();
        setResumes(res.data);
      } catch (err) {
        setError('Failed to load history. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent card click (handleReload)
    if (!window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) return;

    try {
      await deleteAnalysis(id);
      setResumes(prev => prev.filter(r => r.analysisId !== id));
      showToast('Analysis deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete analysis.', 'error');
    }
  };

  const handleReload = async (entry) => {
    const analysisId = entry.analysisId;
    if (!analysisId) return;

    setLoadingId(analysisId);
    try {
      const res = await getAnalysis(analysisId);
      const fullAnalysis = res.data;
      fullAnalysis.roleTitle = entry.roleTitle;
      fullAnalysis.companyName = entry.companyName;
      localStorage.setItem('lastAnalysis', JSON.stringify(fullAnalysis));
      navigate('/dashboard', { state: fullAnalysis });
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to reload analysis.', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="relative min-h-screen pb-20 bg-slate-50 dark:bg-slate-950">
      <DotPatternBackground />
      <div className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">
              Analysis <span className="text-blue-600 dark:text-blue-400">History</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">All past analyses stored in the database. Click to view full results.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 font-bold text-center py-10">{error}</div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500 font-medium">
            No analyses yet. <button onClick={() => navigate('/upload')} className="text-blue-600 dark:text-blue-400 underline">Upload your first resume →</button>
          </div>
        ) : (
          <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {resumes.map((resume, i) => {
              const rId = resume.analysisId;
              const rScore = resume.overallScore ?? 0;
              const rDate = resume.createdAt;
              const matchedCount = resume.matchedSkillsCount ?? 0;
              const missingCount = resume.missingSkillsCount ?? 0;

              return (
              <motion.div
                key={rId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleReload(resume)}
                className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between hover:border-blue-500/50 transition-all shadow-sm group gap-4"
              >
                <div className="flex-1 text-center md:text-left">
                  <p className="font-bold text-slate-800 dark:text-white text-lg">
                    {resume.roleTitle || 'Unknown Role'} <span className="text-slate-400 font-medium">at</span> {resume.companyName || 'Unknown Company'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Analyzed {new Date(rDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className={`text-2xl font-black ${
                      rScore >= 70 ? 'text-green-500' :
                      rScore >= 40 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {Math.round(rScore)}%
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Match</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-6 border-r pr-6">
                     <span className="text-emerald-500">{matchedCount} Matched</span>
                     <span>·</span>
                     <span className="text-red-500">{missingCount} Missing</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => handleDelete(e, rId)}
                      className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                      title="Delete Analysis"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                    
                    <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-700 dark:text-white group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                       View Analysis
                    </button>
                    
                    {loadingId === rId ? (
                      <div className="w-5 h-5 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform inline-block">→</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )})}
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default AnalysisHistory;
