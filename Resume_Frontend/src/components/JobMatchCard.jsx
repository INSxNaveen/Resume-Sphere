import React from 'react';
import { motion } from 'framer-motion';
import SkillTag from './SkillTag';
import TiltCard from './TiltCard';

const JobMatchCard = ({ job, index, onSkillClick }) => {
  // Gracefully handle undefined or missing fields
  const { title = "Software Engineer", company = "Unknown Company", matchScore = 0, matchedSkills = [], missingSkills = [] } = job;
  
  // Color configuration based on score
  const isGreatMatch = matchScore >= 75;
  const isGoodMatch = matchScore >= 50 && matchScore < 75;
  const scoreColor = isGreatMatch ? 'bg-green-500' : isGoodMatch ? 'bg-amber-400' : 'bg-red-500';
  const textScoreColor = isGreatMatch ? 'text-green-500 dark:text-green-400' : isGoodMatch ? 'text-amber-500 dark:text-amber-400' : 'text-red-500 dark:text-red-400';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full flex"
    >
      <TiltCard className="w-full h-full flex flex-col">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 flex-1 flex flex-col relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-all pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col flex-1">
            {/* Header: Title and Company */}
            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-900 dark:text-white capitalize leading-tight group-hover:text-blue-500 transition-colors">{title}</h3>
              {company && (
                <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1.5">{company}</p>
              )}
            </div>

            {/* Linear Progress Bar component inside the card */}
            <div className="mb-6 flex-shrink-0 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50 shadow-inner">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-wider">Candidate Fit</span>
                <span className={`text-2xl font-black tracking-tighter ${textScoreColor}`}>{matchScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${matchScore}%` }}
                  transition={{ duration: 1.2, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                  className={`h-full ${scoreColor} shadow-[0_0_10px_rgba(currentColor,0.5)]`}
                  style={{ backgroundColor: isGreatMatch ? '#22c55e' : isGoodMatch ? '#fbbf24' : '#ef4444' }}
                />
              </div>
            </div>

            {/* Red / Green Skill Tag section */}
            <div className="flex-1 flex flex-col gap-5">
              {matchedSkills && matchedSkills.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Validated Core Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {matchedSkills.map((skill, i) => (
                      <SkillTag key={`matched-${i}`} skill={skill} type="matched" />
                    ))}
                  </div>
                </div>
              )}

              {missingSkills && missingSkills.length > 0 && (
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800/50">
                  <p className="text-[10px] font-bold text-red-500/70 dark:text-red-400/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    Missing Competencies
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {missingSkills.map((skillObj, i) => {
                      // Handle both standard strings and the new rich MissingSkillDetail JSON objects
                      const skillName = typeof skillObj === 'string' ? skillObj : skillObj.skillName;
                      return (
                        <div key={`missing-${i}`} onClick={() => onSkillClick && onSkillClick(skillName)} className={onSkillClick ? "cursor-pointer touch-active-scale" : ""}>
                          <SkillTag skill={skillName} type="missing" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

export default JobMatchCard;
