import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import DotPatternBackground from '../components/DotPatternBackground';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';

import { registerUser } from '../services/api';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const redirectParams = searchParams.get('redirect');
  const redirectUrl = redirectParams || '/upload';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      const response = await registerUser({ fullName, email, password });
      const { token, user } = response.data;
      
      // Store in context (which persists to localStorage)
      login(user, token);
      
      // Navigate to intended destination
      navigate(redirectUrl);
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      <DotPatternBackground />
      
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Soft floating card */}
        <div className="glass-card shadow-2xl dark:shadow-blue-900/10 rounded-3xl p-8 sm:p-10 transform-gpu transition-all duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tightest mb-2 text-slate-900 dark:text-white uppercase italic">
              Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Account</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Join the Top 1% of candidates
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setError(''); }}
                  placeholder="Full Name"
                  className={`w-full bg-transparent border-b-2 ${error ? 'border-red-400/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-cyan-400'} py-3 px-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors duration-300 font-medium`}
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="Email Address"
                  className={`w-full bg-transparent border-b-2 ${error ? 'border-red-400/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-cyan-400'} py-3 px-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors duration-300 font-medium`}
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Password"
                  className={`w-full bg-transparent border-b-2 ${error ? 'border-red-400/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-cyan-400'} py-3 px-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors duration-300 font-medium`}
                />
              </div>
              {error && (
                <div className="text-red-500 text-xs font-bold mt-2 px-2">
                  {error}
                </div>
              )}
            </div>

            <div className="pt-4">
              <PrimaryButton type="submit" className="w-full py-4 text-base" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Initialize User'}
              </PrimaryButton>
            </div>
          </form>

          <div className="mt-8 text-center">
             <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
               Already have an account?{' '}
               <Link to={redirectParams ? `/login?redirect=${encodeURIComponent(redirectParams)}` : "/login"} className="text-blue-600 dark:text-cyan-400 font-bold hover:underline transition-all duration-300">
                 Sign in
               </Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
