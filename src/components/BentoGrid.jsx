import React from 'react';
import { motion } from 'framer-motion';

/**
 * BentoGrid
 * The modern "Top 1%" way to show features (standardized by Apple and Linear).
 * An asymmetric grid with dedicated micro-animations for each feature block.
 */
export default function BentoGrid() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
      
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-fluid-h2 font-black text-gray-900 dark:text-white tracking-tight"
        >
          Designed to Make Resume Improvement <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Easier</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
        
        {/* Large Feature 1: Semantic Scanning (Spans 2 columns) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="col-span-1 md:col-span-2 row-span-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-slate-700/50 shadow-lg relative overflow-hidden group"
        >
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
               <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 border border-blue-500/20">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                 </svg>
               </div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-wide">Smart Resume Analysis</h3>
               <p className="text-gray-600 dark:text-slate-400 max-w-sm">
                 We don't just match keywords. Our platform deeply analyzes your bullet points to truly understand the context of your skills and experience.
               </p>
            </div>
          </div>

          {/* Optimized Sweeping Laser Micro-Animation */}
          <motion.div 
            className="absolute -inset-10 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent blur-xl pointer-events-none transform-gpu"
            animate={{ x: ['-150%', '150%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* Feature 2: High Speed Upload (1 block) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-1 row-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 border border-gray-200/50 dark:border-slate-700/50 shadow-lg relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
             SVG
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Easy Resume Upload</h3>
          <p className="text-gray-600 dark:text-slate-400 text-sm">
            Upload your resume in seconds. Our fast and secure system reads your document instantly right in your browser.
          </p>
        </motion.div>

        {/* Feature 3: Live Roadmap (Spans 1 column, height 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-1 row-span-1 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-slate-700/50 shadow-lg relative overflow-hidden group"
        >
          {/* Animated Target Graphic */}
          <div className="absolute top-4 right-4 w-24 h-24 border-4 border-dashed border-cyan-400/30 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-cyan-400/80 transition-colors"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">Clear Improvement Steps</h3>
            <p className="text-gray-600 dark:text-slate-400">
              We create a clear, step-by-step roadmap to help you bridge any skill gaps.
            </p>
          </div>
        </motion.div>

        {/* Feature 4: Custom 3D Architecture (Spans 2 columns) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="col-span-1 md:col-span-2 row-span-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-8 shadow-xl shadow-blue-500/10 relative overflow-hidden flex items-center group"
        >
          {/* Simplified internal floating geometric shapes for performance */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute right-10 w-48 h-48 border border-white/10 rounded-lg pointer-events-none"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute right-20 w-32 h-32 border border-white/20 rounded-full pointer-events-none"
          />

          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic text-[Minify]">Fast & Smooth Experience</h3>
            <p className="text-cyan-100 max-w-sm text-base font-medium">
              Enjoy a seamless and interactive experience that looks great and runs smoothly on all your devices.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
