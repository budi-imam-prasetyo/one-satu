import { RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { router } from './router';
import { AppProvider } from './store';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
    return (
        <GoogleOAuthProvider
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        >
            <AppProvider>
                <ThemeProvider>
                    <RouterProvider router={router} />
                </ThemeProvider>
            </AppProvider>
        </GoogleOAuthProvider>
    );
}