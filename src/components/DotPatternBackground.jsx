// This component provides a premium animated Mesh Gradient background
// PERF: Replaced Framer Motion animate on giant blurred orbs with pure CSS @keyframes
// so they run on the browser's compositor thread instead of Framer's JS scheduler.
import React from "react";
import { useTheme } from "../context/ThemeContext";

const DotPatternBackground = () => {
  const { theme } = useTheme();

  return (
    <>
      {/* Base layer: CSS Mesh Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-1000">
        {/* Animated Glowing Orbs using pure CSS animations for compositor-level perf */}
        <div
          className={`absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[120px] opacity-40 will-change-transform animate-orb-drift-1 ${
            theme === 'dark' ? 'bg-purple-900/40' : 'bg-indigo-200'
          }`}
        />
        <div
          className={`absolute top-[10%] right-[-10%] w-[50vw] h-[50vh] rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[120px] opacity-40 will-change-transform animate-orb-drift-2 ${
            theme === 'dark' ? 'bg-blue-900/40' : 'bg-cyan-200'
          }`}
        />
        <div
          className={`absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vh] rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[140px] opacity-30 will-change-transform animate-orb-drift-3 ${
            theme === 'dark' ? 'bg-cyan-900/30' : 'bg-blue-100'
          }`}
        />
        {/* Light Tech Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>
    </>
  );
};

export default DotPatternBackground;
