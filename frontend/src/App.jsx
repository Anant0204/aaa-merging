import React from 'react';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeModeProvider } from './contexts/ThemeContext';
import { AlertProvider } from './contexts/AlertContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import AppRoutes from './routes/AppRoutes';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Turn off for predictable mock database usage
      retry: false,
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeModeProvider>
          <AlertProvider>
            <CurrencyProvider>
              <HashRouter>
                <AppRoutes />
              </HashRouter>
            </CurrencyProvider>
          </AlertProvider>
        </ThemeModeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
