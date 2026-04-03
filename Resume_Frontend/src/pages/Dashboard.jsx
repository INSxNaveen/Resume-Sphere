import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DotPatternBackground from '../components/DotPatternBackground';
import MatchScoreCard from '../components/MatchScoreCard';
import SkillTag from '../components/SkillTag';
import TiltCard from '../components/TiltCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { generateTailoredResume, getAnalysis, getLearningPlan, updateProgress } from '../services/api';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);
  const [data, setData] = useState(location.state || null);
  const [isLoading, setIsLoading] = useState(!location.state);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  // Learning plan state
  const [learningPlan, setLearningPlan] = useState([]);
  const [learningLoading, setLearningLoading] = useState(false);

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

  // Load learning plan when tab is selected
  useEffect(() => {
    if (activeTab === 'Learning Plan' && data?.analysisId && learningPlan.length === 0) {
      setLearningLoading(true);
      getLearningPlan(data.analysisId)
        .then(res => setLearningPlan(res.data))
        .catch(() => setLearningPlan([]))
        .finally(() => setLearningLoading(false));
    }
  }, [activeTab, data?.analysisId]);

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

  const { overallScore, matchedSkills = [], missingSkills = [], missingKeywords = [], suggestions = [], scoreBreakdown = {}, deductionReasons = [], roleTitle, companyName } = data;
  const score = overallScore ?? 0;

  const breakdown = [
    {
      label: 'Required Skills',
      value: Math.round(scoreBreakdown.requiredSkillsScore ?? 0),
      weight: 35,
      color: 'from-blue-600 to-cyan-400',
      description: 'Coverage of must-have skills from the JD'
    },
    {
      label: 'Preferred Skills',
      value: Math.round(scoreBreakdown.preferredSkillsScore ?? 0),
      weight: 15,
      color: 'from-emerald-600 to-teal-400',
      description: 'Coverage of nice-to-have skills'
    },
    {
      label: 'ATS Keywords',
      value: Math.round(scoreBreakdown.atsKeywordsScore ?? 0),
      weight: 15,
      color: 'from-violet-600 to-purple-400',
      description: 'Domain and role-specific keyword coverage'
    },
    {
      label: 'Experience Relevance',
      value: Math.round(scoreBreakdown.experienceRelevanceScore ?? 0),
      weight: 15,
      color: 'from-amber-600 to-orange-400',
      description: 'Alignment of projects and experience with the role'
    },
    {
      label: 'Education',
      value: Math.round(scoreBreakdown.educationScore ?? 0),
      weight: 10,
      color: 'from-rose-600 to-pink-400',
      description: 'Education and certification alignment'
    },
    {
      label: 'Resume Quality',
      value: Math.round(scoreBreakdown.resumeQualityScore ?? 0),
      weight: 10,
      color: 'from-sky-600 to-indigo-400',
      description: 'Section structure, action verbs, and measurable achievements'
    },
  ];

  const tabs = ['Overview', 'Match Breakdown', 'Missing Skills', 'ATS Keywords', 'Learning Plan', 'Tailored Resume'];

  const handleUpdateProgress = async (skill, newPercent) => {
    newPercent = Math.max(0, Math.min(100, newPercent));
    setLearningPlan(prev => prev.map(item =>
      item.skillName === skill ? { ...item, progress: { ...item.progress, percentComplete: newPercent, status: newPercent === 100 ? 'completed' : newPercent > 0 ? 'in_progress' : 'not_started' } } : item
    ));
    try {
      await updateProgress({
        analysisId: data.analysisId,
        skillName: skill,
        status: newPercent === 100 ? 'completed' : newPercent > 0 ? 'in_progress' : 'not_started',
        percentComplete: newPercent,
      });
    } catch (e) {
      console.error('Failed to update progress:', e);
    }
  };

  return (
    <div className="relative min-h-screen pb-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <DotPatternBackground />
      <div className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                Analysis Finalized
             </div>
             <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                Match <span className="text-blue-600 dark:text-blue-400">Intelligence.</span>
             </h1>
             {roleTitle && (
               <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
                 {roleTitle}{companyName ? ` at ${companyName}` : ''}
               </p>
             )}
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
              className="grid lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-1 space-y-8">
                <TiltCard>
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                    <MatchScoreCard score={score} />
                    <p className="mt-6 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Overall Score</p>
                  </div>
                </TiltCard>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Matched Skills</span>
                      <span className="text-3xl font-black text-emerald-500">{matchedSkills.length}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Missing Skills</span>
                      <span className="text-3xl font-black text-red-500">{missingSkills.length}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Missing Keywords</span>
                      <span className="text-3xl font-black text-amber-500">{missingKeywords.length}</span>
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

              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 border-b dark:border-white/5 pb-4">Score Breakdown (Weighted)</h3>
                  <div className="space-y-6">
                    {breakdown.map((cat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                          <span className="text-slate-600 dark:text-slate-400" title={cat.description}>{cat.label} <span className="text-slate-400 dark:text-slate-600 font-medium">({cat.weight}%)</span></span>
                          <span className="text-blue-600 dark:text-blue-400">{cat.value}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.value}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={`h-full bg-gradient-to-r ${cat.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deduction Reasons */}
                {deductionReasons.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/30">
                    <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Score Deductions
                    </h3>
                    <ul className="space-y-3">
                      {deductionReasons.map((reason, i) => (
                        <li key={i} className="text-sm text-red-800/80 dark:text-red-400/80 font-medium flex gap-3">
                          <span className="text-red-500 font-black">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Match Breakdown' && (
            <motion.div
              key="match"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Matched Skills ({matchedSkills.length})</h3>
                  {matchedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {matchedSkills.map((skill, i) => (
                        <SkillTag key={i} skill={skill} type="matched" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-sm">No matched skills found.</p>
                  )}
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Improvement Suggestions</h3>
                  {suggestions.length > 0 ? (
                    <ul className="space-y-4">
                      {suggestions.map((s, i) => (
                        <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400 text-sm font-medium">
                          <span className="text-blue-600 dark:text-blue-400 font-black shrink-0">0{i+1}.</span>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{s.title || s}</p>
                            {s.description && <p className="text-slate-500 mt-1">{s.description}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 italic text-sm">No specific suggestions.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Missing Skills' && (
            <motion.div
              key="missing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {missingSkills.length > 0 ? missingSkills.map((skill, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/skill/${skill.skillName}`)}
                  className="group cursor-pointer bg-white dark:bg-slate-900 p-8 rounded-3xl border border-red-500/20 hover:border-red-500/50 transition-all shadow-sm hover:shadow-xl hover:shadow-red-500/5"
                >
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">{skill.skillName}</h3>
                     <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                       skill.jobRelevance === 'high' ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                       : skill.jobRelevance === 'medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                       : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                     }`}>
                       {skill.jobRelevance || 'Required'}
                     </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 italic">"{skill.explanation}"</p>
                </div>
              )) : (
                <div className="col-span-full text-center py-12 text-slate-400">
                  <p className="text-lg font-medium">No missing skills! Your resume covers all required skills.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'ATS Keywords' && (
            <motion.div
              key="ats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="bg-slate-900 rounded-3xl p-10 border border-white/10">
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Missing <span className="text-red-400">Keywords</span></h3>
                 <p className="text-slate-400 mb-6 max-w-xl font-medium">These ATS keywords appear in the job description but were not found in your resume. Including them could improve your match score.</p>
                 {missingKeywords.length > 0 ? (
                   <div className="flex flex-wrap gap-2">
                     {missingKeywords.map((kw, index) => (
                       <span key={index} className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                         {kw.keyword || kw}
                       </span>
                     ))}
                   </div>
                 ) : (
                   <p className="text-emerald-400 font-bold">Great! Your resume covers all detected ATS keywords.</p>
                 )}
              </div>

              {/* Matched Keywords */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Matched Keywords</h3>
                 <div className="flex flex-wrap gap-2">
                   {matchedSkills.map((skill, index) => (
                     <span key={index} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-bold">
                       ✓ {skill}
                     </span>
                   ))}
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Learning Plan' && (
            <motion.div
              key="learning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {learningLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : learningPlan.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {learningPlan.map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.skillName}</h3>
                        <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                          item.priority === 'high' ? 'bg-red-500/10 text-red-500' : item.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>{item.priority}</span>
                      </div>
                      <p className="text-sm text-slate-500 italic">{item.whyItMatters}</p>
                      <div className="flex gap-4 text-xs text-slate-400">
                        <span>⏱ {item.estimatedHours}h</span>
                        <span>📊 {item.difficulty}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-blue-500">{item.progress?.percentComplete || 0}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress?.percentComplete || 0}%` }}
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                          />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleUpdateProgress(item.skillName, (item.progress?.percentComplete || 0) + 25)} className="flex-1 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase">+25%</button>
                          <button onClick={() => handleUpdateProgress(item.skillName, 100)} className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">Done</button>
                          <button onClick={() => handleUpdateProgress(item.skillName, 0)} className="flex-1 py-1.5 bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/20 rounded-lg text-slate-500 text-[10px] font-black uppercase">Reset</button>
                        </div>
                      </div>

                      {/* Resources */}
                      <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
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
                          <p className="text-xs text-slate-500 mt-2">
                            🔨 <span className="font-bold">Project:</span> {item.practiceProject}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-16">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-4">No Learning Gaps</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm font-medium">Your resume already covers all the skills required for this role.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'Tailored Resume' && (
            <motion.div
              key="tailored"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-indigo-600 rounded-3xl p-12 text-white overflow-hidden relative"
            >
               <div className="absolute top-0 right-0 p-32 bg-white/10 blur-[100px] rounded-full"></div>
               <div className="relative z-10 max-w-4xl">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">AI Resume <span className="text-indigo-200">Generation</span></h3>
                  <p className="text-indigo-100 mb-8 font-medium">Generate a truthful ATS-optimized resume tailored for <strong>{roleTitle || 'your target role'}</strong>. Only real data from your resume is used — nothing is fabricated.</p>

                  {generatedResume ? (
                    <div className="space-y-4">
                      <div className="bg-white/10 p-6 rounded-2xl border border-white/20 whitespace-pre-wrap font-mono text-sm max-h-[600px] overflow-y-auto leading-relaxed">
                        {generatedResume}
                      </div>
                      <button
                        onClick={() => setGeneratedResume(null)}
                        className="bg-white/20 hover:bg-white/30 text-white font-black uppercase tracking-widest text-[10px] px-6 py-2 rounded-xl transition-all"
                      >
                        Generate New Version
                      </button>
                    </div>
                  ) : (
                    <button
                       onClick={async () => {
                         setIsGenerating(true);
                         try {
                            const res = await generateTailoredResume({ analysisId: data.analysisId });
                            setGeneratedResume(res.data.tailoredContent);
                         } catch (err) {
                            const msg = err.response?.data?.error || 'Resume generation failed. Please try again.';
                            showToast(msg, 'error');
                         } finally {
                            setIsGenerating(false);
                         }
                       }}
                       disabled={isGenerating || !data.analysisId}
                       className="bg-white text-indigo-600 font-black uppercase tracking-widest text-[10px] px-8 py-3 rounded-xl hover:bg-indigo-50 transition-all shadow-xl disabled:opacity-50"
                    >
                       {isGenerating ? 'Generating...' : 'Generate Tailored Resume'}
                    </button>
                  )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Dashboard;
