import React, { useState } from 'react';
import { Link } from 'react-router';
import { Target, Calendar, BellRing, ArrowRight, Sparkles, ChevronRight, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

export const Home = () => {
  // Simulator States
  const [simTarget, setSimTarget] = useState(10000000); // 10 Million Rp
  const [simSaving, setSimSaving] = useState(500000); // 500k Rp
  const [simSchedule, setSimSchedule] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const calculatePeriods = () => {
    if (simSaving <= 0) return 0;
    return Math.ceil(simTarget / simSaving);
  };

  const calculateDurationText = () => {
    const periods = calculatePeriods();
    if (simSchedule === 'daily') return `${periods} Hari`;
    if (simSchedule === 'weekly') return `${periods} Minggu`;
    return `${periods} Bulan`;
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background relative bg-grid-pattern">
      {/* Decorative Floating Mesh Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-400/20 dark:bg-emerald-950/20 blur-[120px] animate-blob-slow -z-10 pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/20 dark:bg-indigo-950/20 blur-[130px] animate-blob-delayed -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-teal-400/10 dark:bg-teal-950/15 blur-[120px] animate-blob-slow -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              className="lg:col-span-6 text-center lg:text-left space-y-6 z-10"
            >
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/20 tracking-wider uppercase mx-auto lg:mx-0">
                <Sparkles className="w-3.5 h-3.5" />
                Cara Pintar Capai Keuangan Impian
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
                Wujudkan Impianmu <br />
                Secara Konsisten dengan <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">TaGo</span>
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Platform pencatat dan pemantau target tabungan cerdas. Rancang gol keuanganmu secara presisi, dapatkan visualisasi progres dinamis, serta notifikasi pengingat otomatis.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  to="/login"
                  className="inline-flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_8px_35px_rgb(16,185,129,0.55)] active:scale-[0.98] group"
                >
                  Mulai Menabung Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/guest"
                  className="inline-flex justify-center items-center gap-2 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800/80 px-8 py-4 rounded-2xl font-bold hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-all active:scale-[0.98]"
                >
                  Coba Mode Tamu
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right Content: Interactive Savings Simulator Widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.15 }}
              className="lg:col-span-6 mt-16 lg:mt-0 relative"
            >
              {/* Ambient Glow Behind Simulator */}
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 blur-xl -z-10 group-hover:opacity-30 transition-opacity" />
              
              {/* Glassmorphic Widget Container */}
              <div className="glass-panel rounded-[2.2rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/40 dark:border-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white leading-tight">Simulator Target</h3>
                      <p className="text-xs text-muted-foreground">Rancang target menabung secara instan</p>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
                </div>

                <div className="space-y-6">
                  {/* Target Amount Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs text-slate-500 dark:text-slate-400">Target Dana Impian</label>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(simTarget)}</span>
                    </div>
                    <input
                      type="range"
                      min="1000000"
                      max="100000000"
                      step="1000000"
                      value={simTarget}
                      onChange={(e) => setSimTarget(Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-200 dark:bg-neutral-800 h-1.5 rounded-full cursor-pointer transition-all"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>Rp1 Jt</span>
                      <span>Rp50 Jt</span>
                      <span>Rp100 Jt</span>
                    </div>
                  </div>

                  {/* Schedule Segment Selector */}
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 block mb-2">Jadwal Pengisian Saldo</label>
                    <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-neutral-950 p-1 rounded-xl border border-slate-200/30 dark:border-slate-800/30">
                      {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => {
                            setSimSchedule(mode);
                            if (mode === 'daily') setSimSaving(50000);
                            else if (mode === 'weekly') setSimSaving(250000);
                            else setSimSaving(1000000);
                          }}
                          className={`py-2 rounded-lg text-xs font-bold transition-all capitalize ${
                            simSchedule === mode
                              ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/10 dark:border-slate-700/20'
                              : 'text-muted-foreground hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          {mode === 'daily' ? 'Harian' : mode === 'weekly' ? 'Mingguan' : 'Bulanan'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Saving Amount Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        Setoran per {simSchedule === 'daily' ? 'Hari' : simSchedule === 'weekly' ? 'Minggu' : 'Bulan'}
                      </label>
                      <span className="text-sm font-bold text-slate-950 dark:text-slate-100">{formatRupiah(simSaving)}</span>
                    </div>
                    <input
                      type="range"
                      min={simSchedule === 'daily' ? 10000 : simSchedule === 'weekly' ? 50000 : 100000}
                      max={simSchedule === 'daily' ? 1000000 : simSchedule === 'weekly' ? 5000000 : 10000000}
                      step={simSchedule === 'daily' ? 10000 : simSchedule === 'weekly' ? 50000 : 100000}
                      value={simSaving}
                      onChange={(e) => setSimSaving(Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-200 dark:bg-neutral-800 h-1.5 rounded-full cursor-pointer transition-all"
                    />
                  </div>

                  {/* Result Showcase Deck */}
                  <div className="bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-500/15 rounded-2xl p-4 flex items-center justify-between gap-4 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Estimasi Waktu Tercapai</p>
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{calculateDurationText()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Jumlah Periode Tabungan</p>
                      <p className="text-base font-bold text-slate-800 dark:text-slate-200">{calculatePeriods()} Kali Transfer</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-100/50 dark:bg-neutral-900/30 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Mengapa Memilih TaGo?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Kami menyederhanakan cara Anda menabung dengan fitur terintegrasi yang dirancang khusus untuk mempercepat tercapainya segala target finansial Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/40 relative overflow-hidden group hover:shadow-glow-emerald transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Target Keuangan Presisi</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Buat gol tabungan spesifik lengkap dengan foto barang impian Anda, deskripsi nominal, serta estimasi tanggal pencapaian otomatis secara dinamis.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/40 relative overflow-hidden group hover:shadow-glow-indigo transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Statistik Terintegrasi</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Analisis tren menabung Anda menggunakan indikator melingkar modern dan visualisasi log transaksi komprehensif yang dirancang sangat intuitif.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/40 relative overflow-hidden group hover:shadow-glow-emerald transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="w-12 h-12 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-6 border border-teal-500/20 group-hover:scale-110 transition-transform">
                <BellRing className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Notifikasi Pintar</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tetap disiplin menabung dengan sistem notifikasi pengingat otomatis di jam-jam pilihan Anda, menjaga konsistensi keuangan Anda setiap saat.
              </p>
            </motion.div>
          </div>

        </div>
      </section>
    </div>
  );
};
