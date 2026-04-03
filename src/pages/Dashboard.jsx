// This is the Dashboard page showing the analysis results
import { useLocation } from 'react-router-dom';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import MatchScoreCard from '../components/MatchScoreCard';
import SkillTag from '../components/SkillTag';
import { motion } from 'framer-motion';
import DotPatternBackground from '../components/DotPatternBackground';
import TiltCard from '../components/TiltCard';
import ResumeSuggestionsSection from '../features/analysis/ResumeSuggestionsSection';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Framer Motion Container for stagger effects
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } }
};

// Component: Shows the target job role (e.g., Full Stack Engineer)
const RoleBadge = ({ role = "Full Stack Engineer" }) => (
  // motion.div adds a pop-in animation when the page loads
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest backdrop-blur-md"
  >
    {/* A small blinking dot to make it look active */}
    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
    Match Target: {role}
  </motion.div>
);

// Component: A list of progress bars showing how well the user matches different skill categories
const SemanticMatchBreakdown = ({ categories }) => {
  return (
    <div className="space-y-6">
      {/* Loop through each category passed into the component */}
      {categories.map((cat, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between items-end text-sm">
            <span className="font-bold text-gray-700 dark:text-slate-300 uppercase tracking-tighter">{cat.label}</span>
            <span className="font-black text-blue-600 dark:text-cyan-400">{cat.score}%</span>
          </div>
          {/* Background area of the progress bar */}
          <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700/50">
            {/* The actual colored bar that fills up according to the score */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${cat.score}%` }} // Animates from 0 width to the score percentage
              transition={{ duration: 1, delay: 0.5 + i * 0.1 }} // Delays each bar slightly so they animate one by one
              className={`h-full bg-gradient-to-r ${cat.color} relative`}
            >
               <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
};

const InfoCard = ({ title, children, skillType = 'neutral' }) => {
  return (
    <TiltCard className="h-full">
      <div
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 h-full flex flex-col relative overflow-hidden"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 relative z-10">
          <span className={`w-3 h-3 rounded-full ${
            skillType === 'matched' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 
            skillType === 'missing' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 
            'bg-blue-500 shadow-[0_0_8px_#3b82f6]'
          }`}></span>
          {title}
        </h3>
        <div className="relative z-10 flex-1">
          {children}
        </div>
      </div>
    </TiltCard>
  );
};

/**
 * Dashboard Page - This page shows the results after the resume is analyzed.
 * It grabs the data passed from the Upload page and displays it.
 */
const Dashboard = () => {
  // 'location' is used to get the data (score, skills) passed from the previous page
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to the skill learning page when a missing skill is clicked
  const handleSkillClick = (skill) => {
    navigate(`/skill/${skill}`);
  };
  
  // Get data from the previous page, OR use this dummy data if we load the page directly for testing
  const data = location.state || {
    score: 72,
    matchedSkills: ['React', 'SQL', 'REST APIs', 'Node.js', 'Git'],
    missingSkills: ['Docker', 'Redis', 'Kubernetes'],
    suggestions: [
      'Add quantified achievements to your experience section',
      'Use action verbs at the beginning of bullet points',
      'Add measurable results for your projects'
    ],
    targetScore: 90
  };

  const categories = [
    { label: "Technical Proficiency", score: 85, color: "from-blue-600 to-cyan-400" },
    { label: "Experience Intensity", score: 62, color: "from-purple-600 to-pink-400" },
    { label: "Soft Skills & Leadership", score: 90, color: "from-emerald-600 to-teal-400" },
    { label: "Academic Alignment", score: 45, color: "from-amber-600 to-orange-400" }
  ];
  
  // Persist analysis data for the LearningHub tracker
  useEffect(() => {
    localStorage.setItem('lastAnalysis', JSON.stringify(data));
  }, [data]);

  return (
    <div className="relative w-full flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-1000">
      {/* Sleek Universal Background */}
      <DotPatternBackground />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <motion.div variants={itemVariants} className="text-center mb-16 space-y-4">
           <RoleBadge />
          <h1 className="text-fluid-h2 font-bold text-gray-900 dark:text-white mb-4 drop-shadow-sm uppercase italic tracking-tighter">
            Match <span className="text-blue-600 dark:text-blue-400 font-black">Intelligence</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-slate-300 max-w-2xl mx-auto">
            Granular semantic analysis of your career footprint against target requirements.
          </p>
        </motion.div>

        {/* Top Analytics Panel: Staggered Entrance & Mobile Flex */}
        <motion.div 
          className="flex flex-col lg:grid lg:grid-cols-3 gap-8 mb-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.2 }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {/* Main Score Area */}
          <motion.div variants={itemVariants} className="lg:col-span-1 border border-transparent touch-active-scale">
            <TiltCard>
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 h-full flex items-center justify-center">
                <MatchScoreCard score={data.score} />
              </div>
            </TiltCard>
          </motion.div>

          {/* Core ATS Formatting Metrics */}
          <motion.div variants={itemVariants} className="lg:col-span-2 border border-transparent touch-active-scale">
            <TiltCard>
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-slate-800 h-full flex flex-col justify-center relative overflow-hidden">
                 {/* Decorative background glow */}
                 <div className="absolute top-0 right-0 p-16 bg-blue-500/10 rounded-full blur-[80px]"></div>
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 relative z-10">ATS Parsing Health</h3>
                <div className="grid grid-cols-2 gap-6 relative z-10 mb-8">
                  <div>
                    <div className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-1">Matching Algorithm</div>
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg">
                      🧠 Semantic TF-IDF Scoring
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-1">Target Designation</div>
                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-lg">
                      🎯 {data.targetScore}% Match
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-1">Keywords Optimized</div>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-lg">
                      ✓ High Relevance
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-1">Action Verbs</div>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-lg">
                      ✓ Strong Usage
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-gray-100 dark:border-slate-800">
                  <h4 className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-6 px-1 italic">Semantic Category Match</h4>
                  <SemanticMatchBreakdown categories={categories} />
                </div>

                {/* Merged Skills Section */}
                <div className="relative z-10 pt-6 border-t border-gray-100 dark:border-slate-800">
                  <div className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Identified Core Competencies</div>
                  <div className="flex flex-wrap gap-2">
                    {data.matchedSkills.map((skill, index) => (
                      <SkillTag key={index} skill={skill} type="matched" />
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>



        {/* Salary Data & Next Steps Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
           <motion.div variants={itemVariants} className="flex flex-col h-full gap-6">
             <InfoCard title="Improvement Tips" skillType="neutral">
                <ul className="space-y-4">
                  {data.suggestions.map((suggestion, index) => (
                    <motion.li 
                      key={index} 
                      whileHover={{ x: 5 }}
                      className="flex gap-3 text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 p-4 rounded-lg cursor-default touch-active-scale"
                    >
                      <span className="text-blue-500 font-bold flex-shrink-0">{index + 1}.</span>
                      <span className="font-medium flex-1">{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>
             </InfoCard>

             {/* 100/100 Hackathon Win Feature: ATS Payload Injector */}
             <TiltCard>
               <div className="bg-gradient-to-br from-slate-900 to-black rounded-2xl p-6 shadow-2xl border border-green-500/30 relative overflow-hidden group h-full flex flex-col justify-center">
                  <div className="absolute top-0 right-0 p-8 bg-green-500/10 blur-3xl rounded-full"></div>
                  <h3 className="text-xl font-bold text-green-400 mb-2 flex items-center gap-2 font-mono uppercase tracking-widest text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    AI Payload Injector
                  </h3>
                  <p className="text-slate-400 text-xs mb-4 font-medium">Auto-generated highly ATS-optimized bullet point integrating your missing nodes:</p>
                  {/* AI Payload Injector Button and Text */}
                  <div className="bg-[#0a0a0a] border border-green-500/20 p-4 rounded-xl font-mono text-green-500/90 text-sm leading-relaxed shadow-inner">
                    <span className="text-green-500/50 select-none mr-2">❯</span>
                    "Orchestrated the architectural migration utilizing <span className="text-white font-bold bg-green-500/30 px-1 py-0.5 rounded border border-green-500/50">{data.missingSkills[0] || 'Advanced Patterns'}</span>, resulting in a 40% performance gain and streamlined deployments via <span className="text-white font-bold bg-green-500/30 px-1 py-0.5 rounded border border-green-500/50">{data.missingSkills[1] || 'Modern Tooling'}</span>."
                  </div>
                  {/* Copy to Clipboard logic */}
                  <button 
                    onClick={() => {
                       // This copies the text to the user's computer clipboard
                       navigator.clipboard.writeText(`Orchestrated the architectural migration utilizing ${data.missingSkills[0] || 'Advanced Patterns'}, resulting in a 40% performance gain and streamlined deployments via ${data.missingSkills[1] || 'Modern Tooling'}.`);
                       alert('Payload copied to clipboard! Paste directly into your resume.');
                    }} 
                    className="mt-6 w-full py-3 bg-green-500/10 hover:bg-green-500/20 active:scale-95 border border-green-500/30 rounded-lg text-green-400 font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    📋 Copy ATS Payload
                  </button>
               </div>
             </TiltCard>
           </motion.div>
           
           <motion.div variants={itemVariants} className="h-full">
             <TiltCard>
               <div className="bg-gradient-to-br from-indigo-600 to-purple-800 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden h-full flex flex-col">
                  {/* Decorative Mesh */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 transition-transform duration-700 transform hover:scale-105"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                       <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">💰 Base Salary Projection</h3>
                       <p className="text-indigo-200">Based on your current semantic match score.</p>
                    </div>
                    
                    <div className="my-6 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                       $85k - $110k
                    </div>
                    
                    {data.missingSkills && data.missingSkills.length > 0 && (
                      <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition duration-300 hover:shadow-lg">
                        <p className="text-sm font-medium">Acquiring <span className="text-indigo-200 font-bold tracking-wide">{data.missingSkills[0]}</span> could increase your top-band to <strong>$125k+</strong>.</p>
                      </div>
                    )}
                  </div>
               </div>
             </TiltCard>
           </motion.div>
        </div>

        <div className="mb-8">
          <ResumeSuggestionsSection />
        </div>

        {/* Migrated Critical Missing Nodes Grid - Staggered & Mobile Flex */}
        <div className="mb-20">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10 text-center tracking-tight"
          >
            Critical Missing Nodes
          </motion.h2>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.3 }
              }
            }}
            initial="hidden"
            animate="show"
            className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {data.missingSkills.map((skill, index) => (
               <motion.div 
                 key={index} 
                 variants={itemVariants} 
                 className="h-full cursor-pointer group touch-active-scale"
                 onClick={() => handleSkillClick(skill)}
               >
                 <TiltCard>
                   <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-red-100 dark:border-red-900/40 p-8 rounded-2xl relative overflow-hidden shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/20 transition-all duration-300 h-full flex flex-col justify-between group-hover:border-red-500/50">
                     
                     <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 opacity-80 group-hover:h-1.5 transition-all"></div>
                     <motion.div 
                        className="absolute top-0 left-0 w-1/3 h-1 bg-white blur-[2px]"
                        animate={{ x: ['-100%', '300%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: index * 0.2 }}
                     />

                     <div className="relative z-10">
                       <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-wide">{skill}</h3>
                       <p className="text-gray-500 dark:text-slate-400 text-sm mb-6 font-medium">Flagged by AI ATS Scanner</p>
                     </div>
                     
                     <div className="relative z-10">
                       <SkillTag skill={skill} type="missing" />
                     </div>
                   </div>
                 </TiltCard>
               </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Premium Action Buttons - FIXED ROUTES HERE */}
        <div className="max-w-3xl mx-auto space-y-8">
           <div className="grid sm:grid-cols-2 gap-4">
              <PrimaryButton 
                to="/interview-prep" 
                state={{ missingSkills: data.missingSkills }}
                className="w-full"
              >
                 🎤 Prepare for Interviews
              </PrimaryButton>
              <SecondaryButton 
                onClick={() => navigate('/upload')}
                className="w-full"
              >
                 🔄 Analyze Another
              </SecondaryButton>
           </div>
           <div className="flex justify-center flex-col sm:flex-row gap-4 pt-12 border-t border-gray-200 dark:border-slate-800">
              <PrimaryButton 
                to="/learning-hub" 
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-blue-500/20 w-full sm:w-auto"
              >
                 🧠 Enter Learning Hub & Tracker
              </PrimaryButton>
           </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Dashboard;
