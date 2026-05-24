import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAppContext } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trash2, Edit3, X, Bell, Calendar, Clock, TrendingUp, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { formatThousand, parseThousand, formatRupiah } from '../utils/formatNumber';
import { calculateEstimatedDeadline, scheduleLabel } from '../utils/calculations';
import { ImageUpload } from '../components/ui/ImageUpload';
import { ScheduleSelector } from '../components/ui/ScheduleSelector';
import { fetchTargetDetail, fetchTargetTransactions } from '../services/targetService';
import { TargetDetailResponse, TransactionResponse } from '../types/target';

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
        console.error('Failed to load target detail:', err);
        if (!cancelled) setDetail(null);
      } finally {
        if (!cancelled) setIsLoadingDetail(false);
      }
    };
    loadDetail();
    return () => { cancelled = true; };
  }, [id, user]);

  React.useEffect(() => {
    if (!id || !user) return;
    let cancelled = false;
    const loadTransactions = async () => {
      setIsLoadingTx(true);
      try {
        const page = await fetchTargetTransactions(id, txPage, 10);
        if (cancelled) return;
        setTransactions(page.content);
        setTxTotalPages(page.totalPages || 1);
      } catch (err) {
        console.error('Failed to load transactions:', err);
        if (!cancelled) {
          setTransactions([]);
          setTxTotalPages(1);
        }
      } finally {
        if (!cancelled) setIsLoadingTx(false);
      }
    };
    loadTransactions();
    return () => { cancelled = true; };
  }, [id, user, txPage]);

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
    if (!isLoading && !user && !targetView?.isGuest) {
      navigate('/login');
    }
  }, [user, targetView, isLoading, navigate]);

  if (!isLoading && !user && !targetView?.isGuest) {
    return null;
  }

  if ((user ? isLoadingDetail : isLoading) && !targetView) {
    return (
      <div className="flex-1 bg-neutral-100 dark:bg-neutral-950 min-h-screen animate-pulse">
        <div className="bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-40 border-b border-neutral-200/50 dark:border-neutral-800/50">
          <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 sm:px-6 lg:px-8 py-4">
            <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
            <div className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-48" />
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
                    <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full w-40" />
                  </div>
                  <div className="w-36 h-36 bg-neutral-200 dark:bg-neutral-800 rounded-full shrink-0" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-4 h-20" />
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-4 h-20" />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[400px] space-y-6">
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 h-28 border border-neutral-200 dark:border-neutral-800/50" />
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 h-28 border border-neutral-200 dark:border-neutral-800/50" />
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800/50 h-80" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!targetView) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen">
        <AlertCircle className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Target tidak ditemukan</h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-sm">Target yang Anda cari mungkin sudah dihapus atau URL tidak valid.</p>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors">
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

  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetView) return;
    const amount = parseThousand(amountInput);
    if (!amount || amount <= 0) return;
    if (transactionType === 'withdraw' && amount > targetView.currentAmount) {
      alert('Saldo tidak mencukupi untuk ditarik.');
      return;
    }
    updateTarget(targetView.id, amount, transactionType);

    if (user && detail) {
      const newAmount = transactionType === 'deposit'
        ? detail.currentAmount + amount
        : detail.currentAmount - amount;
      const newRemaining = Math.max(0, detail.targetAmount - newAmount);
      const newPercentage = Math.min(100, Math.round((newAmount / detail.targetAmount) * 100));

      setDetail({
        ...detail,
        currentAmount: newAmount,
        remainingAmount: newRemaining,
        progressPercent: newPercentage,
      });

      if (txPage === 0) {
        setTransactions(prev => [{
          id: `tx-${Date.now()}`,
          type: transactionType === 'deposit' ? 'DEPOSIT' : 'WITHDRAW',
          amount,
          note: null,
          createdAt: new Date().toISOString(),
        }, ...prev].slice(0, 10));
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

  return (
    <div className="flex-1 bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 min-h-screen font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <div className="bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-40 border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold truncate tracking-tight text-neutral-900 dark:text-white">{targetView.name}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={handleOpenEdit} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors" title="Edit Target">
              <Edit3 className="w-5 h-5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white" />
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors" title="Hapus Target">
              <Trash2 className="w-5 h-5 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* Left Column */}
          <div className="flex-1 space-y-6">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="w-full h-56 sm:h-72 lg:h-80 bg-neutral-200 dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl relative group border border-neutral-200 dark:border-neutral-800/50"
            >
              {targetView.image ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent z-10" />
                  <img src={targetView.image} alt={targetView.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-200 dark:bg-neutral-900 z-10">
                  <ImageIcon className="w-20 h-20 text-neutral-400 dark:text-neutral-700 mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-500 font-medium">Belum ada foto</p>
                </div>
              )}
              <div className="absolute top-4 left-4 z-20">
                {isCompleted ? (
                  <div className="bg-emerald-500/90 backdrop-blur text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
                    <CheckCircle2 className="w-4 h-4" /> Tercapai
                  </div>
                ) : (
                  <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur text-neutral-700 dark:text-neutral-200 px-3 py-1.5 rounded-full text-sm font-medium border border-neutral-200/50 dark:border-neutral-700/50 flex items-center gap-1.5 shadow-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Sedang Berjalan
                  </div>
                )}
              </div>
            </motion.div>

            {/* Target Amount & Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 shadow-md dark:shadow-xl border border-neutral-200 dark:border-neutral-800/50"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8 mb-8">
                <div className="text-center sm:text-left flex-1">
                  <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-1 uppercase tracking-wider text-sm">Target Dana</p>
                  <h2 className="text-4xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">Rp{formatRupiah(targetView.targetAmount)}</h2>
                  <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 text-sm font-semibold border border-neutral-200 dark:border-neutral-700/50">
                      Rp{formatRupiah(targetView.savingAmount)} / {scheduleLabel(targetView.savingSchedule)}
                    </span>
                    {targetView.reminderEnabled && targetView.reminderTime && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium border border-emerald-200 dark:border-emerald-800/50">
                        <Bell className="w-3.5 h-3.5" /> Pukul {targetView.reminderTime}
                      </span>
                    )}
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36 relative shrink-0">
                  <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="none" className="text-neutral-200 dark:text-neutral-800" />
                    <circle
                      cx="50" cy="50" r="42"
                      stroke="currentColor" strokeWidth="8" fill="none"
                      className={isCompleted ? 'text-emerald-400' : 'text-emerald-500'}
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - percentage / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <span className="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter">{percentage}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800/80">
                <div className="bg-neutral-50 dark:bg-neutral-950/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-medium">Dibuat Pada</span>
                  </div>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-950/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-medium">Estimasi Selesai</span>
                  </div>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {isCompleted ? '-' : `${periodsNeeded} ${scheduleLabel(targetView.savingSchedule)} Lagi`}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Mobile stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800/50 flex flex-col justify-center">
                <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium mb-1">Total Terkumpul</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Rp{formatRupiah(targetView.currentAmount)}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800/50 flex flex-col justify-center">
                <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium mb-1">Sisa Kekurangan</p>
                <p className="text-2xl font-bold text-red-500 dark:text-red-400">Rp{formatRupiah(remaining)}</p>
              </motion.div>
            </div>

            {/* Reminder */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-neutral-900 rounded-3xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${targetView.reminderEnabled ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500'}`}>
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">Pengingat Menabung</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {targetView.reminderEnabled
                      ? `Aktif setiap ${scheduleLabel(targetView.savingSchedule).toLowerCase()}${targetView.reminderTime ? ` pukul ${targetView.reminderTime}` : ''}`
                      : 'Tidak aktif'}
                  </p>
                </div>
              </div>
              <div className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${targetView.reminderEnabled ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'}`}>
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${targetView.reminderEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6">
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800/50 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
                <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium mb-1 relative z-10">Terkumpul</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 relative z-10">Rp{formatRupiah(targetView.currentAmount)}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800/50 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-500/5 rounded-full blur-2xl" />
                <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium mb-1 relative z-10">Kekurangan</p>
                <p className="text-2xl font-bold text-red-500 dark:text-red-400 relative z-10">Rp{formatRupiah(remaining)}</p>
              </motion.div>
            </div>

            {/* Transaction History */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800/50 flex-1 flex flex-col overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Riwayat Transaksi</h3>
              </div>
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[400px] lg:max-h-[600px] custom-scrollbar">
                {isLoadingTx && user ? (
                  <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center">
                    <p className="text-neutral-500 dark:text-neutral-500 text-sm">Memuat transaksi...</p>
                  </div>
                ) : txView.length === 0 ? (
                  <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                      <TrendingUp className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 font-medium">Belum ada riwayat</p>
                    <p className="text-neutral-500 dark:text-neutral-500 text-sm mt-1">Mulai menabung untuk melihat riwayat di sini.</p>
                  </div>
                ) : (
                  txView.slice().map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * Math.min(index, 5) }}
                      className="bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-2xl p-4 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-500 dark:text-red-400'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-800 dark:text-neutral-200">{tx.type === 'deposit' ? 'Setoran' : 'Penarikan'}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-500">
                            {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · {new Date(tx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <p className={`font-bold ${tx.type === 'deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                        {formatRupiah(tx.amount)}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
              {user && txTotalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-sm">
                  <button
                    onClick={() => setTxPage(p => Math.max(0, p - 1))}
                    disabled={txPage === 0}
                    className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  <span className="text-neutral-500 dark:text-neutral-400">Halaman {txPage + 1} dari {txTotalPages}</span>
                  <button
                    onClick={() => setTxPage(p => Math.min(txTotalPages - 1, p + 1))}
                    disabled={txPage >= txTotalPages - 1}
                    className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 disabled:opacity-50"
                  >
                    Berikutnya
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* FAB */}
      {!isCompleted && (
        <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-40">
          <button
            onClick={() => setShowTransactionModal(true)}
            className="w-16 h-16 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-full shadow-[0_8px_30px_rgba(16,185,129,0.3)] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title="Tambah Transaksi"
          >
            <Edit3 className="w-7 h-7" />
          </button>
        </div>
      )}

      {/* Transaction Modal */}
      <AnimatePresence>
        {showTransactionModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setShowTransactionModal(false)} />
            <motion.div
              initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-t-[2rem] sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mt-4 mb-2 sm:hidden" />
              <div className="px-6 py-4 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Catat Transaksi</h3>
                <button onClick={() => setShowTransactionModal(false)} className="w-8 h-8 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleTransaction} className="p-6 space-y-6">
                <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl">
                  <button type="button" onClick={() => setTransactionType('deposit')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${transactionType === 'deposit' ? 'bg-emerald-500 text-neutral-950 shadow-md' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}>
                    Menabung
                  </button>
                  <button type="button" onClick={() => setTransactionType('withdraw')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${transactionType === 'withdraw' ? 'bg-red-500 text-white shadow-md' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}>
                    Tarik Dana
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Nominal (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 font-bold">Rp</span>
                    <input
                      type="text" inputMode="numeric"
                      value={amountInput}
                      onChange={(e) => setAmountInput(formatThousand(e.target.value))}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-2xl font-bold text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                      required autoFocus
                    />
                  </div>
                  {transactionType === 'withdraw' && (
                    <p className="mt-2 text-xs text-neutral-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Saldo maksimal: Rp{formatRupiah(targetView.currentAmount)}
                    </p>
                  )}
                  {transactionType === 'deposit' && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                      {[...new Set([10000, 50000, 100000, targetView.savingAmount])].filter(v => v > 0).map(val => (
                        <button
                          key={val} type="button"
                          onClick={() => setAmountInput(formatThousand(val.toString()))}
                          className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-lg whitespace-nowrap transition-colors"
                        >
                          +{formatRupiah(val)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button type="submit" className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${transactionType === 'deposit' ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/20' : 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20'}`}>
                  Simpan Transaksi
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Hapus Target?</h3>
              <p className="text-neutral-500 dark:text-neutral-400 mb-8">Target <span className="text-neutral-900 dark:text-white font-medium">"{targetView.name}"</span> beserta riwayatnya akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-xl font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">Batal</button>
                <button onClick={handleDelete} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all">Ya, Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Edit Target</h3>
                <button onClick={() => setShowEditModal(false)} className="w-8 h-8 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="edit-form" onSubmit={handleEditSubmit} className="space-y-6">
                  <ImageUpload value={editImage} onChange={setEditImage} variant="full" />

                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Nama Target</label>
                    <input
                      type="text" id="edit-name"
                      value={editName} onChange={(e) => setEditName(e.target.value)}
                      placeholder="Contoh: Beli Laptop Baru"
                      className="w-full px-4 py-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-amount" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Target Nominal</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-neutral-400 dark:text-neutral-500 font-bold">Rp</span>
                      </div>
                      <input
                        type="text" inputMode="numeric" id="edit-amount"
                        value={editTargetAmount} onChange={(e) => setEditTargetAmount(formatThousand(e.target.value))}
                        placeholder="1.000.000"
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Rencana Menabung</label>
                    <ScheduleSelector value={editSavingSchedule} onChange={setEditSavingSchedule} variant="segmented" />

                    <label htmlFor="edit-saving-amount" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2 mt-4">
                      Nominal per {scheduleLabel(editSavingSchedule)}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-neutral-400 dark:text-neutral-500 font-bold">Rp</span>
                      </div>
                      <input
                        type="text" inputMode="numeric" id="edit-saving-amount"
                        value={editSavingAmount} onChange={(e) => setEditSavingAmount(formatThousand(e.target.value))}
                        placeholder="100.000"
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {editEstimatedDeadline && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
                          <Clock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500/80 mb-0.5">Estimasi Selesai</p>
                            <p className="text-base font-bold text-emerald-700 dark:text-emerald-400">{editEstimatedDeadline}</p>
                            <p className="text-xs text-emerald-600/60 dark:text-emerald-500/60 mt-1">
                              Butuh {Math.ceil(parseThousand(editTargetAmount) / parseThousand(editSavingAmount))} kali menabung
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reminder with time input */}
                  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-950">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${editReminderEnabled ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500'}`}>
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900 dark:text-white">Notifikasi Pengingat</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-500">Ingatkan jadwal menabung</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditReminderEnabled(!editReminderEnabled)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${editReminderEnabled ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-800'}`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${editReminderEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {editReminderEnabled && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-3 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
                            <label htmlFor="edit-reminder-time" className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              Jam Pengingat <span className="text-xs font-normal text-neutral-400">(Format 24 jam)</span>
                            </label>
                            <input
                              type="time"
                              id="edit-reminder-time"
                              value={editReminderTime}
                              onChange={(e) => setEditReminderTime(e.target.value)}
                              step="60"
                              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors outline-none cursor-pointer"
                            />
                            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1.5">
                              Notifikasi akan dikirim setiap {scheduleLabel(editSavingSchedule).toLowerCase()} pukul {editReminderTime}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0 flex gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3.5 rounded-2xl font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">Batal</button>
                <button
                  type="submit"
                  form="edit-form"
                  disabled={isUpdatingTarget}
                  className="flex-[2] py-3.5 rounded-2xl font-bold text-neutral-950 bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60"
                >
                  {isUpdatingTarget ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Update Success Modal */}
      <AnimatePresence>
        {showUpdateSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setShowUpdateSuccess(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
            >
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Perubahan Disimpan</h3>
              <p className="text-neutral-500 dark:text-neutral-400 mb-8">Target berhasil diperbarui.</p>
              <button onClick={() => setShowUpdateSuccess(false)} className="w-full py-3 rounded-xl font-bold bg-emerald-500 text-neutral-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all">Tutup</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #d4d4d4; border-radius: 20px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #3f3f46; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #a3a3a3; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #52525b; }
      `}</style>
    </div>
  );
};
