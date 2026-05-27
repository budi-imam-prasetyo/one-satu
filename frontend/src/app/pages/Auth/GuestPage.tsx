import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAppContext } from '../../store';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Plus, Shield, Clock } from 'lucide-react';
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-amber-800 dark:text-amber-300 font-medium">Mode Tamu (Guest Mode)</h3>
            <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
              Data yang Anda masukkan hanya disimpan sementara di browser ini. Untuk menyimpan data secara permanen dan mengaksesnya di perangkat lain, silakan{' '}
              <Link to="/login" className="font-semibold underline">Login</Link>.
            </p>
          </div>
        </motion.div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Buat Target Pertama</h2>
              <p className="text-neutral-500 dark:text-neutral-400 mt-2">Coba fitur TaGo tanpa perlu membuat akun.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Nama Target / Tujuan
                </label>
                <input
                  type="text" id="name"
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Beli Sepatu Baru"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Target Nominal (Rp)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-neutral-500 dark:text-neutral-400">Rp</span>
                  </div>
                  <input
                    type="text" inputMode="numeric" id="amount"
                    value={targetAmount} onChange={(e) => setTargetAmount(formatThousand(e.target.value))}
                    placeholder="500.000"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Jadwal Menabung
                </label>
                <ScheduleSelector value={savingSchedule} onChange={setSavingSchedule} variant="pill" />

                <label htmlFor="saving-amount" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 mt-3">
                  Nominal per {scheduleLabel(savingSchedule)}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-neutral-500 dark:text-neutral-400">Rp</span>
                  </div>
                  <input
                    type="text" inputMode="numeric" id="saving-amount"
                    value={savingAmount} onChange={(e) => setSavingAmount(formatThousand(e.target.value))}
                    placeholder="100.000"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none"
                    required
                  />
                </div>
              </div>

              {estimatedDeadlineDate && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">Perkiraan Selesai</p>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{estimatedDeadlineDate}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                    {periodsNeeded} periode {savingSchedule === 'daily' ? 'hari' : savingSchedule === 'weekly' ? 'minggu' : 'bulan'}
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Aktifkan Pengingat</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Dapatkan notifikasi rutin</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReminderEnabled(!reminderEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${reminderEnabled ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reminderEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
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
                      <div className="px-4 pb-4 pt-3 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
                        <label htmlFor="reminder-time" className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          Jam Pengingat <span className="text-xs font-normal text-neutral-400">(Format 24 jam)</span>
                        </label>
                        <input
                          type="time" id="reminder-time"
                          value={reminderTime} onChange={(e) => setReminderTime(e.target.value)}
                          step="60"
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none cursor-pointer"
                        />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                          Notifikasi akan dikirim setiap {scheduleLabel(savingSchedule).toLowerCase()} pukul {reminderTime}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                Mulai Target Ini
              </button>
            </form>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800 p-6 border-t border-neutral-200 dark:border-neutral-700 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-300">
              <Shield className="w-4 h-4" />
              Simpan & Login untuk Fitur Penuh
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
