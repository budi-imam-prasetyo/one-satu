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
  
  const strengthTextClass = {
    weak: 'text-red-500',
    medium: 'text-amber-500',
    strong: 'text-emerald-500',
  };

  const strengthLabel = {
    weak: 'Sangat Lemah',
    medium: 'Cukup Aman',
    strong: 'Sangat Kuat',
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
      const tempId = localStorage.getItem('guest_temp_id');
      const { user } = await authService.registerUser({
        name,
        username,
        email,
        password,
        tempId: tempId ?? undefined,
      });
      await login({ id: user.id, name: user.name, username: user.username ?? undefined, email: user.email ?? '' });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Pendaftaran gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-background relative bg-grid-pattern">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[10%] right-[20%] w-[350px] h-[350px] rounded-full bg-emerald-500/10 dark:bg-emerald-950/15 blur-[90px] animate-blob-slow -z-10" />
      <div className="absolute bottom-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 dark:bg-indigo-950/15 blur-[90px] animate-blob-delayed -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 90, damping: 15 }}
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-[2.2rem] shadow-2xl border border-slate-200/50 dark:border-neutral-800/60 overflow-hidden glass-panel"
      >
        <div className="p-8">
          <div className="text-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 rounded-2xl mb-4 shadow-lg shadow-emerald-500/20"
            >
              <Wallet className="w-6 h-6 text-slate-950" />
            </motion.div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Buat Akun Baru</h2>
            <p className="text-xs text-muted-foreground mt-1.5">Mulai perjalanan menabung yang teratur di TaGo</p>
          </div>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-2xl text-xs text-red-600 dark:text-red-400 font-medium"
            >
              {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label htmlFor="reg-name" className="block text-xs font-bold text-slate-500 dark:text-slate-400">Nama Lengkap</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-emerald-500 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="reg-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Budi Santoso"
                  autoComplete="name"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border ${
                    fieldErrors.name ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/30 focus:border-emerald-500'
                  } bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 transition-all outline-none text-sm`}
                />
              </div>
              {fieldErrors.name && <p className="text-[10px] text-red-500 font-medium mt-1">{fieldErrors.name}</p>}
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="reg-username" className="block text-xs font-bold text-slate-500 dark:text-slate-400">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-emerald-500 transition-colors">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="reg-username"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="budisantoso"
                  autoComplete="username"
                  className={`w-full pl-11 pr-10 py-3.5 rounded-2xl border ${
                    fieldErrors.username ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/30 focus:border-emerald-500'
                  } bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 transition-all outline-none text-sm`}
                />
                {username && !fieldErrors.username && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                )}
              </div>
              {fieldErrors.username ? (
                <p className="text-[10px] text-red-500 font-medium mt-1">{fieldErrors.username}</p>
              ) : (
                <p className="text-[9px] text-muted-foreground mt-1 tracking-wide font-medium">Hanya huruf kecil, angka, dan garis bawah (_)</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="block text-xs font-bold text-slate-500 dark:text-slate-400">Surel (Email)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-emerald-500 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="reg-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi.santoso@example.com"
                  autoComplete="email"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border ${
                    fieldErrors.email ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/30 focus:border-emerald-500'
                  } bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 transition-all outline-none text-sm`}
                />
              </div>
              {fieldErrors.email && <p className="text-[10px] text-red-500 font-medium mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="reg-password" className="block text-xs font-bold text-slate-500 dark:text-slate-400">Kata Sandi</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-emerald-500 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  autoComplete="new-password"
                  className={`w-full pl-11 pr-11 py-3.5 rounded-2xl border ${
                    fieldErrors.password ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/30 focus:border-emerald-500'
                  } bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 transition-all outline-none text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-[10px] text-red-500 font-medium mt-1">{fieldErrors.password}</p>}

              {passwordStrength && !fieldErrors.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1.5">
                    {(['weak', 'medium', 'strong'] as const).map((level, i) => (
                      <div
                        key={level}
                        className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                          i <= (['weak', 'medium', 'strong'].indexOf(passwordStrength))
                            ? strengthColor[passwordStrength]
                            : 'bg-slate-200 dark:bg-neutral-800'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Kekuatan Sandi:{' '}
                    <span className={`font-black ${strengthTextClass[passwordStrength]}`}>
                      {strengthLabel[passwordStrength]}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Konfirmasi Password */}
            <div className="space-y-1.5">
              <label htmlFor="reg-password-confirmation" className="block text-xs font-bold text-slate-500 dark:text-slate-400">Ulangi Kata Sandi</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-emerald-500 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  id="reg-password-confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  autoComplete="new-password"
                  className={`w-full pl-11 pr-11 py-3.5 rounded-2xl border ${
                    fieldErrors.passwordConfirmation
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : passwordConfirmation && passwordConfirmation === password
                      ? 'border-emerald-500 focus:ring-emerald-500/20 focus:border-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/30 focus:border-emerald-500'
                  } bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 transition-all outline-none text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {showPasswordConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.passwordConfirmation ? (
                <p className="text-[10px] text-red-500 font-medium mt-1">{fieldErrors.passwordConfirmation}</p>
              ) : passwordConfirmation && passwordConfirmation === password ? (
                <p className="text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Konfirmasi kata sandi cocok
                </p>
              ) : null}
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
                  Mendaftarkan Akun...
                </span>
              ) : 'Daftar Sekarang'}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50/60 dark:bg-neutral-950/60 px-8 py-5 border-t border-slate-200/50 dark:border-slate-800/50 text-center">
          <p className="text-xs text-muted-foreground font-medium">
            Sudah terdaftar?{' '}
            <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
              Masuk di Sini
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
