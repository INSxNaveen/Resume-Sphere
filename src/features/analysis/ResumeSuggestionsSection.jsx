import { motion } from 'framer-motion';
import SuggestionCard from '../../components/SuggestionCard';

// ============================================================================
// MOCK DATA
// Example improvements
// ============================================================================
const mockSuggestions = [
  { suggestion: "Use strong Action Verbs: Replace passive language with terms like 'Developed', 'Optimized', or 'Implemented'.", icon: "🚀" },
  { suggestion: "Quantify Impact: Add measurable metrics (e.g., 'Improved performance by 30%' or 'Reduced latency by 200ms').", icon: "📈" },
  { suggestion: "ATS Optimization: Ensure your resume is at least 300 words to allow for proper keyword indexing.", icon: "🔍" },
  { suggestion: "Business Value: Highlight the ROI of your technical projects rather than just the tech stack used.", icon: "💼" },
  { suggestion: "Tailor Summary: Directly address the top 3 requirements of the Job Description in your opening statement.", icon: "🎯" }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
/**
 * ResumeSuggestionsSection
 * 
 * Displays actionable suggestions to improve the user's resume ATS score.
 * Fixed whileInView Framer Motion bugs by converting to standard entrance animations.
 */
const ResumeSuggestionsSection = ({ suggestions = mockSuggestions }) => {
  return (
    <div className="w-full relative z-10 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-3xl blur-3xl -z-10" />

        {/* Container */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          
          <div className="mb-8 border-b border-gray-200 dark:border-slate-700/50 pb-6 relative z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 flex items-center gap-3 drop-shadow-sm">
              <span className="text-3xl inline-block text-black dark:text-white">✨</span> 
              Resume Improvements
            </h2>
            <p className="mt-3 text-gray-700 dark:text-gray-300 text-base font-medium">
              Quick changes you can make right now to drastically increase your ATS match score without writing any code.
            </p>
          </div>

          {/* Staggered Grid Rendering */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
            {suggestions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <SuggestionCard suggestion={item.suggestion} icon={item.icon} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeSuggestionsSection;
