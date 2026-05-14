import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAppContext } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Target, TrendingUp, X, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { formatThousand, parseThousand, formatRupiahFull } from '../utils/formatNumber';
import { calculateEstimatedDeadline, scheduleLabel } from '../utils/calculations';
import { ImageUpload } from '../components/ui/ImageUpload';
import { ScheduleSelector } from '../components/ui/ScheduleSelector';

const SkeletonCard = () => (
  <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-pulse">
    <div className="w-full h-32 bg-neutral-200 dark:bg-neutral-800" />
    <div className="p-6 space-y-3">
      <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-3/4" />
      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-8" />
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2.5" />
      </div>
    </div>
  </div>
);

export const Dashboard = () => {
  const { user, targets, addTarget, isLoading } = useAppContext();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'berlangsung' | 'tercapai'>('berlangsung');

  // Create form state
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savingAmount, setSavingAmount] = useState('');
  const [savingSchedule, setSavingSchedule] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:00');

  const totalSaved = targets.reduce((acc, curr) => acc + curr.currentAmount, 0);
  const activeTargets = targets.filter(t => t.currentAmount < t.targetAmount).length;
  const completedTargets = targets.filter(t => t.currentAmount >= t.targetAmount).length;
  const filteredTargets = targets.filter(t =>
    filter === 'berlangsung' ? t.currentAmount < t.targetAmount : t.currentAmount >= t.targetAmount
  );

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

  const resetForm = () => {
    setImage('');
    setName('');
    setTargetAmount('');
    setSavingAmount('');
    setSavingSchedule('monthly');
    setReminderEnabled(false);
    setReminderTime('08:00');
  };

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !savingAmount) return;

    addTarget({
      name,
      targetAmount: parseThousand(targetAmount),
      savingAmount: parseThousand(savingAmount),
      savingSchedule,
      reminderEnabled,
      reminderTime: reminderEnabled ? reminderTime : undefined,
      image: image || undefined,
      isGuest: false,
    });

    setIsModalOpen(false);
    resetForm();
  };

  React.useEffect(() => {
    if (!isLoading && !user && targets.length === 0) {
      navigate('/login');
    }
  }, [user, targets, isLoading, navigate]);

  if (!isLoading && !user && targets.length === 0) {
    return null;
  }

  return (
    <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {!user && targets.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-amber-800 dark:text-amber-300 font-medium">Anda sedang dalam Mode Tamu</h3>
                <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">Data target ini akan hilang jika browser ditutup. Login untuk menyimpannya.</p>
              </div>
            </div>
            <Link to="/login" className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors whitespace-nowrap">
              Login Sekarang
            </Link>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">Halo, {user ? user.name.split(' ')[0] : 'Tamu'}! 👋</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">Mari lanjutkan progres menabungmu hari ini.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Buat Target Baru
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="col-span-2 md:col-span-1 bg-white dark:bg-neutral-900 p-5 md:p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center gap-4"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Total Tabungan</p>
              <h3 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100 truncate">{formatRupiahFull(totalSaved)}</h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="col-span-1 bg-white dark:bg-neutral-900 p-5 md:p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
              <Target className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-0.5 sm:mb-1">Target Aktif</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{activeTargets}</h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="col-span-1 bg-white dark:bg-neutral-900 p-5 md:p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-0.5 sm:mb-1">Target Tercapai</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{completedTargets}</h3>
            </div>
          </motion.div>
        </div>

        {/* Targets List */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Target Tabunganmu</h2>
            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setFilter('berlangsung')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === 'berlangsung'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
              >
                Berlangsung
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === 'berlangsung' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'}`}>
                  {activeTargets}
                </span>
              </button>
              <button
                onClick={() => setFilter('tercapai')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === 'tercapai'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
              >
                Tercapai
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === 'tercapai' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'}`}>
                  {completedTargets}
                </span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : targets.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 border-dashed">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">Belum ada target</h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-6">Mulai perjalanan menabungmu dengan membuat target pertamamu sekarang.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-5 py-2.5 rounded-xl font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Buat Target
              </button>
            </div>
          ) : filteredTargets.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 border-dashed">
              <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 rounded-full flex items-center justify-center mx-auto mb-4">
                {filter === 'berlangsung' ? <Target className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
              </div>
              <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                {filter === 'berlangsung' ? 'Tidak ada target berlangsung' : 'Belum ada target tercapai'}
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xs mx-auto">
                {filter === 'berlangsung' ? 'Semua target sudah tercapai!' : 'Terus semangat menabung untuk mencapai targetmu.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTargets.map(target => {
                const percentage = Math.min(100, Math.round((target.currentAmount / target.targetAmount) * 100));
                const isCompleted = target.currentAmount >= target.targetAmount;

                return (
                  <Link
                    key={target.id}
                    to={`/target/${target.id}`}
                    className="group bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all relative overflow-hidden flex flex-col"
                  >
                    {isCompleted && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                        Tercapai
                      </div>
                    )}
                    {target.image && (
                      <div className="w-full h-32 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <img src={target.image} alt={target.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{target.name}</h3>
                        {target.estimatedDeadline && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                            Estimasi: {new Date(target.estimatedDeadline).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="mt-4 mb-2 flex justify-between items-end">
                          <div className="text-sm">
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">{formatRupiahFull(target.currentAmount)}</span>
                            <span className="text-neutral-500 dark:text-neutral-400 text-xs ml-1">/ {formatRupiahFull(target.targetAmount)}</span>
                          </div>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{percentage}%</span>
                        </div>

                        <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden">
                          <div className="h-2.5 rounded-full bg-emerald-500" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Target Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => { setIsModalOpen(false); resetForm(); }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-neutral-100 dark:border-neutral-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Buat Target Baru</h3>
                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <form onSubmit={handleCreateTarget} className="space-y-5">
                  <ImageUpload value={image} onChange={setImage} variant="compact" />

                  <div>
                    <label htmlFor="modal-name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Nama Target
                    </label>
                    <input
                      type="text"
                      id="modal-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Dana Darurat"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-amount" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Target Nominal (Rp)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-neutral-500 dark:text-neutral-400 font-medium">Rp</span>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        id="modal-amount"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(formatThousand(e.target.value))}
                        placeholder="1.000.000"
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Jadwal Menabung
                    </label>
                    <ScheduleSelector value={savingSchedule} onChange={setSavingSchedule} variant="pill" />

                    <label htmlFor="modal-saving-amount" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 mt-3">
                      Nominal per {scheduleLabel(savingSchedule)}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-neutral-500 dark:text-neutral-400 font-medium">Rp</span>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        id="modal-saving-amount"
                        value={savingAmount}
                        onChange={(e) => setSavingAmount(formatThousand(e.target.value))}
                        placeholder="100.000"
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none"
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
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Dapatkan notifikasi rutin untuk menabung</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReminderEnabled(!reminderEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          reminderEnabled ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-600'
                        }`}
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
                            <label htmlFor="modal-reminder-time" className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              Jam Pengingat <span className="text-xs font-normal text-neutral-400">(Format 24 jam)</span>
                            </label>
                            <input
                              type="time"
                              id="modal-reminder-time"
                              value={reminderTime}
                              onChange={(e) => setReminderTime(e.target.value)}
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

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setIsModalOpen(false); resetForm(); }}
                      className="flex-1 px-4 py-2.5 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
