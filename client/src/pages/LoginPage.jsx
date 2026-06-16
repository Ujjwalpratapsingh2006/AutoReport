import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, AlertCircle, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const validateForm = () => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.push('email');
    if (password.length < 6) errors.push('password');
    return errors;
  };

  const triggerError = (msg, fields = []) => {
    setError(msg);
    setInvalidFields(fields);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setInvalidFields([]);
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      triggerError("Please enter a valid email and a password of at least 6 characters.", validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.user, data.accessToken);
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      triggerError(err.message || 'An error occurred during login', ['email', 'password']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sec-dark relative overflow-hidden font-sans flex items-center justify-center">
      {/* Background Glows (matches Landing Page) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-sec-cyan rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-sec-teal rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        {/* Toast Notification */}
        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 w-full glass-panel transition-all">
            <AlertCircle size={20} className="shrink-0 text-rose-400" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="glass-panel border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Top highlight line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sec-cyan to-sec-teal"></div>
          
          <div className="flex justify-center mb-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-sec-cyan to-sec-teal rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                <Activity className="w-5 h-5 text-sec-darker" strokeWidth={3} />
              </div>
              <span className="text-2xl font-black tracking-tight text-white ml-2">
                Auto<span className="text-transparent bg-clip-text bg-gradient-to-r from-sec-cyan to-sec-teal">Report</span>
              </span>
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-white text-center mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-center mb-8 font-light">Sign in to your account.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border ${invalidFields.includes('email') ? 'border-rose-500 focus:ring-rose-500/20' : 'border-white/10 focus:border-sec-cyan focus:ring-sec-cyan/20'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]`}
              />
            </div>
            
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border ${invalidFields.includes('password') ? 'border-rose-500 focus:ring-rose-500/20' : 'border-white/10 focus:border-sec-cyan focus:ring-sec-cyan/20'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]`}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-8 py-3.5 px-4 bg-gradient-to-r from-sec-cyan to-sec-teal hover:from-sec-teal hover:to-sec-cyan text-sec-darker font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {isLoading ? 'Logging in...' : 'Log In'} 
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-400 text-sm font-light">
            Don't have an account?{' '}
            <Link to="/register" className="text-sec-cyan hover:text-sec-teal font-semibold transition-colors">
              Sign up
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
