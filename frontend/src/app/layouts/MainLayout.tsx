import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAppContext } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { Bell, Wallet, LogOut, LayoutDashboard, Sun, Moon, Home as HomeIcon, LogIn, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MainLayout = () => {
  const { user, logout, notifications, markNotificationRead } = useAppContext();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isTabActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname.startsWith('/target/');
    }
    if (path === '/profile') {
      return location.pathname === '/profile';
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col relative pb-20 sm:pb-0">
      
      {/* Premium Sticky Navigation Header */}
      <nav className="glass-panel sticky top-0 z-50 border-b border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 p-2 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  <Wallet className="w-5 h-5 text-slate-950" />
                </motion.div>
                <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 font-display tracking-tight group-hover:opacity-85 transition-opacity">
                  TaGo
                </span>
              </Link>
            </div>

            {/* Desktop and Universal Options */}
            <div className="flex items-center gap-2">
              
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2.5 text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-neutral-800/50 rounded-xl transition-all"
                title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {/* Desktop Notification bell */}
              {user && (
                <div className="relative hidden sm:block">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2.5 text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-neutral-800/50 rounded-xl relative transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-neutral-900 animate-pulse"></span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {showNotifications && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.96 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          className="absolute right-0 mt-3 w-80 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-neutral-800/50 py-3 z-50 glass-panel"
                        >
                          <div className="px-4 py-2.5 border-b border-slate-200/30 dark:border-slate-800/30 flex justify-between items-center">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifikasi</h3>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">{unreadCount} baru</span>
                          </div>
                          <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                              <p className="text-xs text-muted-foreground text-center py-6">Belum ada notifikasi.</p>
                            ) : (
                              notifications.map(notif => (
                                <div
                                  key={notif.id}
                                  onClick={() => markNotificationRead(notif.id)}
                                  className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors border-b border-slate-200/10 dark:border-slate-800/10 ${!notif.read ? 'bg-emerald-500/5' : ''}`}
                                >
                                  <p className={`text-xs ${!notif.read ? 'font-semibold text-slate-900 dark:text-white' : 'text-muted-foreground'}`}>{notif.message}</p>
                                  <p className="text-[10px] text-slate-400 mt-1">
                                    {new Date(notif.date).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Desktop Nav Items */}
              <div className="hidden sm:flex items-center gap-3">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        isTabActive('/dashboard')
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'text-muted-foreground hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 bg-slate-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl border border-slate-200/30 dark:border-slate-700/30 hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{user.name.split(' ')[0]}</span>
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/guest" className="text-xs font-bold text-muted-foreground hover:text-slate-950 dark:hover:text-white px-4 py-2">
                      Coba Dulu
                    </Link>
                    <Link to="/login" className="text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-5 py-2.5 rounded-xl transition-all shadow-sm">
                      Masuk
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        <Outlet />
      </main>

      {/* Premium Floating Mobile Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-50 h-16 glass-panel rounded-2xl flex items-center justify-around px-2 shadow-2xl border border-slate-200/50 dark:border-neutral-800/50">
        
        {/* Tab 1: Beranda / Dashboard */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex flex-col items-center justify-center flex-1 h-full relative"
        >
          <div className={`p-2 rounded-xl relative ${isTabActive('/dashboard') || location.pathname === '/' ? 'text-emerald-500 dark:text-emerald-400' : 'text-muted-foreground'}`}>
            {user ? <LayoutDashboard className="w-5 h-5" /> : <HomeIcon className="w-5 h-5" />}
            {(isTabActive('/dashboard') || location.pathname === '/') && (
              <motion.div
                layoutId="activeTabMobile"
                className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </div>
          <span className={`text-[9px] font-bold mt-0.5 ${isTabActive('/dashboard') || location.pathname === '/' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
            {user ? 'Dashboard' : 'Beranda'}
          </span>
        </Link>

        {/* Tab 2: Notifikasi (Bell toggles bottom-drawer on mobile) */}
        {user && (
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex flex-col items-center justify-center flex-1 h-full relative"
          >
            <div className={`p-2 rounded-xl relative ${showNotifications ? 'text-emerald-500 dark:text-emerald-400' : 'text-muted-foreground'}`}>
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-neutral-900 animate-pulse"></span>
              )}
              {showNotifications && (
                <motion.div
                  layoutId="activeTabMobile"
                  className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </div>
            <span className={`text-[9px] font-bold mt-0.5 ${showNotifications ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
              Notifikasi
            </span>
          </button>
        )}

        {/* Tab 3: Login/Profile */}
        {user ? (
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center flex-1 h-full relative"
          >
            <div className={`p-2 rounded-xl relative ${isTabActive('/profile') ? 'text-emerald-500 dark:text-emerald-400' : 'text-muted-foreground'} hover:text-emerald-500 transition-colors`}>
              <User className="w-5 h-5" />
              {isTabActive('/profile') && (
                <motion.div
                  layoutId="activeTabMobile"
                  className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </div>
            <span className={`text-[9px] font-bold mt-0.5 ${isTabActive('/profile') ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
              Profil
            </span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex flex-col items-center justify-center flex-1 h-full relative"
          >
            <div className={`p-2 rounded-xl relative ${isTabActive('/login') ? 'text-emerald-500 dark:text-emerald-400' : 'text-muted-foreground'}`}>
              <LogIn className="w-5 h-5" />
              {isTabActive('/login') && (
                <motion.div
                  layoutId="activeTabMobile"
                  className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </div>
            <span className={`text-[9px] font-bold mt-0.5 ${isTabActive('/login') ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
              Masuk
            </span>
          </Link>
        )}

      </div>

      {/* Mobile Notification Bottom Sheet Drawer */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-[100] sm:hidden flex items-end justify-center">
            {/* Background Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowNotifications(false)}
            />
            {/* Drawer Body Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative bg-white dark:bg-neutral-900 border-t border-slate-200/50 dark:border-neutral-800/50 rounded-t-[2.5rem] w-full max-h-[75vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-neutral-700 rounded-full mx-auto mt-4 mb-2 shrink-0" />
              <div className="px-6 py-4 flex justify-between items-center border-b border-slate-200/30 dark:border-slate-800/30 shrink-0">
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">Daftar Notifikasi</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-500 dark:text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 pb-16 space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-muted-foreground">Belum ada notifikasi.</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                      }}
                      className={`p-4 hover:bg-slate-50 dark:hover:bg-neutral-800/50 cursor-pointer rounded-2xl border border-slate-200/30 dark:border-slate-800/30 transition-all ${!notif.read ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-slate-50/50 dark:bg-neutral-900/50'}`}
                    >
                      <p className={`text-sm ${!notif.read ? 'font-semibold text-slate-900 dark:text-white' : 'text-muted-foreground'}`}>{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        {new Date(notif.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simple Global Footer (on desktop/public only) */}
      {!user && (
        <footer className="bg-white dark:bg-neutral-900 border-t border-slate-200/50 dark:border-slate-800/50 py-8 hidden sm:block shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-xs font-medium">
            <p>&copy; {new Date().getFullYear()} TaGo. Aplikasi Tabungan Goal Kelas Dunia.</p>
          </div>
        </footer>
      )}
    </div>
  );
};
