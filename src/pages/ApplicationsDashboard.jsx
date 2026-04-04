import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getApplications, getApplicationStats, updateApplicationStatus } from '../services/api';
import StatsBanner from '../components/StatsBanner';
import ApplicationsTable from '../components/ApplicationsTable';
import DotPatternBackground from '../components/DotPatternBackground';

function ConnectionTester() {
  const [dotnetStatus, setDotnetStatus] = useState('idle'); // idle | testing | ok | error
  const [aiStatus, setAiStatus] = useState('idle');
  const [dotnetUrl] = useState('http://localhost:5000');
  const [aiUrl] = useState('http://localhost:8000');

  async function testConnections() {
    setDotnetStatus('testing');
    setAiStatus('testing');

    // Test .NET backend
    try {
      const res = await fetch(`${dotnetUrl}/health`); 
      setDotnetStatus(res.ok ? 'ok' : 'error');
    } catch {
      setDotnetStatus('error');
    }

    // Test Python AI service
    try {
      const res = await fetch(`${aiUrl}/docs`); 
      setAiStatus(res.ok ? 'ok' : 'error');
    } catch {
      setAiStatus('error');
    }
  }

  const StatusIcon = ({ status }) => {
    if (status === 'testing') return <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />;
    if (status === 'ok') return <span className="text-green-500 font-bold">✓</span>;
    if (status === 'error') return <span className="text-red-500 font-bold">✗</span>;
    return <span className="text-slate-300 font-bold">?</span>;
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/5">
      <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 italic">
        Backend Connection Diagnostics
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">.NET API (5000)</span>
          <StatusIcon status={dotnetStatus} />
        </div>
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Service (8000)</span>
          <StatusIcon status={aiStatus} />
        </div>
      </div>
      <button 
        onClick={testConnections}
        className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
      >
        Run Diagnostics
      </button>
    </div>
  );
}

const ApplicationsDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const appData = await getApplications();
      setApplications(appData);
      
      const statsData = await getApplicationStats();
      setStats(statsData);
      
      // Update unread count reference
      localStorage.setItem('rs_lastSeenCount', appData.length.toString());
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load applications. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const updated = await updateApplicationStatus(id, newStatus);
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: updated.status } : app));
      
      // Re-fetch stats to update avg score/interviews
      const newStats = await getApplicationStats();
      setStats(newStats);
    } catch (err) {
      alert('Failed to update status. Please try again.');
    }
  };

  return (
    <div className="relative w-full flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-1000">
      <DotPatternBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
              Applications <span className="text-blue-600">History</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Real-time feed of jobs automated by your Resume-Sphere Extension.
            </p>
          </div>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:shadow-lg transition-all active:scale-95"
          >
            <span>🔄 Refresh Feed</span>
          </button>
        </div>

        {error ? (
          <div className="p-8 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-3xl text-center">
            <p className="text-red-700 dark:text-red-400 font-bold mb-4">{error}</p>
            <button 
              onClick={fetchData}
              className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            <StatsBanner stats={stats} loading={loading} />
            
            <ApplicationsTable 
              applications={applications} 
              loading={loading}
              onStatusUpdate={handleStatusUpdate}
            />

            {/* Extension Settings Panel */}
            <div className="mt-12 space-y-4">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="w-full py-4 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl flex items-center justify-between text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <span>🔧 Extension Diagnostics & Settings</span>
                <span className={`transform transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
              
              {isSettingsOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                >
                  <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl grid md:grid-cols-2 gap-8 shadow-inner">
                    <div className="space-y-4">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Active Extension</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        The Resume-Sphere extension manages your auto-apply settings (threshold & state) locally in your browser.
                      </p>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-xl">
                        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                          Note: To change your match threshold or toggle auto-apply, click the Extension Icon in your browser toolbar.
                        </p>
                      </div>
                      <a 
                        href="chrome://extensions" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block text-xs font-black uppercase tracking-widest text-blue-600 dark:text-cyan-400 hover:underline"
                      >
                        Manage Extensions →
                      </a>
                    </div>
                    
                    <ConnectionTester />
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationsDashboard;
