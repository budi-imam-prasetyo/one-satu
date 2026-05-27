import React, { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAppContext } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Target, TrendingUp, X, CheckCircle2, AlertTriangle, Clock, Loader2, Trash2, ArrowRight, Bell, Sparkles, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { formatThousand, parseThousand, formatRupiahFull } from '../utils/formatNumber';
import { calculateEstimatedDeadline, scheduleLabel } from '../utils/calculations';
import { ImageUpload } from '../components/ui/ImageUpload';
import { ScheduleSelector } from '../components/ui/ScheduleSelector';
import * as targetService from '../services/targetService';
import type { DashboardStats } from '../types/target';

const SkeletonCard = () => (
  <div className="bg-white dark:bg-neutral-900 rounded-[2rem] shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-pulse">
    <div className="w-full h-36 bg-neutral-200 dark:bg-neutral-800" />
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
  const { user, targets: localTargets, addTarget, deleteTarget } = useAppContext();

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targets, setTargets] = useState(localTargets);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingTargets, setIsLoadingTargets] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState('');

  const totalSaved = stats?.totalSavings ?? targets.reduce((acc, curr) => acc + curr.currentAmount, 0);
  const completedTargets = stats?.totalCompleted ?? targets.filter(t => t.currentAmount >= t.targetAmount).length;
  const activeTargets = stats?.totalTargets != null
    ? Math.max(0, stats.totalTargets - stats.totalCompleted)
    : targets.filter(t => t.currentAmount < t.targetAmount).length;

  const filteredTargets = useMemo(() => (
    targets.filter(t =>
      filter === 'berlangsung' ? t.currentAmount < t.targetAmount : t.currentAmount >= t.targetAmount
    )
  ), [targets, filter]);

  const loadTargets = useCallback(async () => {
    if (!user) {
      setTargets(localTargets);
      return;
    }
    setIsLoadingTargets(true);
    try {
      const status = filter === 'berlangsung' ? 'ACTIVE' : 'COMPLETED';
      const apiTargets = await targetService.fetchTargets(status);
      setTargets(apiTargets.map(t => {
        const savingSchedule = t.frequency.toLowerCase() as 'daily' | 'weekly' | 'monthly';
        return {
          id: t.id,
          name: t.title,
          targetAmount: t.targetAmount,
          currentAmount: t.currentAmount,
          savingAmount: t.frequencyAmount,
          savingSchedule,
          estimatedDeadline: calculateEstimatedDeadline(
            t.targetAmount,
            t.frequencyAmount,
            savingSchedule
          ),
          reminderEnabled: false,
          status: t.status.toLowerCase() as 'active' | 'paused' | 'completed',
          deadline: t.deadline ?? undefined,
          image: t.imageUrl ?? undefined,
          isGuest: false,
          history: [],
        };
      }));
    } catch (err) {
      console.error('Failed to load targets:', err);
    } finally {
      setIsLoadingTargets(false);
    }
  }, [user, filter, localTargets]);

  const loadStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      return;
    }
    setIsLoadingStats(true);
    try {
      const apiStats = await targetService.fetchDashboardStats();
      setStats(apiStats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }, [user]);

  const handleDeleteTarget = async () => {
    if (!deleteTargetId) return;
    await deleteTarget(deleteTargetId);
    setDeleteTargetId(null);
    setDeleteTargetName('');
    await Promise.all([loadTargets(), loadStats()]);
  };

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

  const handleCreateTarget = async (e: React.FormEvent) => {
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
        image: image || undefined,
        isGuest: false,
      });
      toast.success('Target berhasil dibuat');
      await Promise.all([loadTargets(), loadStats()]);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Gagal membuat target. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    loadTargets();
    loadStats();
  }, [loadTargets, loadStats]);

  React.useEffect(() => {
    if (!user) {
      setTargets(localTargets);
    }
  }, [user, localTargets]);

  React.useEffect(() => {
    if (user) {
      loadTargets();
    }
  }, [filter, user, loadTargets]);

  return (
    <div className="flex-1 bg-background p-4 sm:p-6 lg:p-8 relative bg-grid-pattern">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Guest Warning Card Banner */}
        {!user && targets.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/10 rounded-2xl p-4 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row glass-panel"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0 animate-pulse" />
              <div>
                <h3 className="text-amber-800 dark:text-amber-400 font-bold text-sm">Mode Tamu Aktif</h3>
                <p className="text-amber-700 dark:text-amber-500/80 text-xs mt-0.5 leading-relaxed font-medium">
                  Seluruh data target Anda tersimpan lokal di browser ini. Hubungkan akun Anda untuk mengamankan data secara permanen.
                </p>
              </div>
            </div>
            <Link to="/login" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md whitespace-nowrap self-stretch sm:self-auto text-center">
              Sinkronisasi Cloud
            </Link>
          </motion.div>
        )}

        {/* Dashboard Header Panel */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">Halo, {user ? user.name.split(' ')[0] : 'Tamu'}! 👋</h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">Pantau, tabung, dan selesaikan target impian Anda hari ini.</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-[0_8px_30px_rgba(16,185,129,0.2)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.45)] whitespace-nowrap w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 text-slate-950" />
            Buat Target Baru
          </motion.button>
        </div>

        {/* Cohesive StatsSummary Grid (W/ Metal Debit Card) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Visual "Debit Metal Card" stat widget */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="md:col-span-1 rounded-[2rem] p-6 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-2xl border border-slate-800 flex flex-col justify-between min-h-[180px] group"
          >
            {/* SVG wave overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute right-[-10%] bottom-[-10%] w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
            
            <div className="flex justify-between items-start z-10">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Dana Terkumpul</p>
                <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-emerald-400 mt-1 break-all">
                  {formatRupiahFull(totalSaved)}
                </h3>
              </div>
              <Wallet className="w-6 h-6 text-slate-400" />
            </div>

            <div className="flex justify-between items-end z-10 pt-4">
              <div>
                <p className="text-[9px] font-mono tracking-widest text-slate-500">TAGO SAVINGS DECK</p>
                <p className="text-[10px] font-bold text-slate-300 mt-0.5">**** **** **** {user ? '8888' : '1337'}</p>
              </div>
              <div className="w-8 h-6 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-md opacity-85 shadow-sm flex items-center justify-center">
                <div className="w-4 h-4 border border-yellow-800/40 rounded-sm" />
              </div>
            </div>
          </motion.div>

          {/* Active target stat */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-neutral-900 rounded-[2rem] p-6 shadow-md border border-slate-200/50 dark:border-neutral-800/60 flex items-center gap-5 glass-panel"
          >
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/10">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Target Berjalan</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight mt-1">{activeTargets}</h3>
            </div>
          </motion.div>

          {/* Completed target stat */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-neutral-900 rounded-[2rem] p-6 shadow-md border border-slate-200/50 dark:border-neutral-800/60 flex items-center gap-5 glass-panel"
          >
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/10">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Target Tercapai</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight mt-1">{completedTargets}</h3>
            </div>
          </motion.div>
        </div>

        {/* Target Tabs & Cards Container */}
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white font-display tracking-tight">Semua Target Tabungan</h2>
            
            {/* Elegant Tab Pills with Gliding Transition */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-950 p-1 rounded-2xl border border-slate-200/30 dark:border-slate-800/30 self-start sm:self-auto relative">
              <button
                onClick={() => setFilter('berlangsung')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all relative ${
                  filter === 'berlangsung'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-muted-foreground hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {filter === 'berlangsung' && (
                  <motion.div
                    layoutId="dashboardFilterPill"
                    className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-slate-200/10 dark:border-slate-700/20 -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="flex items-center gap-1.5">
                  Berlangsung
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${filter === 'berlangsung' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 dark:bg-neutral-900 text-muted-foreground'}`}>
                    {activeTargets}
                  </span>
                </span>
              </button>
              
              <button
                onClick={() => setFilter('tercapai')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all relative ${
                  filter === 'tercapai'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-muted-foreground hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {filter === 'tercapai' && (
                  <motion.div
                    layoutId="dashboardFilterPill"
                    className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-slate-200/10 dark:border-slate-700/20 -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="flex items-center gap-1.5">
                  Tercapai
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${filter === 'tercapai' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-neutral-900 text-muted-foreground'}`}>
                    {completedTargets}
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Cards Render Block */}
          {isLoadingTargets || isLoadingStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : targets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-850 border-dashed glass-panel"
            >
              <div className="w-14 h-14 bg-slate-100 dark:bg-neutral-850 text-muted-foreground rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200/30">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Target Anda Masih Kosong</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-6">Mulai langkah awal untuk mewujudkan gadget, liburan, atau dana darurat dengan membuat target.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Buat Target Pertama
              </button>
            </motion.div>
          ) : filteredTargets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white dark:bg-neutral-900 rounded-[2rem] border border-slate-200/40 dark:border-slate-800/40 border-dashed glass-panel"
            >
              <div className="w-12 h-12 bg-slate-100 dark:bg-neutral-850 text-muted-foreground rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200/30">
                {filter === 'berlangsung' ? <Target className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {filter === 'berlangsung' ? 'Semua Target Telah Tercapai!' : 'Belum Ada Target Tercapai'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-[250px] mx-auto">
                {filter === 'berlangsung' ? 'Luar biasa! Seluruh target Anda sudah terpenuhi 100%.' : 'Terus setorkan tabungan Anda untuk menyelesaikan target.'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTargets.map(target => {
                const percentage = Math.min(100, Math.round((target.currentAmount / target.targetAmount) * 100));
                const isCompleted = target.currentAmount >= target.targetAmount;

                return (
                  <motion.div
                    key={target.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="relative group rounded-[2rem] overflow-hidden"
                  >
                    {/* Floating trash button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setDeleteTargetId(target.id);
                        setDeleteTargetName(target.name);
                      }}
                      className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-slate-200 dark:border-slate-850 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-500/10 hover:border-red-500/20 text-red-500"
                      title="Hapus target"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Premium Widescreen Card */}
                    <Link
                      to={`/target/${target.id}`}
                      className="flex flex-col bg-white dark:bg-neutral-900 border border-slate-250/50 dark:border-slate-800/50 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 relative group/card h-full min-h-[300px]"
                    >
                      
                      {/* Image header widescreen */}
                      <div className="w-full h-36 bg-slate-100 dark:bg-neutral-850 overflow-hidden relative border-b border-slate-100 dark:border-slate-850">
                        {isCompleted && (
                          <div className="absolute top-4 left-4 bg-emerald-500 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-full z-10 shadow-lg tracking-wider uppercase">
                            Tercapai 🎉
                          </div>
                        )}
                        {target.image ? (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                            <img src={target.image} alt={target.name} className="w-full h-full object-cover group-hover/card:scale-[1.03] transition-transform duration-500" />
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                            <Target className="w-8 h-8 opacity-40 mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Belum ada foto</span>
                          </div>
                        )}
                      </div>

                      {/* Card Content details */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="text-base font-black text-slate-900 dark:text-white group-hover/card:text-emerald-500 transition-colors tracking-tight line-clamp-1">{target.name}</h3>
                          
                          {target.estimatedDeadline && !isCompleted && (
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                              <Clock className="w-3 h-3 text-emerald-500" />
                              Estimasi: {new Date(target.estimatedDeadline).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          )}
                        </div>

                        <div>
                          {/* Financial counts */}
                          <div className="flex justify-between items-end mb-2">
                            <div className="text-[11px] font-bold text-muted-foreground">
                              <span className="text-slate-900 dark:text-white font-extrabold text-sm">{formatRupiahFull(target.currentAmount)}</span>
                              <span className="ml-1">/ {formatRupiahFull(target.targetAmount)}</span>
                            </div>
                            <span className="text-xs font-black text-emerald-500">{percentage}%</span>
                          </div>

                          {/* Glossy capsule progress bar */}
                          <div className="w-full bg-slate-100 dark:bg-neutral-850 rounded-full h-3 overflow-hidden border border-slate-200/20">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 relative"
                              style={{ width: `${percentage}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 shimmer-bg" />
                            </div>
                          </div>
                          
                          {/* Saving schedule details */}
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
                            <span className="text-[10px] bg-slate-100 dark:bg-neutral-950 text-slate-700 dark:text-slate-300 font-bold px-2.5 py-1 rounded-lg">
                              Rp{formatThousand(target.savingAmount.toString())} / {scheduleLabel(target.savingSchedule)}
                            </span>
                            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 group-hover/card:translate-x-1 transition-transform">
                              Detail Target <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>

                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Target Creation POP-UP MODAL (Mobile Bottom Sheet / Desktop Dialog) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            
            {/* Backdrop click closer */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm"
              onClick={() => { setIsModalOpen(false); resetForm(); }}
            />

            {/* Modal Body container */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative bg-white dark:bg-neutral-900 rounded-t-[2.5rem] sm:rounded-[2.2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-200/50 dark:border-neutral-800/60 flex flex-col max-h-[85vh] sm:max-h-[90vh]"
            >
              {/* Drag indicator (mobile) */}
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-neutral-700 rounded-full mx-auto mt-4 mb-2 sm:hidden shrink-0" />
              
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200/30 dark:border-slate-800/30 shrink-0">
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-display tracking-tight">Rancang Target Baru</h3>
                <button 
                  onClick={() => { setIsModalOpen(false); resetForm(); }} 
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-neutral-850 flex items-center justify-center text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 pb-10">
                <form onSubmit={handleCreateTarget} className="space-y-5">
                  
                  {/* Goal Image Upload */}
                  <ImageUpload value={image} onChange={setImage} variant="compact" />

                  {/* Goal Name Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="modal-name" className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                      Nama Target / Barang Impian
                    </label>
                    <input
                      type="text"
                      id="modal-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: MacBook Pro M4 Max"
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none text-sm"
                      required
                    />
                  </div>

                  {/* Nominal target */}
                  <div className="space-y-1.5">
                    <label htmlFor="modal-amount" className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                      Target Nominal Dana (Rp)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-emerald-500 font-bold text-xs">
                        Rp
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        id="modal-amount"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(formatThousand(e.target.value))}
                        placeholder="35.000.000"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none text-sm font-bold"
                        required
                      />
                    </div>
                  </div>

                  {/* Saving Schedule selectors */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                        Frekuensi Rencana Menabung
                      </label>
                      <ScheduleSelector value={savingSchedule} onChange={setSavingSchedule} variant="pill" />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="modal-saving-amount" className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                        Nominal per {scheduleLabel(savingSchedule)}
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-emerald-500 font-bold text-xs">
                          Rp
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          id="modal-saving-amount"
                          value={savingAmount}
                          onChange={(e) => setSavingAmount(formatThousand(e.target.value))}
                          placeholder="1.000.000"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none text-sm font-bold"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calculation previews */}
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
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-wider">Perkiraan Target Selesai</p>
                            <p className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5">{estimatedDeadlineDate}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Membutuhkan sekitar <span className="font-bold text-slate-800 dark:text-slate-200">{periodsNeeded} kali</span> pengisian terjadwal.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reminder switcher panel */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-slate-50/40 dark:bg-neutral-950/40">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Aktifkan Pengingat Tabungan</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Dapatkan alarm notifikasi pengingat terjadwal</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReminderEnabled(!reminderEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          reminderEnabled ? 'bg-emerald-500' : 'bg-slate-350 dark:bg-neutral-800'
                        }`}
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
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-3 bg-slate-50/40 dark:bg-neutral-950/40 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
                            <label htmlFor="modal-reminder-time" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                              <Clock className="w-3.5 h-3.5 text-emerald-500" />
                              Waktu Alarm Pengingat
                            </label>
                            <input
                              type="time"
                              id="modal-reminder-time"
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

                  {/* Buttons group drawer */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setIsModalOpen(false); resetForm(); }}
                      className="flex-1 px-4 py-3 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 rounded-2xl font-bold text-xs text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        {isSubmitting && <Loader2 className="h-3.5 animate-spin" />}
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Rencana'}
                      </span>
                    </button>
                  </div>

                </form>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TARGET DELETION CONFIRMATION DRAWER/DIALOG */}
      <AnimatePresence>
        {deleteTargetId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm"
              onClick={() => { setDeleteTargetId(null); setDeleteTargetName(''); }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white dark:bg-neutral-900 border border-slate-200/50 dark:border-neutral-850 rounded-[2rem] shadow-2xl w-full max-w-sm p-6 text-center z-10 glass-panel"
            >
              <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/10">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-display tracking-tight">Hapus Target Permanen?</h3>
              <p className="text-xs text-muted-foreground mt-2 mb-6 leading-relaxed">
                Rencana tabungan <span className="font-extrabold text-slate-900 dark:text-white">"{deleteTargetName}"</span> beserta seluruh riwayat transaksi yang tercatat di dalamnya akan dihapus dan tidak dapat dikembalikan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setDeleteTargetId(null); setDeleteTargetName(''); }}
                  className="flex-1 py-3 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-350 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteTarget}
                  className="flex-1 py-3 rounded-2xl font-bold text-xs bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all"
                >
                  Hapus Rencana
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
