import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAppContext } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { Bell, Wallet, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-emerald-500 text-white p-1.5 rounded-lg">
                  <Wallet className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                  TaGo
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full relative transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-neutral-900"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <>
                        <div
                          className="fixed inset-0 sm:hidden z-40"
                          onClick={() => setShowNotifications(false)}
                        ></div>

                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="fixed sm:absolute left-1/2 sm:left-auto right-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 top-16 sm:top-auto mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-800 py-2 z-50"
                        >
                          <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Notifikasi</h3>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">{unreadCount} belum dibaca</span>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">Belum ada notifikasi.</p>
                            ) : (
                              notifications.map(notif => (
                                <div
                                  key={notif.id}
                                  onClick={() => markNotificationRead(notif.id)}
                                  className={`px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors ${!notif.read ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : ''}`}
                                >
                                  <p className={`text-sm ${!notif.read ? 'font-medium text-neutral-900 dark:text-neutral-100' : 'text-neutral-600 dark:text-neutral-400'}`}>{notif.message}</p>
                                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
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

              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/dashboard"
                    className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname.includes('/dashboard')
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-700 hidden sm:block"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium hidden sm:block text-neutral-900 dark:text-neutral-100">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/guest" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 px-3 py-2">
                    Coba Dulu
                  </Link>
                  <Link to="/login" className="text-sm font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm">
                    Masuk
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Simple Footer */}
      {!user && (
        <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-neutral-500 dark:text-neutral-400 text-sm">
            <p>&copy; {new Date().getFullYear()} TaGo. Aplikasi Tabungan Goal.</p>
          </div>
        </footer>
      )}
    </div>
  );
};
