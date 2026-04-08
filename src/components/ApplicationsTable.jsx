import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusBadge = ({ status }) => {
  const styles = {
    Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    InterviewScheduled: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Skipped: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.Applied}`}>
      {status === 'InterviewScheduled' ? 'Interview' : status}
    </span>
  );
};

const ScoreBadge = ({ score }) => {
  let color = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  if (score >= 85) color = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  else if (score >= 70) color = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${color}`}>
      {Math.round(score)}%
    </span>
  );
};

const ApplicationsTable = ({ applications, loading, onStatusUpdate }) => {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const itemsPerPage = 20;

  const filteredApps = useMemo(() => {
    let result = [...applications];

    if (filter !== 'All') {
      result = result.filter(app => app.status === filter);
    }

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(app => 
        app.company.toLowerCase().includes(s) || 
        app.jobTitle.toLowerCase().includes(s)
      );
    }

    result.sort((a, b) => {
      if (sort === 'newest') return new Date(b.appliedAt) - new Date(a.appliedAt);
      if (sort === 'oldest') return new Date(a.appliedAt) - new Date(b.appliedAt);
      if (sort === 'highest') return b.matchScore - a.matchScore;
      if (sort === 'lowest') return a.matchScore - b.matchScore;
      return 0;
    });

    return result;
  }, [applications, filter, sort, search]);

  const paginatedApps = filteredApps.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    await onStatusUpdate(id, newStatus);
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 space-y-4">
          <div className="h-10 w-full bg-slate-50 dark:bg-slate-800/50 rounded animate-pulse" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-6 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-50 dark:bg-slate-800/50 rounded animate-pulse" />
            </div>
            <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
        <input 
          type="text" 
          placeholder="Search by company or role..."
          className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select 
          className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
        >
          <option value="All">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="InterviewScheduled">Interview Scheduled</option>
          <option value="Failed">Failed</option>
          <option value="Skipped">Skipped</option>
        </select>
        <select 
          className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Score</option>
          <option value="lowest">Lowest Score</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">Company</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">Match</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">Applied</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              <AnimatePresence mode="popLayout">
                {paginatedApps.length === 0 ? (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <span className="text-5xl">📭</span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No applications yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs">
                          Install the Resume-Sphere extension and start applying to LinkedIn jobs.
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  paginatedApps.map((app) => (
                    <motion.tr 
                      key={app.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {app.company}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={app.linkedInJobUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 dark:text-cyan-400 hover:underline"
                        >
                          {app.jobTitle}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ScoreBadge score={app.matchScore} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {(() => {
                            if (!app.appliedAt) return '—';
                            const date = new Date(app.appliedAt);
                            if (isNaN(date.getTime())) return '—';
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <select
                            disabled={updatingId === app.id}
                            className={`text-xs font-bold bg-transparent outline-none cursor-pointer focus:ring-0 appearance-none
                              ${app.status === 'Applied' ? 'text-blue-600' : 
                                app.status === 'InterviewScheduled' ? 'text-green-600' :
                                app.status === 'Failed' ? 'text-red-500' : 'text-slate-500'}`}
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          >
                            <option value="Applied">Applied</option>
                            <option value="InterviewScheduled">Interview Scheduled</option>
                            <option value="Failed">Failed</option>
                            <option value="Skipped">Skipped</option>
                          </select>
                          {updatingId === app.id && (
                            <div className="w-3 h-3 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={app.linkedInJobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors"
                        >
                          View
                        </a>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Showing <span className="font-bold text-slate-900 dark:text-white">{(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, filteredApps.length)}</span> of <span className="font-bold text-slate-900 dark:text-white">{filteredApps.length}</span>
          </div>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl disabled:opacity-50 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-white"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl disabled:opacity-50 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTable;
