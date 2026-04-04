import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { searchJobs } from '../services/api';
import DotPatternBackground from '../components/DotPatternBackground';

const SearchJobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || "";
  const initialCategory = queryParams.get('category') || "";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [location.search]);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const q = queryParams.get('q') || "";
      const cat = queryParams.get('category') || "";
      const res = await searchJobs(q, cat);
      setJobs(res.data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch real-time job data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden pb-20">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />
      <DotPatternBackground />

      <div className="relative z-10 pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* HEADER & SEARCH BAR */}
        <div className="mb-12">
          <h1 className="text-3xl font-black text-white mb-8 tracking-tight uppercase">Live Job Intelligence</h1>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
             <div className="flex-1 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Role, skill, or keyword..."
                  className="relative w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all font-medium"
                />
             </div>
             <div className="md:w-64 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="relative w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all font-medium appearance-none"
                >
                  <option value="">All Categories</option>
                  <option value="it-jobs">Information Technology</option>
                  <option value="engineering-jobs">Engineering</option>
                  <option value="design-jobs">Design</option>
                  <option value="marketing-jobs">Marketing</option>
                  <option value="healthcare-jobs">Healthcare</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
             </div>
             <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black uppercase tracking-widest px-10 py-4 rounded-2xl transition-all shadow-xl shadow-blue-900/20 active:scale-95">
                Search
             </button>
          </form>
        </div>

        {/* RESULTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           
           {/* FILTERS (SIDEBAR) */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Location Filters</h3>
                 <div className="space-y-3">
                    {['Remote', 'London', 'New York', 'San Francisco', 'Berlin'].map(loc => (
                      <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                         <div className="w-4 h-4 border border-white/20 rounded bg-white/5 group-hover:border-blue-500 transition-colors" />
                         <span className="text-xs text-slate-400 group-hover:text-blue-300 transition-colors">{loc}</span>
                      </label>
                    ))}
                 </div>
              </div>

              <div className="bg-blue-600/5 border border-blue-500/10 rounded-3xl p-6">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Pro Tip</h3>
                 <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Use specific skills like "React" or "Python" in the search bar to get the highest precision matching scores.</p>
              </div>
           </div>

           {/* RESULTS */}
           <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   {isLoading ? "Searching Engines..." : `${jobs.length} Real-time Results Found`}
                 </span>
              </div>

              <div className="space-y-4">
                 {isLoading ? (
                   Array(5).fill(0).map((_, i) => (
                      <div key={i} className="h-28 bg-slate-900/30 animate-pulse rounded-2xl border border-white/5" />
                   ))
                 ) : error ? (
                   <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-8 text-center">
                      <p className="text-sm font-medium text-red-400">{error}</p>
                   </div>
                 ) : jobs.length === 0 ? (
                   <div className="bg-slate-900/40 border border-dashed border-white/10 rounded-3xl p-20 text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6 text-slate-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">No Matches Found</h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto italic">We couldn't find any real live listings matching those criteria. Try widening your search.</p>
                   </div>
                 ) : (
                   <AnimatePresence mode="popLayout">
                     {jobs.map((job, i) => (
                       <motion.div 
                         key={job.id}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: i * 0.05 }}
                         className="p-6 bg-slate-900/50 backdrop-blur-md border border-white/5 hover:border-white/10 hover:bg-slate-900/80 transition-all rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center group"
                       >
                         <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                               💼
                            </div>
                            <div>
                               <h4 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors uppercase tracking-tight">{job.title}</h4>
                               <p className="text-xs text-slate-400 font-medium">{job.companyName} • {job.location}</p>
                               <div className="mt-2 flex gap-2">
                                  {job.salaryMin && (
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/10">Est. Salary Available</span>
                                  )}
                                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-500/10 uppercase tracking-widest">{job.category}</span>
                               </div>
                            </div>
                         </div>
                         <div className="mt-4 md:mt-0 flex gap-3 w-full md:w-auto">
                            <a 
                              href={job.jobUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex-1 md:flex-none bg-white text-slate-950 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-blue-400 transition-all shadow-xl shadow-white/5"
                            >
                              Apply Listing
                            </a>
                         </div>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SearchJobs;
