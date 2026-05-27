import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAppContext } from '../../store';
import { motion } from 'motion/react';
import { Wallet, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import * as authService from '../../services/authService';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const tempId = localStorage.getItem('guest_temp_id');
      const { user } = await authService.loginUser({
        email,
        password,
        tempId: tempId ?? undefined,
      });
      await login({ id: user.id, name: user.name, username: user.username ?? undefined, email: user.email ?? '' });
      navigate('/dashboard');
    } catch {
      setError('Email atau kata sandi salah. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        setError('');
        setIsLoading(true);

        const googleUser = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const profile = googleUser.data;

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/google`,
          {
            googleId: profile.sub,
            name: profile.name,
            email: profile.email,
            picture: profile.picture,
            tempId: localStorage.getItem('guest_temp_id') ?? undefined,
          }
        );

        const { access_token, user } = response.data;
        localStorage.setItem('access_token', access_token);

        await login({
          id: user.id,
          name: user.name,
          username: user.username ?? undefined,
          email: user.email ?? '',
        });

        navigate('/dashboard');
      } catch (err) {
        console.error(err);
        setError('Login Google gagal.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError('Login Google dibatalkan.');
    },
  });

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-background relative bg-grid-pattern">
      {/* Background Neon Glow Blobs */}
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-emerald-500/10 dark:bg-emerald-950/15 blur-[90px] animate-blob-slow -z-10" />
      <div className="absolute bottom-[10%] right-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 dark:bg-indigo-950/15 blur-[90px] animate-blob-delayed -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 90, damping: 15 }}
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-[2.2rem] shadow-2xl border border-slate-200/50 dark:border-neutral-800/60 overflow-hidden glass-panel"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 rounded-2xl mb-4 shadow-lg shadow-emerald-500/20"
            >
              <Wallet className="w-6 h-6 text-slate-950" />
            </motion.div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Selamat Datang</h2>
            <p className="text-xs text-muted-foreground mt-1.5">Masuk untuk melanjutkan menabung di TaGo</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-2xl text-xs text-red-600 dark:text-red-400 font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Google Login Button */}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => googleLogin()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-slate-50/60 hover:bg-slate-100/80 dark:bg-neutral-950/60 dark:hover:bg-neutral-950/80 border border-slate-200/60 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 py-3.5 rounded-2xl font-bold text-xs transition-all mb-5 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {isLoading ? 'Menghubungkan...' : 'Masuk Lebih Cepat via Google'}
          </motion.button>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/50 dark:border-slate-800/50" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="px-3 bg-white dark:bg-neutral-900 text-muted-foreground">Atau Akun E-Mail</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-500 dark:text-slate-400">Surel (Email)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-emerald-500 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi.santoso@example.com"
                  autoComplete="email"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-xs font-bold text-slate-500 dark:text-slate-400">Kata Sandi</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-emerald-500 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  autoComplete="current-password"
                  required
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
                  Memproses Masuk...
                </span>
              ) : 'Masuk Sekarang'}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50/60 dark:bg-neutral-950/60 px-8 py-5 border-t border-slate-200/50 dark:border-slate-800/50 text-center">
          <p className="text-xs text-muted-foreground font-medium">
            Belum terdaftar?{' '}
            <Link to="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
              Buat Akun Baru
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
