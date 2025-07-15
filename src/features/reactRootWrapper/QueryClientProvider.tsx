import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configurazione QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minuti
      gcTime: 10 * 60 * 1000,   // 10 minuti
    },
  },
});

// Provider React Query
export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
