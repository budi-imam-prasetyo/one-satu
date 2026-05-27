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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, targets, isLoading, logout } = useAppContext();
  const tokenExpired = authService.isAccessTokenExpired();

  useEffect(() => {
    if (tokenExpired) {
      logout();
    }
  }, [tokenExpired, logout]);

  if (isLoading) return null;
  if (tokenExpired) return <Navigate to="/login" replace />;
  if (!user && targets.length === 0) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAppContext();
  if (isLoading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'guest', element: <GuestPage /> },
      { path: 'login', element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute> },
      { path: 'register', element: <PublicOnlyRoute><RegisterPage /></PublicOnlyRoute> },
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
