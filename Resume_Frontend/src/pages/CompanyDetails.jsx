import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCompanyDetails, searchJobs } from '../services/api';
import DotPatternBackground from '../components/DotPatternBackground';

const CompanyDetails = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [compRes, jobsRes] = await Promise.all([
          getCompanyDetails(name),
          searchJobs(name)
        ]);
        setCompany(compRes.data);
        setActiveJobs(jobsRes.data);
      } catch (err) {
        console.error("Failed to load company details:", err);
        setError("Unable to retrieve real-time data for this organization.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [name]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
         <h1 className="text-2xl font-black text-white mb-4 uppercase">Company Intelligence Unavailable</h1>
         <p className="text-slate-500 mb-8 max-w-sm italic">{error || "The requested organization could not be found in our real-time database."}</p>
         <button onClick={() => navigate('/dashboard')} className="bg-white text-slate-950 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden pb-20">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-indigo-900/10 pointer-events-none" />
      <DotPatternBackground />

      <div className="relative z-10 pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-10"
          >
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-6xl font-black text-slate-400 shadow-2xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {company.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
               <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">{company.name}</h1>
                  <span className="bg-blue-600/20 text-blue-400 text-[10px] px-3 py-1 rounded-full font-black uppercase border border-blue-600/20 tracking-widest">Verified Employer</span>
               </div>
               <p className="text-slate-400 text-lg md:text-xl font-medium mb-6 max-w-2xl leading-relaxed">
                  {company.description}
               </p>
               <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-slate-900/60 border border-white/5 rounded-2xl px-6 py-3">
                     <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Roles</span>
                     <span className="text-xl font-black text-white">{activeJobs.length} Live Openings</span>
                  </div>
                  <div className="bg-slate-900/60 border border-white/5 rounded-2xl px-6 py-3">
                     <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Hiring Score</span>
                     <span className="text-xl font-black text-emerald-400">Premium High</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* LEFT COLUMN: ACTIVE JOBS */}
           <div className="lg:col-span-2">
              <h2 className="text-2xl font-black text-white mb-8 tracking-tight uppercase">Live Opportunities at {company.name}</h2>
              
              <div className="space-y-4">
                 {activeJobs.length === 0 ? (
                    <div className="bg-slate-900/40 border border-dashed border-white/10 rounded-3xl p-12 text-center text-slate-500 italic">
                       No active job listings found for this company at the moment.
                    </div>
                 ) : (
                    activeJobs.map((job, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={job.id}
                        className="p-6 bg-slate-900/50 backdrop-blur-md border border-white/5 hover:border-blue-500/30 transition-all rounded-3xl flex justify-between items-center group cursor-pointer"
                        onClick={() => window.open(job.jobUrl, '_blank')}
                      >
                         <div>
                            <h4 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors uppercase tracking-tight">{job.title}</h4>
                            <p className="text-xs text-slate-400 font-medium">{job.location}</p>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="hidden md:block text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(job.createdAt).toLocaleDateString()}</span>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </div>
                         </div>
                      </motion.div>
                    ))
                 )}
              </div>
           </div>

           {/* RIGHT COLUMN: INDUSTRY INSIGHTS */}
           <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                 <div className="bg-[#131620] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-[60px] rounded-full pointer-events-none" />
                    <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight italic">Desired Skill Profile</h3>
                    <div className="flex flex-wrap gap-2">
                       {company.commonSkills.map(skill => (
                          <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-300 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                             {skill}
                          </span>
                       ))}
                    </div>
                 </div>

                 <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">About Real-Time Data</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold italic">
                       The insights shown here are extracted live from global job market feeds. We analyze active listings to determine hiring intensity and common talent requirements for this organization.
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyDetails;
