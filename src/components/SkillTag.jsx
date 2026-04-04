import { motion } from 'framer-motion';

/**
 * SkillTag Component
 * Displays a skill as a tag with color based on match status
 */
const SkillTag = ({ skill, type = 'matched' }) => {
  const colorClass = type === 'matched' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50';

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`inline-block px-3 py-1 rounded-full border text-sm font-medium mr-2 mb-2 ${colorClass}`}
    >
      {skill}
    </motion.div>
  );
};

export default SkillTag;