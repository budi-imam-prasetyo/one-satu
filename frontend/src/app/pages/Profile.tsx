import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { LogOut, User, Mail, Shield, CalendarIcon } from 'lucide-react';
import { useAppContext } from '../store';

export const Profile = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex-1 bg-background p-4 sm:p-6 lg:p-8 relative bg-grid-pattern min-h-screen">
      <div className="max-w-xl mx-auto space-y-8">

        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4"
          >
            {user?.name ? (
              <span className="text-4xl font-black text-slate-950">{user.name.charAt(0).toUpperCase()}</span>
            ) : (
              <User className="w-12 h-12 text-slate-950" />
            )}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight"
          >
            {user ? user.name : 'Tamu'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm text-muted-foreground mt-1"
          >
            {user?.email || 'Akun Tamu Sementara'}
          </motion.p>
        </div>

        {/* User Card Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-[2rem] border border-slate-200/50 dark:border-neutral-800/60 p-1 glass-panel"
        >
          <div className="p-5 flex items-center gap-4 border-b border-slate-200/30 dark:border-slate-800/30 bg-slate-50/50 dark:bg-neutral-950/50 rounded-t-[1.8rem]">
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nama Akun</p>
              <p className="text-sm font-black text-slate-900 dark:text-white truncate mt-0.5">{user?.name || 'User Tanpa Nama'}</p>
            </div>
          </div>

          <div className="p-5 flex items-center gap-4 border-b border-slate-200/30 dark:border-slate-800/30">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</p>
              <p className="text-sm font-black text-slate-900 dark:text-white truncate mt-0.5">{user?.email || '-'}</p>
            </div>
          </div>

          <div className="p-5 flex items-center gap-4 bg-slate-50/50 dark:bg-neutral-950/50 rounded-b-[1.8rem]">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status Akun</p>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {user ? (user.isGuest ? 'Sesi Tamu' : 'Terkonfirmasi') : 'Tidak Diketahui'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Global actions */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-2xl p-4 font-bold transition-all shadow-lg shadow-red-500/20 active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5" />
            Keluar Akun
          </button>
        </motion.div>

      </div>
    </div>
  );
};

