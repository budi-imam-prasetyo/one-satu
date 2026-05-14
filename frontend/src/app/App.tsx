import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './router';
import { AppProvider } from './store/index';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ThemeProvider>
  );
}
