// This is the Home/Landing page of the application
// Upgraded to a Top 1% Architecture: Features a massive 3D Hero Mockup and Asymmetric Bento Grid
import { motion, useScroll, useTransform } from 'framer-motion';
import { Suspense, lazy } from 'react';
import FloatingSkillTag from '../components/FloatingSkillTag';
import DotPatternBackground from '../components/DotPatternBackground';
import usePerformanceMode from '../hooks/usePerformanceMode';

// Lazy load components
const BentoGrid = lazy(() => import('../components/BentoGrid'));
const ParallaxHero = lazy(() => import('../components/ParallaxHero'));
const ModernCursor = lazy(() => import('../components/ModernCursor'));
const CursorSpotlight = lazy(() => import('../components/CursorSpotlight'));
const ExplanatorySection = lazy(() => import('../components/ExplanatorySection'));

/**
 * LandingPage - This is the first page users see (The Home Page).
 * It shows the main hero section and the features below.
 */
const LandingPage = () => {
  // We use Framer Motion for scroll animations (making things move as you scroll down)
  const { scrollY } = useScroll();
  const heroTranslateY = useTransform(scrollY, [0, 800], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  
  const { isLowPerformance, shouldEnableEnhancements, canUsePointerEffects } = usePerformanceMode();

  const heroContent = (
    // This is the main big section at the top of the page
    <section className="relative flex flex-col items-center justify-center overflow-hidden min-h-screen pt-20 pb-20">
      {/* Floating Accents orbiting the Hero Mockup - These are the floating skill pills (React, Python, etc.) */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <FloatingSkillTag skill="React" delay={0.2} x={5} y={30} />
        <FloatingSkillTag skill="Python" delay={0.4} x={92} y={35} />
        <FloatingSkillTag skill="SQL" delay={0.3} x={8} y={65} />
        <FloatingSkillTag skill="Docker" delay={0.5} x={88} y={60} />
        <FloatingSkillTag skill="AWS" delay={0.35} x={50} y={15} />
      </div>

      <motion.div 
        style={{ y: heroTranslateY, opacity: heroOpacity }}
        className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pointer-events-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-black tracking-[0.3em] uppercase text-[10px] mb-8 shadow-xl shadow-blue-500/10 backdrop-blur-xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Neural Match Engine v2.0
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 50 }}
          className="text-fluid-h1 font-black mb-8 tracking-tighter text-slate-950 dark:text-white leading-[1.1] md:leading-[1.1] -mt-2"
        >
          <span className="text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-slate-500 block">
            Understand{' '}Improve
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-500 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400 block mt-2">
            Get-Hired
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg sm:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto font-medium leading-relaxed"
        >
          ResumeSphere helps students and early job seekers analyze resume fit, detect missing skills, and get practical guidance on what to learn, build, and improve next.
        </motion.p>

      </motion.div>
    </section>
  );

  return (
    <div className="relative overflow-hidden">
      {/* Base Universal Engine */}
      <DotPatternBackground />

      {shouldEnableEnhancements && canUsePointerEffects ? (
        <Suspense fallback={null}>
          <CursorSpotlight />
          <ModernCursor />
        </Suspense>
      ) : null}

      {/* ===== HERO SECTION ===== */}
      {shouldEnableEnhancements && !isLowPerformance ? (
        <Suspense fallback={heroContent}>
          <ParallaxHero>{heroContent}</ParallaxHero>
        </Suspense>
      ) : (
        heroContent
      )}

      {/* ===== EXPLANATORY SECTION ===== */}
      <div id="features">
        <Suspense fallback={<div className="h-96 w-full flex items-center justify-center">Loading Content...</div>}>
          <ExplanatorySection />
        </Suspense>
      </div>

      {/* ===== BENTO GRID FEATURES SECTION ===== */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1 }}
        className="relative bg-white dark:bg-slate-950 transition-colors duration-1000 border-t border-slate-200 dark:border-white/5 py-32"
      >
        <div className="max-w-7xl mx-auto px-4 mb-20 text-center">
          <h2 className="text-fluid-h2 font-black tracking-tighter italic uppercase text-slate-900 dark:text-white mb-6">
            Built to Help You <span className="text-blue-600">Improve</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto italic uppercase tracking-widest text-xs">
            A simple way to analyze your resume and get practical career guidance.
          </p>
        </div>
        <Suspense fallback={<div className="h-screen" />}>
          <BentoGrid />
        </Suspense>
      </motion.section>
    </div>
  );
};

export default LandingPage;
