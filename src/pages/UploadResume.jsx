// This page handles the uploading of the user's resume.
// It is kept simple and professional for job seekers.
import { useNavigate } from 'react-router-dom';
import UploadBox from '../components/UploadBox';
import PrimaryButton from '../components/PrimaryButton';
import ATSTerminal from '../components/ATSTerminal';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { matchJobs } from '../services/api';
import DotPatternBackground from '../components/DotPatternBackground';
import { useToast } from '../context/ToastContext';

const UploadResume = () => {
  // Navigate function allows us to switch pages after analyzing
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // State variables track what the user is doing on the screen
  const [isUploading, setIsUploading] = useState(false); // True when analyzing
  const [resumeUploaded, setResumeUploaded] = useState(false); // True when the PDF is dropped in

  // Called when the resume PDF/DOCX is successfully dropped into the box
  const handleUploadSuccess = () => {
    setResumeUploaded(true);
    setIsUploading(false);
    // Show a success popup message at the bottom
    showToast('Resume processed successfully. AI models ready for matching.', 'success');
  };

  const handleUploadStart = () => setIsUploading(true);
  const handleUploadEnd = () => setIsUploading(false);

  // Called when user clicks the final "Execute Semantic Analysis" button
  const handleAnalyze = async () => {
    // Stop if they haven't uploaded a document
    if (!resumeUploaded) return;

    setIsUploading(true); // Show the terminal loading screen
    try {
      // We simulate a fake 4-second delay so the user can see the cool Hacker Terminal animation
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Send an empty description or just trigger the match if API expects it
      const response = await matchJobs("");
      
      // Show success message and navigate to the Dashboard, passing the result data along
      showToast('Semantic matching complete. Redirecting to analysis...', 'info');
      navigate('/dashboard', { state: response.data });
    } catch (error) {
      console.error('Analysis failed:', error);
      showToast('Analysis encountered an error. Please check your connection.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Show a loading screen while analyzing
  if (isUploading && resumeUploaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-700">
        <DotPatternBackground />
        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">
           <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">Bypassing Standard Filters</h2>
              <p className="text-slate-500 text-sm font-medium">Please wait while the neural engine constructs your semantic profile.</p>
           </div>
           <ATSTerminal />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-700">
      {/* Professional subtle background */}
      <DotPatternBackground />

      <div className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto w-full"
        >
          {/* Main Title Section */}
          <div className="text-center mb-16 space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              Step into the Future of Careers
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter italic uppercase">
              Match <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">Intelligence</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Our neural engine analyzes your resume against job requirements with 99% accuracy. Upload to begin.
            </p>
          </div>

          {/* Core Input Areas */}
          <div className="flex justify-center mb-16 items-stretch">
            {/* 1. Resume Upload Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col group w-full max-w-lg"
            >
              <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 mb-4 ml-2 uppercase tracking-widest italic opacity-60 group-hover:opacity-100 transition-opacity">01. Neural Resume Input</h3>
              <div className="flex-grow bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[32px] border border-slate-200 dark:border-white/5 shadow-2xl dark:shadow-none p-8 flex flex-col justify-center transition-all duration-500 group-hover:border-blue-500/30">
                <UploadBox
                  onUploadSuccess={handleUploadSuccess}
                  onUploadStart={handleUploadStart}
                  onUploadEnd={handleUploadEnd}
                  onDragOver={() => {}} 
                />
                {resumeUploaded && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-4 bg-emerald-500/10 dark:bg-green-900/20 rounded-2xl text-emerald-600 dark:text-green-400 font-black text-xs uppercase tracking-widest text-center border border-emerald-500/20"
                  >
                    ✓ Data Extracted Successfully
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Action Button Section */}
          <div className="flex flex-col items-center justify-center w-full mt-8">
            <PrimaryButton
              onClick={handleAnalyze}
              disabled={!resumeUploaded || isUploading}
              className={`px-16 py-5 w-full max-w-[450px] shadow-2xl ${
                (!resumeUploaded) ? 'hidden' : ''
              }`}
            >
              🚀 Execute Semantic Analysis
            </PrimaryButton>
            
            {/* Message shown when form is incomplete */}
            {(!resumeUploaded) && (
               <div className="px-12 py-5 w-full max-w-[450px] text-[10px] font-black text-center bg-slate-100 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 rounded-2xl cursor-not-allowed border border-slate-200 dark:border-white/5 uppercase tracking-[0.2em] italic">
                   Upload a document to initialize
               </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>

  );
};

export default UploadResume;

