import React, { useEffect } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { GuestPage } from './pages/Auth/GuestPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { TargetDetail } from './pages/TargetDetail';
import { useAppContext } from './store';
import * as authService from './services/authService';

const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
    </div>
  );
};

// Halaman yang butuh login — jika belum login, redirect ke /login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, targets, isLoading, logout } = useAppContext();
  const tokenExpired = authService.isAccessTokenExpired();

  // Cek apakah ada sesi guest aktif di browser
  const hasGuestSession = !!localStorage.getItem('guest_temp_id');

  useEffect(() => {
    if (tokenExpired) logout();
  }, [tokenExpired, logout]);

  if (isLoading) return null;
  if (tokenExpired) return <Navigate to="/login" replace />;

  // Redirect ke login hanya jika: bukan user login, bukan guest, DAN tidak ada target
  // Guest boleh tetap di dashboard meski target kosong (biar bisa tambah lagi)
  if (!user && !hasGuestSession && targets.length === 0) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

// Halaman publik (Home, Login, Register) — jika sudah login, redirect ke /dashboard
// FIX BUG 1: mencegah halaman awal muncul lagi setelah login di tab baru


// Halaman guest — jika sudah login dengan akun asli, redirect ke /dashboard
// FIX BUG 2: mencegah user yang sudah login masuk ke halaman guest lalu "kepental"
const GuestOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAppContext();
  const tokenValid = !!localStorage.getItem('access_token') && !authService.isAccessTokenExpired();

  if (isLoading) return null;
  if (user && tokenValid) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAppContext();

  const tokenValid =
    !!localStorage.getItem("access_token") &&
    !authService.isAccessTokenExpired();
  const hasRealUser = !!localStorage.getItem('tago_user');

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (tokenValid && hasRealUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <PublicRoute><Home /></PublicRoute> },
      { path: 'guest', element: <GuestOnlyRoute><GuestPage /></GuestOnlyRoute> },
      { path: 'login', element: <PublicRoute><LoginPage /></PublicRoute> },
      { path: 'register', element: <PublicRoute><RegisterPage /></PublicRoute> },
      {
        path: 'dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: 'target/:id',
        element: <ProtectedRoute><TargetDetail /></ProtectedRoute>,
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);