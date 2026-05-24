import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAppContext } from '../../store';
import { motion } from 'motion/react';
import { Wallet, Mail, Lock, Eye, EyeOff } from 'lucide-react';
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

        // ambil profile user dari google
        const googleUser = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            }
        );

        const profile = googleUser.data;

        // kirim ke backend
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

        // simpan jwt aplikasi
        localStorage.setItem('access_token', access_token);

        // simpan user ke context
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
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-neutral-50 dark:bg-neutral-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl shadow-neutral-200/50 dark:shadow-black/30 border border-neutral-100 dark:border-neutral-800 overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-4">
              <Wallet className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Selamat Datang</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">Masuk untuk melanjutkan ke TaGo</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Google Login */}
          <button onClick={() => googleLogin()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 py-3.5 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors mb-6 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-neutral-300 border-t-emerald-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {isLoading ? 'Menghubungkan...' : 'Login dengan Google'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">Atau masuk dengan email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@example.com"
                  autoComplete="email"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata sandi Anda"
                  autoComplete="current-password"
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Masuk...
                </span>
              ) : 'Masuk'}
            </button>
          </form>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 px-8 py-6 border-t border-neutral-100 dark:border-neutral-700 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
