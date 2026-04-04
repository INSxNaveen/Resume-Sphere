import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, loading }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div className="flex-1">
          {loading ? (
            <div className="space-y-2">
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {value}
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {label}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StatsBanner = ({ stats, loading }) => {
  const avgScore = stats?.avgScore || 0;
  const statList = [
    { label: 'Total Applied', value: stats?.total || 0, icon: '📋' },
    { label: 'This Week', value: stats?.thisWeek || 0, icon: '📅' },
    { label: 'Avg Match Score', value: `${isNaN(avgScore) ? 0 : avgScore}%`, icon: '🎯' },
    { label: 'Interviews Scheduled', value: stats?.interviewsScheduled || 0, icon: '🗓' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statList.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <StatCard {...stat} loading={loading} />
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBanner;
