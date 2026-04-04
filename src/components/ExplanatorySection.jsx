import React from 'react';
import { motion } from 'framer-motion';
import PrimaryButton from './PrimaryButton';

export default function ExplanatorySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="relative z-10 w-full bg-slate-50 dark:bg-[#020617] border-t border-slate-200 dark:border-white/5 pt-24 pb-32 overflow-hidden transition-colors duration-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">

        {/* What is ResumeSphere & Who is it for */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">ResumeSphere?</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              ResumeSphere is a smart resume analysis platform designed for students, freshers, and early job seekers. Make sure your resume perfectly aligns with the specific job role you're applying for.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Who is it built for?</h3>
              <ul className="space-y-4">
                {[
                  "Students preparing for their first internship",
                  "Fresh graduates entering the job market",
                  "Early career professionals looking to switch roles"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* What problems does it solve? */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-8">What problems does it solve?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "Blind Guessing",
                desc: "Stop submitting applications without knowing if your resume keywords actually match the job description.",
                icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              },
              {
                title: "Skill Gaps",
                desc: "Identify exactly which skills you are missing for your target role, before the recruiter does.",
                icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              },
              {
                title: "Lack of Direction",
                desc: "Get practical project ideas and learning resources instead of just a generic improvement score.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z"
              }
            ].map((prob, i) => (
               <div key={i} className="bg-white/40 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                 <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={prob.icon} />
                   </svg>
                 </div>
                 <h4 className="font-bold text-slate-900 dark:text-white mb-2">{prob.title}</h4>
                 <p className="text-sm text-slate-600 dark:text-slate-400">{prob.desc}</p>
               </div>
            ))}
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
           variants={containerVariants}
           initial="hidden"
           whileInView="show"
           viewport={{ once: true }}
           className="relative"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">How it works</h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">Three simple steps to build your custom career roadmap.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              { step: "01", title: "Upload Resume", desc: "Upload your current resume in PDF format. We extract the text securely on your end." },
              { step: "02", title: "Select Target Role", desc: "Paste a job description or select an industry role you are actively targeting." },
              { step: "03", title: "Get Actionable Insights", desc: "Receive a match score, missing skills list, and a guided improvement plan." }
            ].map((item, i) => (
              <motion.div variants={itemVariants} key={i} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 text-8xl font-black text-slate-100 dark:text-slate-800/50 transition-transform group-hover:scale-110 pointer-events-none">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 mt-4">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What you get */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">What you get</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-lg">Everything you need to upgrade your resume and align it perfectly with industry demands.</p>
              <ul className="space-y-5">
                {[
                  "Deep-dive Match Score analysis",
                  "Missing skill identification",
                  "Actionable learning resource suggestions",
                  "Relevant, resume-boosting project ideas",
                  "Formatting and phrasing tips"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-blue-50 font-medium text-lg">
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
               {/* Mockup visualization */}
               <div className="space-y-4">
                 <div className="flex justify-between items-end border-b border-white/20 pb-4">
                   <div>
                     <div className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-1">Match Score</div>
                     <div className="text-5xl font-black">82%</div>
                   </div>
                   <div className="text-green-300 font-bold bg-green-500/20 px-3 py-1 rounded-full text-sm">Strong Fit</div>
                 </div>
                 <div>
                   <div className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-3">Missing Critical Skills</div>
                   <div className="flex flex-wrap gap-2">
                     {["Docker", "GraphQL", "CI/CD"].map((skill, i) => (
                       <span key={i} className="px-3 py-1.5 bg-red-500/20 text-red-200 rounded-lg text-sm font-medium border border-red-500/30">
                         {skill}
                       </span>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Why ResumeSphere? */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">Why ResumeSphere?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Unlike basic ATS checkers that simply search for exact keywords and give you an arbitrary score, ResumeSphere focuses on 
            <span className="text-slate-900 dark:text-white font-bold"> guided improvement</span>. We don't just tell you that you're missing something—we tell you <span className="text-blue-600 dark:text-blue-400 font-bold">what to do next</span> to learn those skills and become the ideal candidate.
          </p>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center pt-8 border-t border-slate-200 dark:border-slate-800"
        >
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Ready to improve your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">career direction?</span></h2>
          <PrimaryButton to="/upload" className="w-full sm:w-auto px-12 py-6 shadow-2xl shadow-blue-500/20 text-xl font-bold">
            Start Free Analysis
          </PrimaryButton>
        </motion.div>

      </div>
    </div>
  );
}
