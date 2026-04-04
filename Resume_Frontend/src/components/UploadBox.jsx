import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { uploadResume } from '../services/api';
import PrimaryButton from './PrimaryButton';

/**
 * UploadBox Component
 * Handles file upload with drag and drop functionality.
 * This component has been upgraded with Premium 3D Effects to impress judges at Hacknovate!
 * Backend team: Calls uploadResume API with FormData
 * Database team: Handle file storage and metadata
 */
const UploadBox = ({ onUploadSuccess, onUploadStart, onUploadEnd, onUploadError }) => {
  // 📚 EXPLANATION FOR TEAM: We use React state to keep track of the file, drag status, and errors.
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  // 📚 EXPLANATION FOR TEAM: We use a ref to point to the hidden <input type="file"> so we can trigger it via a custom button.
  const fileInputRef = useRef();

  // 🚀 3D MOUSE TRACKING (Framer Motion)
  // We track the mouse position relative to the box to tilt it in 3D space when hovered!
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Create smooth animated springs for the rotation so it feels premium and weighty
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  // Transform mouse values into actual 3D rotation degrees (max 10 degrees tilt)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // 🖱️ Handle Mouse Movement for 3D Tilt
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate mouse position as a percentage from center (-0.5 to 0.5)
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  // Reset rotation when mouse leaves the component
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Handle when user drags file over drop zone
  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop by preventing default behavior
    setIsDragging(true); // Show visual feedback (glow effect)
  };

  // Handle when user drags file away from drop zone
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false); // Remove visual feedback
  };

  // Handle when user drops file on drop zone
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Get the first dropped file from dataTransfer
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  /**
   * Validate and store selected file
   * 📚 EXPLANATION: Checks if file is PDF or DOCX format before accepting it.
   */
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    // Define accepted file types (MIME types for PDF and Word)
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please select a PDF or DOCX file.');
      return;
    }

    // File is valid - store it and clear any previous errors
    setFile(selectedFile);
    setError('');
  };

  /**
   * Upload file to backend server
   * 📚 EXPLANATION: Calls API which sends file. Shows "Processing" while waiting.
   */
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    if (onUploadStart) onUploadStart();
    setError('');

    try {
      const response = await uploadResume(file);
      if (onUploadSuccess) onUploadSuccess(response.data);
    } catch (err) {
      if (onUploadError && err.response?.data) {
        onUploadError(err.response.data);
      }
      const backendError = err.response?.data?.error;
      setError(backendError || 'Upload failed. Please try again.');
    } finally {
      // Always update state when done, whether success or failure
      setIsUploading(false);
      onUploadEnd && onUploadEnd(); 
    }
  };

  return (
    // 📚 EXPLANATION: The outermost container limits the width and centers the box.
    // It also adds "perspective" which is CRUCIAL for 3D transforms to look realistic.
    <div className="max-w-md mx-auto" style={{ perspective: 1200 }}>
      
      {/* 
        🚀 PREMIUM 3D DROP ZONE:
        We use framer-motion's <motion.div> to apply the 3D rotation based on mouse hover.
        This provides an incredibly interactive 'glassy tablet' feel.
      */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d" // This allows child items to pop out in 3D
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative group cursor-pointer"
      >
        {/* Glowing Aura Effect: Only visible when dragging or hovering */}
        <div className={`absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur-[30px] opacity-0 transition-opacity duration-500 ${isDragging ? 'opacity-80' : 'group-hover:opacity-40'} -z-10`}></div>

        {/* 
          Actual Drop Zone Container 
          📚 EXPLANATION: We use Tailwind classes for glassmorphism (backdrop-blur, translucent bg).
        */}
        <div
          className={`relative border-2 border-dashed rounded-[2rem] p-10 text-center shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] ${
            isDragging
              ? 'border-blue-400 bg-white/60 dark:bg-slate-800/80 shadow-[inset_0_0_30px_rgba(59,130,246,0.2)]'
              : 'border-blue-200/50 dark:border-slate-600/50 bg-white/40 dark:bg-slate-900/40 hover:bg-white/50 hover:dark:bg-slate-800/50'
          } backdrop-blur-xl transition-all duration-300 overflow-hidden`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ transform: "translateZ(10px)" }} // Pushes the box slightly forward
        >
          {/* Animated Sheen/Gloss effect moving diagonally */}
          <motion.div 
            className="absolute inset-0 w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/20 to-transparent skew-x-12 z-0 pointer-events-none"
            initial={{ left: '-150%', top: '-150%' }}
            animate={{ left: '100%', top: '100%' }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileSelect(e.target.files[0])}
            accept=".pdf,.docx"
            className="hidden" // We hide the raw input to format it nicely with our own UI
          />
          
          {/* Content Wrapper pushed further in 3D Z-space for depth */}
          <div style={{ transform: "translateZ(30px)" }} className="relative z-10 flex flex-col items-center">
            <motion.div 
              // 📚 EXPLANATION: Make the icon float up and down continuously
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="mb-6 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-slate-800 dark:to-slate-700 p-5 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-white/50 dark:border-slate-600"
            >
              <svg className="h-14 w-14 text-blue-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </motion.div>

            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600 dark:from-cyan-300 dark:to-blue-400 mb-2 drop-shadow-sm">
              {file ? 'File Selected!' : 'Drop Your Resume Here'}
            </h3>
            
            <p className="text-gray-600 dark:text-slate-300 mb-6 text-md font-medium">
              {file ? file.name : (
                <span>
                  Drag & drop, or <button onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }} className="text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-200 underline decoration-2 underline-offset-4 transition-colors">browse</button>
                </span>
              )}
            </p>

            <div className="flex gap-4 items-center mb-2">
              <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">PDF</span>
              <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">DOCX</span>
            </div>
            
            <p className="text-sm font-semibold text-blue-600/80 dark:text-cyan-400/80 mt-2">
              <span className="mr-1">✨</span> AI will automatically extract your skills
            </p>
          </div>
        </div>
      </motion.div>

      {/* 📚 EXPLANATION: Framer Motion helps animate the error message popping in smoothly */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="text-white mt-6 p-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl font-bold shadow-[0_10px_20px_rgba(225,29,72,0.3)] border border-red-400/50"
        >
          {error}
        </motion.div>
      )}

      {/* Show Upload Button ONLY if a file was selected successfully */}
      {file && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          {/* 
            📚 EXPLANATION: Replacing standard button wrapper with a premium 3D clicking wrapper 
            We use whileHover and whileTap for an interactive button press.
          */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ perspective: 1000 }}>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              style={{ transformStyle: "preserve-3d" }}
              className={`relative w-full py-4 px-6 rounded-2xl text-white font-extrabold text-lg tracking-widest uppercase transition-all duration-300
                ${isUploading 
                  ? 'bg-slate-500 cursor-not-allowed transform-none' 
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-[0_15px_30px_rgba(79,70,229,0.4)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.6)]'
                }`}
            >
              {/* Inner 3D Text translation */}
              <div style={{ transform: "translateZ(15px)" }} className="flex items-center justify-center gap-3">
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing via AI...
                  </>
                ) : 'Upload & Analyze Resume'}
              </div>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UploadBox;
