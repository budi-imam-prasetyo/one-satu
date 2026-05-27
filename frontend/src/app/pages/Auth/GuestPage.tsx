import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAppContext } from '../../store';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Plus, Shield, Clock, Target, Calendar } from 'lucide-react';
import { formatThousand, parseThousand } from '../../utils/formatNumber';
import { calculateEstimatedDeadline, scheduleLabel } from '../../utils/calculations';
import { ScheduleSelector } from '../../components/ui/ScheduleSelector';

export const GuestPage = () => {
  const navigate = useNavigate();
  const { addTarget } = useAppContext();

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savingAmount, setSavingAmount] = useState('');
  const [savingSchedule, setSavingSchedule] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedDeadlineDate = (() => {
    const target = parseThousand(targetAmount);
    const saving = parseThousand(savingAmount);
    if (!target || !saving) return '';
    const iso = calculateEstimatedDeadline(target, saving, savingSchedule);
    return new Date(iso).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  })();

  const periodsNeeded = (() => {
    const target = parseThousand(targetAmount);
    const saving = parseThousand(savingAmount);
    if (!target || !saving) return 0;
    return Math.ceil(target / saving);
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !savingAmount) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
        
    try {
      await addTarget({
        name,
        targetAmount: parseThousand(targetAmount),
        savingAmount: parseThousand(savingAmount),
        savingSchedule,
        reminderEnabled,
        reminderTime: reminderEnabled ? reminderTime : undefined,
        isGuest: true,
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Gagal membuat target tamu:', err);
      alert('Gagal membuat target. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-background py-12 px-4 sm:px-6 relative bg-grid-pattern">
      {/* Background Glowing Blobs */}
      <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 dark:bg-emerald-950/10 blur-[100px] animate-blob-slow -z-10" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 dark:bg-indigo-950/10 blur-[100px] animate-blob-delayed -z-10" />

      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Sleek Alert Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/10 rounded-2xl p-4 flex items-start gap-3 glass-panel"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0 animate-bounce" />
          <div>
            <h3 className="text-amber-800 dark:text-amber-400 font-bold text-sm">Informasi Mode Tamu</h3>
            <p className="text-amber-700 dark:text-amber-500/80 text-xs mt-1 leading-relaxed font-medium">
              Data target Anda hanya akan disimpan sementara di memori browser ini. Jika browser ditutup atau cache dibersihkan, data Anda akan hilang. Silakan{' '}
              <Link to="/login" className="font-bold underline text-amber-800 dark:text-amber-300 hover:opacity-80">Masuk / Login</Link> untuk sinkronisasi cloud yang aman.
            </p>
          </div>
        </motion.div>

        {/* Form Panel Container */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl border border-slate-200/50 dark:border-neutral-800/60 overflow-hidden glass-panel"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Buat Target Pertamamu</h2>
              <p className="text-xs text-muted-foreground mt-1.5">Rasakan kemudahan mengelola finansial bersama TaGo secara instan</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                  Nama Target / Tujuan Menabung
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-emerald-500 transition-colors">
                    <Target className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Beli Sepatu Basket Baru"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none text-sm"
                    required
                  />
                </div>
              </div>

              {/* Target Amount */}
              <div className="space-y-1.5">
                <label htmlFor="amount" className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                  Target Nominal Dana (Rp)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-emerald-500 transition-colors font-bold text-xs">
                    Rp
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    id="amount"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(formatThousand(e.target.value))}
                    placeholder="1.500.000"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none text-sm font-bold"
                    required
                  />
                </div>
              </div>

              {/* Schedule and Saving amount */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                    Frekuensi Jadwal Menabung
                  </label>
                  <ScheduleSelector value={savingSchedule} onChange={setSavingSchedule} variant="pill" />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="saving-amount" className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                    Setoran per {scheduleLabel(savingSchedule)}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-emerald-500 transition-colors font-bold text-xs">
                      Rp
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      id="saving-amount"
                      value={savingAmount}
                      onChange={(e) => setSavingAmount(formatThousand(e.target.value))}
                      placeholder="100.000"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none text-sm font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Estimated Completion Cards */}
              <AnimatePresence>
                {estimatedDeadlineDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3 mt-2">
                      <Clock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-wider">Perkiraan Selesai</p>
                        <p className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5">{estimatedDeadlineDate}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Membutuhkan <span className="font-bold text-slate-800 dark:text-slate-200">{periodsNeeded} kali</span> menabung rutin.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reminder Switcher */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-slate-50/40 dark:bg-neutral-950/40">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Aktifkan Notifikasi Pengingat</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Dapatkan alarm notifikasi berkala di browser Anda</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReminderEnabled(!reminderEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${reminderEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-neutral-800'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${reminderEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {reminderEnabled && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-3 bg-slate-50/40 dark:bg-neutral-950/40 border-t border-slate-200/50 dark:border-slate-800/50">
                        <label htmlFor="reminder-time" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          Jam Pengingat Harian
                        </label>
                        <input
                          type="time"
                          id="reminder-time"
                          value={reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                          step="60"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none cursor-pointer text-sm font-bold"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
              >
                <Plus className="w-5 h-5 text-slate-950" />
                Mulai Target Impian Ini
              </motion.button>
            </form>
          </div>

          {/* Secure Cloud login notice */}
          <div className="bg-slate-50/60 dark:bg-neutral-950/60 p-5 border-t border-slate-200/50 dark:border-slate-800/50 text-center">
            <Link to="/login" className="inline-flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
              <Shield className="w-4 h-4" />
              Ingin Simpan Permanen? Buat Akun / Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};