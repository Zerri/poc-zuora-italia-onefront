// features/layout-provider/index.ts
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoleProvider } from '../../contexts/RoleContext';

// Crea QueryClient globale
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minuti
      gcTime: 10 * 60 * 1000,   // 10 minuti
    },
  },
});

// Componente che wrappa tutti i provider necessari
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    
      <QueryClientProvider client={queryClient}>
        <RoleProvider>
          {children}
        </RoleProvider>
      </QueryClientProvider>
  );
};

export const layout_provider = () => [
  {
    target: '$REACT_ROOT_WRAPPER',
    handler: {
      component: AppProviders,
    },
  },
  // Puoi aggiungere altri target se necessario:
  // {
  //   target: '$ONE_LAYOUT_HEADER',
  //   handler: {
  //     component: GlobalHeader,
  //   },
  // },
];