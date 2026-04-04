import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DotPatternBackground from '../components/DotPatternBackground';
import PrimaryButton from '../components/PrimaryButton';
import { sendOtp, verifyOtp } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Clear any existing session to prevent conflicting states during/after reset
  React.useEffect(() => {
    logout();
  }, [logout]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await sendOtp(email);
      setMessage(response.data?.message || 'OTP sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await verifyOtp(email, otp, newPassword);
      setMessage(response.data?.message || 'Password reset successful!');
      
      // Give the user a moment to read the success message before redirecting
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Invalid OTP or failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      <DotPatternBackground />
      
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-card shadow-2xl dark:shadow-blue-900/10 rounded-3xl p-8 sm:p-10 transform-gpu transition-all duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tightest mb-2 text-slate-900 dark:text-white uppercase italic">
              Reset <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Password</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {step === 1 ? 'Enter your email to receive an OTP' : 'Enter your OTP and new password'}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="Email Address"
                    disabled={loading}
                    className={`w-full bg-transparent border-b-2 ${error ? 'border-red-400/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-cyan-400'} py-3 px-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors duration-300 font-medium`}
                  />
                </div>
              </div>

              {error && <div className="text-red-500 text-xs font-bold mt-2 px-2">{error}</div>}
              {message && <div className="text-green-500 text-xs font-bold mt-2 px-2">{message}</div>}

              <div className="pt-4">
                <PrimaryButton type="submit" disabled={loading} className="w-full py-4 text-base">
                  {loading ? 'Sending...' : 'Send OTP'}
                </PrimaryButton>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-4">
                <div className="relative text-left">
                  <span className="text-xs text-slate-500 mb-1 block px-2">OTP sent to: {email}</span>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value); setError(''); }}
                    placeholder="6-digit OTP"
                    disabled={loading}
                    className={`w-full bg-transparent border-b-2 ${error ? 'border-red-400/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-cyan-400'} py-3 px-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors duration-300 font-medium`}
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                    placeholder="New Password"
                    disabled={loading}
                    className={`w-full bg-transparent border-b-2 ${error ? 'border-red-400/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-cyan-400'} py-3 px-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors duration-300 font-medium`}
                  />
                </div>
              </div>

              {error && <div className="text-red-500 text-xs font-bold mt-2 px-2">{error}</div>}
              {message && <div className="text-green-500 text-xs font-bold mt-2 px-2">{message}</div>}

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="w-1/3 py-4 text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  Back
                </button>
                <PrimaryButton type="submit" disabled={loading} className="w-2/3 py-4 text-base">
                  {loading ? 'Verifying...' : 'Reset Password'}
                </PrimaryButton>
              </div>
            </form>
          )}

          <div className="mt-8 text-center">
             <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
               Remember your password?{' '}
               <Link to="/login" className="text-blue-600 dark:text-cyan-400 font-bold hover:underline transition-all duration-300">
                 Sign in
               </Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
