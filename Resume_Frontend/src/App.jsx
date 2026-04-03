import React, { Suspense, lazy } from 'react';
// Import React Router components for client-side navigation
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Import Navbar component - displayed on all pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Import ThemeProvider for global light/dark mode management
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading for optimized initial performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const AnalysisHistory = lazy(() => import('./pages/AnalysisHistory'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const UploadResume = lazy(() => import('./pages/UploadResume'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LearningHub = lazy(() => import('./pages/LearningHub'));
const InterviewPrep = lazy(() => import('./pages/InterviewPrep'));
const SkillDetail = lazy(() => import('./pages/SkillDetail'));

/**
 * LoadingFallback - Minimal component to show during chunk loading
 * Designed to be ultra-lightweight for low-performance devices
 */
const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
  </div>
);

/**
 * AppContent Component 
 * This component controls the layout and the Page Transitions (sliding animations between pages)
 */
function AppContent() {
  // 'location' tracks the current URL we are on
  const location = useLocation();
  
  return (
    <div className="relative z-10 min-h-screen 
                    bg-gray-50 text-gray-900 
                    dark:bg-slate-950 dark:text-white
                    transition-colors duration-500 flex flex-col">
      {/* Navigation bar - visible on all pages */}
      <Navbar />
      
      {/* Main content area with AnimatePresence for smooth transitions */}
      <main className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* 
                PERF: UI OVERHAUL.
                Added relative wrapper. Enforced `absolute inset-0` on outgoing components 
                during exit transitions to guarantee Zero Cumulative Layout Shift (CLS).
                Strictly animating only `opacity` and `transform` properties for 60fps hardware acceleration.
              */}
              <Route path="/" element={
                 <div className="relative w-full h-full min-h-screen">
                    <motion.div 
                      key="landing"
                      className="w-full h-full"
                      initial={{ opacity: 0, y: 15 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -15, position: 'absolute', top: 0, left: 0, right: 0 }} 
                      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <LandingPage />
                    </motion.div>
                 </div>
              } />

              <Route path="/history" element={
                <ProtectedRoute>
                  <div className="relative w-full h-full min-h-screen">
                      <motion.div 
                        key="history"
                        className="w-full h-full"
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -15, position: 'absolute', top: 0, left: 0, right: 0 }} 
                        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                      >
                        <AnalysisHistory />
                      </motion.div>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/login" element={
                <div className="relative w-full h-full min-h-screen">
                    <motion.div 
                      key="login"
                      className="w-full h-full"
                      initial={{ opacity: 0, y: 15 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -15, position: 'absolute', top: 0, left: 0, right: 0 }} 
                      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <Login />
                    </motion.div>
                </div>
              } />

              <Route path="/register" element={
                <div className="relative w-full h-full min-h-screen">
                    <motion.div 
                      key="register"
                      className="w-full h-full"
                      initial={{ opacity: 0, y: 15 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -15, position: 'absolute', top: 0, left: 0, right: 0 }} 
                      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <Register />
                    </motion.div>
                </div>
              } />

              <Route path="/forgot-password" element={
                <div className="relative w-full h-full min-h-screen">
                    <motion.div 
                      key="forgot-password"
                      className="w-full h-full"
                      initial={{ opacity: 0, y: 15 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -15, position: 'absolute', top: 0, left: 0, right: 0 }} 
                      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <ForgotPassword />
                    </motion.div>
                </div>
              } />
              
              <Route path="/upload" element={
                <ProtectedRoute>
                  <div className="relative w-full h-full min-h-screen">
                      <motion.div 
                        key="upload"
                        className="w-full h-full"
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -15, position: 'absolute', top: 0, left: 0, right: 0 }} 
                        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                      >
                        <UploadResume />
                      </motion.div>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/dashboard" element={
                <div className="relative w-full h-full min-h-screen">
                    <motion.div 
                      key="dashboard"
                      className="w-full h-full"
                      initial={{ opacity: 0, y: 15 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -15, position: 'absolute', top: 0, left: 0, right: 0 }} 
                      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <Dashboard />
                    </motion.div>
                </div>
              } />

              <Route path="/learning-hub" element={
                <div className="relative w-full h-full min-h-screen">
                    <motion.div 
                      key="learning"
                      className="w-full h-full"
                      initial={{ opacity: 0, y: 15 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -15, position: 'absolute', top: 0, left: 0, right: 0 }} 
                      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <LearningHub />
                    </motion.div>
                </div>
              } />

              <Route path="/interview-prep" element={
                <div className="relative w-full h-full min-h-screen">
                    <motion.div 
                      key="interview"
                      className="w-full h-full"
                      initial={{ opacity: 0, y: 15 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -15, position: 'absolute', top: 0, left: 0, right: 0 }} 
                      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <InterviewPrep />
                    </motion.div>
                </div>
              } />

              <Route path="/skill/:skillName" element={
                <div className="relative w-full h-full min-h-screen">
                    <motion.div 
                      key="skill"
                      className="w-full h-full"
                      initial={{ opacity: 0, y: 15 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -15, position: 'absolute', top: 0, left: 0, right: 0 }} 
                      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <SkillDetail />
                    </motion.div>
                </div>
              } />
              
              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      
      {/* Professional SaaS Footer */}
      <Footer />
    </div>
  );
}

/**
 * App Component - The absolutely main wrapper of your entire application.
 * Handles the Router (URLs), Theme (Light/Dark mode), and Toast messages.
 */
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Router>
              <ScrollToTop />
              <AppContent />
            </Router>
          </ErrorBoundary>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;