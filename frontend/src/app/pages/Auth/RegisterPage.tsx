import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAppContext } from '../../store';
import { motion } from 'motion/react';
import { Wallet, User, AtSign, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import * as authService from '../../services/authService';

type FieldErrors = {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
};

const validateForm = (
  name: string,
  username: string,
  email: string,
  password: string,
  passwordConfirmation: string
): FieldErrors => {
  const errors: FieldErrors = {};
  if (!name.trim() || name.trim().length < 2) errors.name = 'Nama minimal 2 karakter.';
  if (!username.trim() || username.trim().length < 3) errors.username = 'Username minimal 3 karakter.';
  if (!/^[a-z0-9_]+$/.test(username)) errors.username = 'Username hanya huruf kecil, angka, dan underscore.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Format email tidak valid.';
  if (password.length < 8) errors.password = 'Kata sandi minimal 8 karakter.';
  if (passwordConfirmation !== password) errors.passwordConfirmation = 'Konfirmasi kata sandi tidak cocok.';
  return errors;
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');

  const handleUsernameChange = (val: string) => {
    setUsername(val.toLowerCase().replace(/[^a-z0-9_]/g, ''));
  };

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 6) return 'weak';
    if (password.length < 10 || !/[0-9]/.test(password)) return 'medium';
    return 'strong';
  })();

  const strengthColor = {
    weak: 'bg-red-500',
    medium: 'bg-amber-500',
    strong: 'bg-emerald-500',
  };
  const strengthLabel = {
    weak: 'Lemah',
    medium: 'Sedang',
    strong: 'Kuat',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const errors = validateForm(name, username, email, password, passwordConfirmation);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);

    try {
      // ── Real API call (uncomment when backend is ready) ──────────────────
      // const { user } = await authService.registerUser({ name, username, email, password });
      // login({ id: user.id, name: user.name, username: user.username ?? undefined, email: user.email ?? '' });
      // ────────────────────────────────────────────────────────────────────

      const { user } = await authService.registerUser({ name, username, email, password });
      login({ id: user.id, name: user.name, username: user.username ?? undefined, email: user.email ?? '' });
      navigate('/dashboard');
    } catch {
      setServerError('Pendaftaran gagal. Email atau username mungkin sudah digunakan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-neutral-50 dark:bg-neutral-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl shadow-neutral-200/50 dark:shadow-black/30 border border-neutral-100 dark:border-neutral-800 overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-4">
              <Wallet className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Buat Akun</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">Mulai perjalanan menabungmu bersama TaGo</p>
          </div>

          {serverError && (
            <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Nama Lengkap */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <input
                  type="text"
                  id="reg-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Budi Santoso"
                  autoComplete="name"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${fieldErrors.name ? 'border-red-400 dark:border-red-600' : 'border-neutral-300 dark:border-neutral-700'} bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none`}
                />
              </div>
              {fieldErrors.name && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{fieldErrors.name}</p>}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="reg-username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <AtSign className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <input
                  type="text"
                  id="reg-username"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="budisantoso"
                  autoComplete="username"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${fieldErrors.username ? 'border-red-400 dark:border-red-600' : 'border-neutral-300 dark:border-neutral-700'} bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none`}
                />
                {username && !fieldErrors.username && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                )}
              </div>
              {fieldErrors.username
                ? <p className="mt-1 text-xs text-red-500 dark:text-red-400">{fieldErrors.username}</p>
                : <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">Huruf kecil, angka, dan underscore saja</p>
              }
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <input
                  type="email"
                  id="reg-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@example.com"
                  autoComplete="email"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${fieldErrors.email ? 'border-red-400 dark:border-red-600' : 'border-neutral-300 dark:border-neutral-700'} bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none`}
                />
              </div>
              {fieldErrors.email && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  autoComplete="new-password"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border ${fieldErrors.password ? 'border-red-400 dark:border-red-600' : 'border-neutral-300 dark:border-neutral-700'} bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{fieldErrors.password}</p>}

              {passwordStrength && !fieldErrors.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {(['weak', 'medium', 'strong'] as const).map((level, i) => (
                      <div
                        key={level}
                        className={`flex-1 h-1 rounded-full transition-colors ${
                          i <= (['weak', 'medium', 'strong'].indexOf(passwordStrength))
                            ? strengthColor[passwordStrength]
                            : 'bg-neutral-200 dark:bg-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Kekuatan: <span className={`font-medium ${passwordStrength === 'weak' ? 'text-red-500' : passwordStrength === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`}>{strengthLabel[passwordStrength]}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Konfirmasi Kata Sandi */}
            <div>
              <label htmlFor="reg-password-confirmation" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  id="reg-password-confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  autoComplete="new-password"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border ${fieldErrors.passwordConfirmation ? 'border-red-400 dark:border-red-600' : passwordConfirmation && passwordConfirmation === password ? 'border-emerald-400 dark:border-emerald-600' : 'border-neutral-300 dark:border-neutral-700'} bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  {showPasswordConfirmation ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.passwordConfirmation
                ? <p className="mt-1 text-xs text-red-500 dark:text-red-400">{fieldErrors.passwordConfirmation}</p>
                : passwordConfirmation && passwordConfirmation === password
                  ? <p className="mt-1 text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Kata sandi cocok</p>
                  : null
              }
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Membuat Akun...
                </span>
              ) : 'Buat Akun'}
            </button>
          </form>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 px-8 py-6 border-t border-neutral-100 dark:border-neutral-700 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
              Masuk sekarang
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
