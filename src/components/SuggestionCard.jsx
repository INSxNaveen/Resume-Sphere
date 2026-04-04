import { motion } from 'framer-motion';

// ============================================================================
// UI COMPONENT
// ============================================================================
/**
 * SuggestionCard Component
 * 
 * Displays a single actionable resume improvement suggestion.
 * Built with a lightweight glassmorphism aesthetic to fit into the Dashboard's 
 * premium UI flow.
 * 
 * Used in the ResumeSuggestionsSection.
 */
const SuggestionCard = ({ suggestion, icon }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        y: -3,
        transition: { type: "spring", stiffness: 300, damping: 12 } 
      }}
      className="group rounded-2xl shadow-sm hover:shadow-lg bg-white/70 dark:bg-slate-900/70 border border-gray-200/50 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-500/50 transition-all duration-300 p-5 flex items-start gap-4 backdrop-blur-xl relative overflow-hidden cursor-default"
    >
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-colors duration-500" />
      
      {/* Animated Emoji Icon */}
      <motion.div 
        whileHover={{ rotate: 15, scale: 1.1 }}
        className="flex-shrink-0 text-3xl text-purple-500 dark:text-purple-400 mt-0.5 relative z-10 drop-shadow-sm"
      >
        {icon || "✨"}
      </motion.div>
      
      {/* Content Text */}
      <div className="relative z-10">
        <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
          {suggestion}
        </p>
      </div>
    </motion.div>
  );
};

export default SuggestionCard;
