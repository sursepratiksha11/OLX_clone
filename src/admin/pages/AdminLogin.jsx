import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FaShieldAlt } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1200));
      if (email.trim() === 'admin@olx.com' && password === 'admin123') {
        login('mock_jwt_token_admin_xyz', 'ADMIN', 'Super Admin');
        toast.success('Welcome back, Super Admin! 🎉');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid credentials. Try admin@olx.com / admin123');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin@olx.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-olx-bg">

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-olx-navy rounded-2xl mb-4 shadow-sm"
            >
              <FaShieldAlt className="text-white text-2xl" />
            </motion.div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-4xl font-black text-olx-navy tracking-tight">OLX</span>
              <span className="bg-olx-lemon text-olx-navy text-xs font-black px-2.5 py-1 rounded-lg tracking-widest">
                ADMIN
              </span>
            </div>
            <p className="text-slate-500 text-sm">Sign in to manage the platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@olx.com"
                  autoComplete="email"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-olx-teal-dark focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:border-olx-teal-dark focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-olx-navy hover:bg-olx-navySoft text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In to Admin Panel'
              )}
            </motion.button>
          </form>

          <div className="mt-5 p-4 bg-[#e7fffd] border border-[#b6f3ef] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-olx-navy text-xs font-semibold uppercase tracking-wide">Demo Credentials</p>
              <button
                onClick={fillDemo}
                className="text-xs text-olx-navy hover:text-olx-navySoft font-medium underline underline-offset-2 transition-colors"
              >
                Auto-fill
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-slate-600 text-xs flex items-center gap-1.5">
                <span className="text-slate-500">📧</span> admin@olx.com
              </p>
              <p className="text-slate-600 text-xs flex items-center gap-1.5">
                <span className="text-slate-500">🔑</span> admin123
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-4">
          OLX Admin Panel © 2026 · Restricted Access
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
