import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAppContext } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trash2, Edit3, X, Bell, Calendar, Clock, TrendingUp, AlertCircle, CheckCircle2, Image as ImageIcon, Sparkles, Award, Wallet, DollarSign, Target } from 'lucide-react';
import { formatThousand, parseThousand, formatRupiah } from '../utils/formatNumber';
import { calculateEstimatedDeadline, scheduleLabel } from '../utils/calculations';
import { ImageUpload } from '../components/ui/ImageUpload';
import { ScheduleSelector } from '../components/ui/ScheduleSelector';
import { fetchTargetDetail, fetchTargetTransactions, createTransaction } from '../services/targetService';
import { TargetDetailResponse, TransactionResponse } from '../types/target';
import confetti from 'canvas-confetti';

const isNotFoundError = (err: unknown) => err instanceof Error && err.message.includes('404');

export const TargetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { targets, updateTarget, deleteTarget, user, editTarget, isLoading } = useAppContext();

  const localTarget = targets.find(t => t.id === id);

  const [detail, setDetail] = useState<TargetDetailResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [txPage, setTxPage] = useState(0);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isLoadingTx, setIsLoadingTx] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [isUpdatingTarget, setIsUpdatingTarget] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');

  const [editName, setEditName] = useState('');
  const [editTargetAmount, setEditTargetAmount] = useState('');
  const [editSavingAmount, setEditSavingAmount] = useState('');
  const [editSavingSchedule, setEditSavingSchedule] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [editReminderEnabled, setEditReminderEnabled] = useState(false);
  const [editReminderTime, setEditReminderTime] = useState('08:00');
  const [editImage, setEditImage] = useState('');

  React.useEffect(() => {
    if (!id || !user) return;
    setTxPage(0);
  }, [id, user]);

  React.useEffect(() => {
    if (!id || !user) return;
    let cancelled = false;
    const loadDetail = async () => {
      setIsLoadingDetail(true);
      try {
        const data = await fetchTargetDetail(id);
        if (!cancelled) setDetail(data);
      } catch (err) {
        if (!cancelled) setDetail(null);
        if (!isNotFoundError(err)) {
          console.error('Failed to load target detail:', err);
        }
      } finally {
        if (!cancelled) setIsLoadingDetail(false);
      }
    };
    loadDetail();
    return () => { cancelled = true; };
  }, [id, user]);

  React.useEffect(() => {
    if (!id || !user || !detail) return;
    let cancelled = false;
    const loadTransactions = async () => {
      setIsLoadingTx(true);
      try {
        const page = await fetchTargetTransactions(id, txPage, 10);
        if (cancelled) return;
        setTransactions(page.content);
        setTxTotalPages(page.totalPages || 1);
      } catch (err) {
        if (!cancelled) {
          setTransactions([]);
          setTxTotalPages(1);
        }
        if (!isNotFoundError(err)) {
          console.error('Failed to load transactions:', err);
        }
      } finally {
        if (!cancelled) setIsLoadingTx(false);
      }
    };
    loadTransactions();
    return () => { cancelled = true; };
  }, [id, user, txPage, detail]);

  const targetView = user
    ? (detail ? {
      id: detail.id,
      name: detail.title,
      targetAmount: detail.targetAmount,
      currentAmount: detail.currentAmount,
      savingAmount: detail.frequencyAmount,
      savingSchedule: detail.frequency.toLowerCase() as 'daily' | 'weekly' | 'monthly',
      reminderEnabled: localTarget?.reminderEnabled ?? false,
      reminderTime: localTarget?.reminderTime,
      status: detail.status.toLowerCase() as 'active' | 'paused' | 'completed',
      deadline: detail.deadline ?? undefined,
      image: detail.imageUrl ?? undefined,
      isGuest: false,
    } : null)
    : (localTarget ?? null);

  const txView = user
    ? transactions.map(tx => ({
      id: tx.id,
      date: tx.createdAt,
      amount: tx.amount,
      type: tx.type === 'DEPOSIT' ? 'deposit' : 'withdraw',
    }))
    : (localTarget?.history ?? []);

  React.useEffect(() => {
    if (isLoading) return;
    if (!user && !localTarget) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoading, user, localTarget, navigate]);

  if (isLoading && !localTarget && !user) {
    return null;
  }
  if ((user ? isLoadingDetail : isLoading) && !targetView) {
    return (
      <div className="flex-1 bg-background min-h-screen animate-pulse">
        <div className="bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-40 border-b border-neutral-200/50 dark:border-neutral-800/50">
          <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 sm:px-6 lg:px-8 py-4">
            <div className="w-10 h-10 bg-neutral-250 dark:bg-neutral-800 rounded-full" />
            <div className="h-7 bg-neutral-250 dark:bg-neutral-800 rounded-lg w-48" />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="flex-1 space-y-6">
              <div className="w-full h-72 bg-neutral-200 dark:bg-neutral-900 rounded-3xl" />
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 space-y-6 border border-neutral-200 dark:border-neutral-800/50">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-24" />
                    <div className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded-xl w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!targetView) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background text-foreground min-h-screen">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Target tidak ditemukan</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">Target yang Anda cari mungkin sudah dihapus atau tidak valid.</p>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold transition-colors">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const percentage = user && detail
    ? detail.progressPercent
    : Math.min(100, Math.round((targetView.currentAmount / targetView.targetAmount) * 100));
  const remaining = user && detail
    ? detail.remainingAmount
    : Math.max(0, targetView.targetAmount - targetView.currentAmount);
  const periodsNeeded = targetView.savingAmount > 0 ? Math.ceil(remaining / targetView.savingAmount) : 0;
  const isCompleted = targetView.currentAmount >= targetView.targetAmount;

  const editEstimatedDeadline = (() => {
    const ta = parseThousand(editTargetAmount);
    const sa = parseThousand(editSavingAmount);
    if (!ta || !sa) return '';
    const iso = calculateEstimatedDeadline(ta, sa, editSavingSchedule);
    return new Date(iso).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  })();

  // Fire Spectacular Confetti Blast
  const fireConfettiCelebration = () => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 110 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Confetti firework bursts
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetView) return;

    const amount = parseThousand(amountInput);
    if (!amount || amount <= 0) return;
    if (transactionType === 'withdraw' && amount > targetView.currentAmount) {
      alert('Saldo tidak mencukupi untuk ditarik.');
      return;
    }

    const oldAmount = targetView.currentAmount;
    const isOldTargetActive = oldAmount < targetView.targetAmount;

    if (user && detail) {
      try {
        const savedTx = await createTransaction(targetView.id, {
          type: transactionType,
          amount,
          note: null,
        });

        const refreshedDetail = await fetchTargetDetail(targetView.id);
        setDetail(refreshedDetail);

        if (txPage === 0) {
          const newTx: TransactionResponse = {
            id: savedTx.id,
            type: savedTx.type,
            amount: savedTx.amount,
            note: savedTx.note,
            createdAt: savedTx.createdAt,
          };
          setTransactions(prev => [newTx, ...prev].slice(0, 10));
        }

        // Fire celebration if goal completed
        if (isOldTargetActive && refreshedDetail.currentAmount >= refreshedDetail.targetAmount) {
          setShowVictoryModal(true);
          fireConfettiCelebration();
        }

      } catch (err) {
        console.error('Gagal menyimpan transaksi:', err);
        alert('Gagal menyimpan transaksi. Silakan coba lagi.');
        return;
      }
    } else {
      await updateTarget(targetView.id, amount, transactionType);
      
      // Fire celebration if goal completed (Guest mode)
      if (isOldTargetActive && (transactionType === 'deposit' && oldAmount + amount >= targetView.targetAmount)) {
        setShowVictoryModal(true);
        fireConfettiCelebration();
      }
    }

    setAmountInput('');
    setShowTransactionModal(false);
  };

  const handleDelete = () => {
    if (!targetView) return;
    deleteTarget(targetView.id);
    navigate('/dashboard');
  };

  const handleOpenEdit = () => {
    setEditName(targetView.name);
    setEditTargetAmount(formatThousand(targetView.targetAmount.toString()));
    setEditSavingAmount(formatThousand(targetView.savingAmount.toString()));
    setEditSavingSchedule(targetView.savingSchedule);
    setEditReminderEnabled(targetView.reminderEnabled);
    setEditReminderTime(targetView.reminderTime ?? '08:00');
    setEditImage(targetView.image || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editTargetAmount || !editSavingAmount || !targetView) return;
    setIsUpdatingTarget(true);
    try {
      await editTarget(targetView.id, {
        name: editName,
        targetAmount: parseThousand(editTargetAmount),
        savingAmount: parseThousand(editSavingAmount),
        savingSchedule: editSavingSchedule,
        reminderEnabled: editReminderEnabled,
        reminderTime: editReminderEnabled ? editReminderTime : undefined,
        image: editImage || undefined,
        originalImage: targetView.image,
      });
      if (user) {
        const refreshed = await fetchTargetDetail(targetView.id);
        setDetail(refreshed);
      }
      setShowEditModal(false);
      setShowUpdateSuccess(true);
    } finally {
      setIsUpdatingTarget(false);
    }
  };

  // Open transaction modal pre-filled
  const triggerQuickSave = (val: number) => {
    setTransactionType('deposit');
    setAmountInput(formatThousand(val.toString()));
    setShowTransactionModal(true);
  };

  return (
    <div className="flex-1 bg-background text-foreground min-h-screen relative bg-grid-pattern pb-20">
      
      {/* Editorial Header Section */}
      <div className="glass-panel sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 hover:bg-slate-100/50 dark:hover:bg-neutral-800/50 rounded-xl text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-black truncate tracking-tight text-slate-900 dark:text-white font-display">{targetView.name}</h1>
          </div>
          <div className="flex gap-1 shrink-0">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleOpenEdit} className="p-2 text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-neutral-800/50 rounded-xl" title="Edit Target">
              <Edit3 className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowDeleteConfirm(true)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl" title="Hapus Target">
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Target Details Main Layout Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">

          {/* Left Main Column */}
          <div className="flex-1 space-y-6 flex flex-col justify-between">
            
            {/* Parallax Goal image container */}
            <motion.div
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              className="w-full h-56 sm:h-72 lg:h-80 bg-slate-100 dark:bg-neutral-900 rounded-[2.2rem] overflow-hidden shadow-2xl relative border border-slate-200/50 dark:border-neutral-800/50 group shrink-0"
            >
              {targetView.image ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/10 to-transparent z-10" />
                  <img src={targetView.image} alt={targetView.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-neutral-900 z-10 text-muted-foreground">
                  <ImageIcon className="w-16 h-16 opacity-30 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider">Belum ada foto</p>
                </div>
              )}
              
              {/* Floating status pill */}
              <div className="absolute top-4 left-4 z-20">
                {isCompleted ? (
                  <div className="bg-emerald-500 text-slate-950 px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg tracking-wider uppercase">
                    <CheckCircle2 className="w-4 h-4 text-slate-950" /> Tercapai
                  </div>
                ) : (
                  <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur text-slate-800 dark:text-slate-200 px-3.5 py-1.5 rounded-full text-xs font-black border border-slate-200/30 dark:border-slate-700/30 flex items-center gap-1.5 shadow-lg tracking-wider uppercase">
                    <TrendingUp className="w-4 h-4 text-emerald-500" /> Aktif Menabung
                  </div>
                )}
              </div>
            </motion.div>

            {/* Circular Progress & Target Core Stat Panel */}
            <motion.div
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-white dark:bg-neutral-900 rounded-[2.2rem] p-6 sm:p-8 shadow-xl border border-slate-200/50 dark:border-neutral-800/60 flex-1 flex flex-col justify-between space-y-6 glass-panel"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                
                {/* Text stats details */}
                <div className="text-center sm:text-left flex-1 min-w-0 space-y-3.5">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Target Dana Yang Dibutuhkan</p>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight break-all font-display">
                      Rp{formatRupiah(targetView.targetAmount)}
                    </h2>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-neutral-950 text-slate-700 dark:text-slate-350 text-xs font-bold border border-slate-200/30 dark:border-slate-800/30">
                      Setoran: Rp{formatRupiah(targetView.savingAmount)} / {scheduleLabel(targetView.savingSchedule)}
                    </span>
                    {targetView.reminderEnabled && targetView.reminderTime && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/15">
                        <Bell className="w-3.5 h-3.5" /> Pukul {targetView.reminderTime}
                      </span>
                    )}
                  </div>
                </div>

                {/* Animated Radial Progress Ring */}
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36 relative shrink-0"
                >
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-100 dark:text-neutral-950" />
                    <circle
                      cx="50" cy="50" r="42"
                      stroke="url(#progressGradient)" strokeWidth="7" fill="none"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - percentage / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Central pulsing victory graphics */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    {isCompleted ? (
                      <Award className="w-8 h-8 text-emerald-500 animate-bounce" />
                    ) : (
                      <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter font-display">{percentage}%</span>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Created and estimated times indicator */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200/30 dark:border-slate-800/30 w-full">
                <div className="bg-slate-50/50 dark:bg-neutral-950/50 rounded-2xl p-4 border border-slate-200/20 dark:border-slate-800/20">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Status Tabungan</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{isCompleted ? 'Target Selesai!' : 'Rencana Berjalan'}</span>
                </div>
                <div className="bg-slate-50/50 dark:bg-neutral-950/50 rounded-2xl p-4 border border-slate-200/20 dark:border-slate-800/20">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Waktu Tersisa</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isCompleted ? '-' : `${periodsNeeded} ${scheduleLabel(targetView.savingSchedule)} Lagi`}
                  </span>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Right Layout Columns */}
          <div className="w-full lg:w-[380px] flex flex-col gap-6">
            
            {/* Quick stats figures */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-center relative overflow-hidden glass-panel shadow-sm">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1 relative z-10">Terkumpul</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 relative z-10 font-display">Rp{formatRupiah(targetView.currentAmount)}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-center relative overflow-hidden glass-panel shadow-sm">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-500/5 rounded-full blur-2xl" />
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1 relative z-10">Kekurangan</p>
                <p className="text-lg font-black text-red-500 dark:text-red-400 relative z-10 font-display">Rp{formatRupiah(remaining)}</p>
              </motion.div>
            </div>

            {/* Quick pre-filled save button shortcuts */}
            {!isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white dark:bg-neutral-900 rounded-[2rem] p-5 sm:p-6 border border-slate-200/40 dark:border-slate-800/40 shadow-sm glass-panel flex flex-col gap-3 shrink-0"
              >
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Setor Instan</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[10000, 50000, 100000].map(val => (
                    <motion.button
                      key={val}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => triggerQuickSave(val)}
                      className="py-2.5 bg-slate-600 hover:bg-slate-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl whitespace-nowrap transition-colors"
                    >
                      +Rp{formatThousand(val.toString())}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Transaction History ledger */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} 
              className="bg-white dark:bg-neutral-900 rounded-[2.2rem] border border-slate-200/40 dark:border-slate-800/40 flex-1 flex flex-col overflow-hidden shadow-xl glass-panel max-h-[300px] lg:max-h-[500px]"
            >
              <div className="px-5 py-4 border-b border-slate-200/30 dark:border-slate-800/30 bg-slate-50/50 dark:bg-neutral-900/50 flex justify-between items-center shrink-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Riwayat Transaksi</h3>
                <span className="text-[10px] bg-slate-100 dark:bg-neutral-950 px-2 py-0.5 rounded-full font-bold">{txView.length} Catatan</span>
              </div>
              
              <div className="p-4 sm:p-5 space-y-3 overflow-y-auto custom-scrollbar flex-1 pb-10">
                {isLoadingTx && user ? (
                  <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-center">
                    <p className="text-xs text-muted-foreground">Memuat riwayat transaksi...</p>
                  </div>
                ) : txView.length === 0 ? (
                  <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-neutral-850 rounded-full flex items-center justify-center mb-3">
                      <TrendingUp className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-350 font-bold text-xs">Belum ada riwayat</p>
                    <p className="text-muted-foreground text-[10px] mt-0.5">Mulai menyetorkan dana pertama Anda.</p>
                  </div>
                ) : (
                  txView.slice().map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * Math.min(index, 5) }}
                      className="bg-slate-50/50 dark:bg-neutral-950/40 hover:bg-slate-50 dark:hover:bg-neutral-850/30 border border-slate-200/10 dark:border-slate-800/10 transition-colors rounded-2xl p-3.5 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-500 dark:text-red-400'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{tx.type === 'deposit' ? 'Setoran Tabungan' : 'Penarikan Saldo'}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · {new Date(tx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <p className={`text-xs font-black ${tx.type === 'deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                        Rp{formatRupiah(tx.amount)}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
              
              {user && txTotalPages > 1 && (
                <div className="px-4 py-3 border-t border-slate-200/30 dark:border-slate-800/30 flex items-center justify-between text-[10px] font-bold bg-slate-50/50 dark:bg-neutral-900/50 shrink-0">
                  <button
                    onClick={() => setTxPage(p => Math.max(0, p - 1))}
                    disabled={txPage === 0}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-350 disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  <span className="text-muted-foreground">Halaman {txPage + 1} dari {txTotalPages}</span>
                  <button
                    onClick={() => setTxPage(p => Math.min(txTotalPages - 1, p + 1))}
                    disabled={txPage >= txTotalPages - 1}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-350 disabled:opacity-50"
                  >
                    Berikutnya
                  </button>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>

      {/* Floating Action Button (FAB) for transaction save */}
      {!isCompleted && (
        <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTransactionModal(true)}
            className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full shadow-[0_8px_30px_rgba(16,185,129,0.35)] flex items-center justify-center transition-all"
            title="Tambah Transaksi"
          >
            <Edit3 className="w-5 h-5 text-slate-950" />
          </motion.button>
        </div>
      )}

      {/* Slide-Up Transaction Modal */}
      <AnimatePresence>
        {showTransactionModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm" onClick={() => setShowTransactionModal(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative bg-white dark:bg-neutral-900 border-t sm:border border-slate-200/50 dark:border-neutral-800/60 rounded-t-[2.2rem] sm:rounded-[2.2rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="w-12 h-1.5 bg-slate-350 dark:bg-neutral-700 rounded-full mx-auto mt-4 mb-2 sm:hidden shrink-0" />
              <div className="px-6 py-4 flex justify-between items-center border-b border-slate-200/30 dark:border-slate-800/30 shrink-0">
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-display tracking-tight">Catat Saldo Tabungan</h3>
                <button onClick={() => setShowTransactionModal(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-neutral-850 flex items-center justify-center text-muted-foreground hover:text-slate-900 dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleTransaction} className="p-6 space-y-5 overflow-y-auto flex-1 pb-10">
                {/* Deposit / Withdraw Tabs */}
                <div className="flex bg-slate-100 dark:bg-neutral-950 p-1 rounded-2xl border border-slate-250/20">
                  <button type="button" onClick={() => setTransactionType('deposit')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${transactionType === 'deposit' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-muted-foreground hover:text-slate-900 dark:hover:text-white'}`}>
                    Setor Uang
                  </button>
                  <button type="button" onClick={() => setTransactionType('withdraw')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${transactionType === 'withdraw' ? 'bg-red-500 text-white shadow-md' : 'text-muted-foreground hover:text-slate-900 dark:hover:text-white'}`}>
                    Tarik Saldo
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Nominal Saldo (Rp)</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-black text-sm">Rp</span>
                    <input
                      type="text" inputMode="numeric"
                      value={amountInput}
                      onChange={(e) => setAmountInput(formatThousand(e.target.value))}
                      placeholder="0"
                      className="w-full pl-11 pr-4 py-4 bg-slate-50/60 dark:bg-neutral-950/60 border border-slate-250 dark:border-slate-800 rounded-2xl text-2xl font-black text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-neutral-700 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all"
                      required autoFocus
                    />
                  </div>
                  {transactionType === 'withdraw' && (
                    <p className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Maksimal penarikan: Rp{formatRupiah(targetView.currentAmount)}
                    </p>
                  )}
                  {transactionType === 'deposit' && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1 custom-scrollbar shrink-0">
                      {[...new Set([10000, 50000, 100000, targetView.savingAmount])].filter(v => v > 0).map(val => (
                        <button
                          key={val} type="button"
                          onClick={() => setAmountInput(formatThousand(val.toString()))}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-slate-800 dark:text-slate-300 text-[10px] font-bold rounded-lg whitespace-nowrap transition-colors"
                        >
                          +Rp{formatRupiah(val)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className={`w-full py-4 rounded-2xl font-black text-sm shadow-lg transition-all active:scale-[0.98] mt-2 ${transactionType === 'deposit' ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20' : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'}`}>
                  Simpan Transaksi
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Alert dialogue */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white dark:bg-neutral-900 border border-slate-200/50 dark:border-neutral-800 rounded-[2rem] shadow-2xl w-full max-w-sm p-6 text-center z-10 glass-panel"
            >
              <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/10">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-display tracking-tight">Hapus Rencana Ini?</h3>
              <p className="text-xs text-muted-foreground mt-2 mb-6 leading-relaxed">
                Rencana tabungan <span className="font-extrabold text-slate-900 dark:text-white">"{targetView.name}"</span> beserta seluruh data di dalamnya akan dihapus dan tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-350 transition-all">Batal</button>
                <button onClick={handleDelete} className="flex-1 py-3 rounded-2xl font-bold text-xs bg-red-500 hover:bg-red-650 text-white shadow-lg shadow-red-500/20 transition-all">Hapus Rencana</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WIDESCREEN EDIT MODAL DIALOGUE */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative bg-white dark:bg-neutral-900 border-t sm:border border-slate-200/50 dark:border-neutral-800/60 rounded-t-[2.2rem] sm:rounded-[2.2rem] w-full max-w-md shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh]"
            >
              <div className="w-12 h-1.5 bg-slate-350 dark:bg-neutral-700 rounded-full mx-auto mt-4 mb-2 sm:hidden shrink-0" />
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200/30 dark:border-slate-800/30 bg-white dark:bg-neutral-900 shrink-0">
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-display tracking-tight">Edit Rencana Tabungan</h3>
                <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-neutral-850 flex items-center justify-center text-muted-foreground hover:text-slate-900 dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 pb-10">
                <form id="edit-form" onSubmit={handleEditSubmit} className="space-y-5">
                  
                  <ImageUpload value={editImage} onChange={setEditImage} variant="compact" />

                  <div className="space-y-1.5">
                    <label htmlFor="edit-name" className="block text-xs font-bold text-slate-500 dark:text-slate-400">Nama Target / Tujuan</label>
                    <input
                      type="text" id="edit-name"
                      value={editName} onChange={(e) => setEditName(e.target.value)}
                      placeholder="Contoh: Tabungan Liburan"
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="edit-amount" className="block text-xs font-bold text-slate-500 dark:text-slate-400">Target Nominal Dana</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground font-bold text-xs">
                        Rp
                      </div>
                      <input
                        type="text" inputMode="numeric" id="edit-amount"
                        value={editTargetAmount} onChange={(e) => setEditTargetAmount(formatThousand(e.target.value))}
                        placeholder="1.000.000"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none text-sm font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Frekuensi Pengisian Saldo</label>
                      <ScheduleSelector value={editSavingSchedule} onChange={setEditSavingSchedule} variant="pill" />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="edit-saving-amount" className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                        Nominal per {scheduleLabel(editSavingSchedule)}
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground font-bold text-xs">
                          Rp
                        </div>
                        <input
                          type="text" inputMode="numeric" id="edit-saving-amount"
                          value={editSavingAmount} onChange={(e) => setEditSavingAmount(formatThousand(e.target.value))}
                          placeholder="100.000"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-neutral-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none text-sm font-bold"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {editEstimatedDeadline && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3 mt-2">
                          <Clock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-wider">Perkiraan Rencana Selesai</p>
                            <p className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5">{editEstimatedDeadline}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Membutuhkan sekitar <span className="font-bold text-slate-800 dark:text-slate-200">{Math.ceil(parseThousand(editTargetAmount) / parseThousand(editSavingAmount))} kali</span> menabung rutin.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Alarm toggler switcher */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-slate-50/40 dark:bg-neutral-950/40">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${editReminderEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-neutral-850 text-muted-foreground'}`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-850 dark:text-slate-200">Notifikasi Pengingat</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Ingatkan jadwal menyisihkan saldo</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditReminderEnabled(!editReminderEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editReminderEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-neutral-800'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${editReminderEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {editReminderEnabled && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-3 bg-slate-50/40 dark:bg-neutral-950/40 border-t border-slate-200/50 dark:border-slate-850">
                            <label htmlFor="edit-reminder-time" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                              <Clock className="w-3.5 h-3.5 text-emerald-500" />
                              Waktu Alarm Pengingat
                            </label>
                            <input
                              type="time"
                              id="edit-reminder-time"
                              value={editReminderTime}
                              onChange={(e) => setEditReminderTime(e.target.value)}
                              step="60"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none cursor-pointer text-sm font-bold"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </div>

              {/* Action buttons footer */}
              <div className="p-6 border-t border-slate-250/30 dark:border-slate-800/30 bg-white dark:bg-neutral-900 shrink-0 flex gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-350 transition-colors">Batal</button>
                <button
                  type="submit"
                  form="edit-form"
                  disabled={isUpdatingTarget}
                  className="flex-[2] py-3 rounded-2xl font-bold text-xs text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/10 transition-all disabled:opacity-60"
                >
                  {isUpdatingTarget ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Success Dialogue Modal */}
      <AnimatePresence>
        {showUpdateSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm" onClick={() => setShowUpdateSuccess(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white dark:bg-neutral-900 border border-slate-200/50 dark:border-neutral-850 rounded-[2rem] shadow-2xl w-full max-w-sm p-6 text-center z-10 glass-panel"
            >
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/10">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-display tracking-tight">Perubahan Disimpan!</h3>
              <p className="text-xs text-muted-foreground mt-2 mb-6">Target tabungan Anda berhasil diperbarui di database.</p>
              <button onClick={() => setShowUpdateSuccess(false)} className="w-full py-3.5 rounded-2xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all">Tutup Halaman</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GOAL ACHIEVED VICTORY CELEBRATION MODAL OVERLAY */}
      <AnimatePresence>
        {showVictoryModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            
            {/* Dark heavy blur overlay */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setShowVictoryModal(false)} 
            />

            {/* Victory Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 180 }}
              className="relative bg-gradient-to-b from-slate-900 to-neutral-950 border border-slate-800 rounded-[2.5rem] p-8 text-center w-full max-w-md shadow-2xl z-10 overflow-hidden"
            >
              {/* Rotating background vector glow */}
              <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

              {/* Victory Medal Illustration */}
              <motion.div 
                animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                className="w-20 h-20 bg-emerald-500 text-slate-950 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20"
              >
                <Award className="w-12 h-12 text-slate-950" />
              </motion.div>

              <div className="space-y-2 mb-6">
                <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                  <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" /> Target Selesai
                </div>
                <h3 className="text-2xl font-black text-white font-display tracking-tight leading-none pt-2">Selamat, Target Tercapai! 🎉</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto pt-1">
                  Kerja keras dan kedisiplinan Anda membuahkan hasil. Rencana tabungan <span className="font-extrabold text-white">"{targetView.name}"</span> telah terkumpul sebesar 100%!
                </p>
              </div>

              {/* Miniature Showcase Success Box */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex items-center gap-4 mb-8 text-left">
                {targetView.image ? (
                  <img src={targetView.image} alt={targetView.name} className="w-14 h-14 rounded-xl object-cover" />
                ) : (
                  <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-slate-500">
                    <Target className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{targetView.name}</h4>
                  <p className="text-[10px] text-emerald-400 font-black mt-0.5">TERKUMPUL: Rp{formatRupiah(targetView.targetAmount)}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowVictoryModal(false)}
                className="w-full py-4 rounded-2xl font-black text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all"
              >
                Luar Biasa, Terima Kasih!
              </motion.button>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
