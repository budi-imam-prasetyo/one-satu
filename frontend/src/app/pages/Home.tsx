import React from 'react';
import { Link } from 'react-router';
import { Target, Calendar, BellRing, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Home = () => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-white dark:bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 dark:from-emerald-950/30 via-white dark:via-neutral-950 to-white dark:to-neutral-950 opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
                Wujudkan Impianmu dengan <span className="text-emerald-600">TaGo</span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-2xl mx-auto lg:mx-0">
                Aplikasi pintar untuk melacak, mengatur, dan mencapai setiap target tabunganmu. Mulai dari gadget baru hingga liburan impian, semuanya jadi lebih mudah.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/login"
                  className="inline-flex justify-center items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-95"
                >
                  Mulai Menabung
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/guest"
                  className="inline-flex justify-center items-center bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all active:scale-95"
                >
                  Coba Tanpa Login
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-6 mt-16 lg:mt-0"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/10 border border-neutral-100/50 dark:border-neutral-800/50">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent mix-blend-overlay"></div>
                <img
                  src="https://images.unsplash.com/photo-1691302174364-1958bc3d3ff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXZpbmdzJTIwcGlnZ3klMjBiYW5rfGVufDF8fHx8MTc3ODQ5MjQ0N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Savings Piggy Bank"
                  className="w-full h-auto object-cover object-center aspect-[4/3]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Fitur Unggulan TaGo</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg">Semua yang kamu butuhkan untuk mencapai target keuanganmu lebih cepat.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Target Spesifik</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Buat target tabungan spesifik dengan nominal dan tenggat waktu yang jelas agar kamu lebih termotivasi.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Visualisasi Progres</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Pantau perkembangan tabunganmu setiap hari dengan grafik progres yang menarik dan mudah dipahami.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700"
            >
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-6">
                <BellRing className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Pengingat Otomatis</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Dapatkan notifikasi rutin untuk mengingatkan jadwal menabungmu. Jangan sampai terlewat!
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
