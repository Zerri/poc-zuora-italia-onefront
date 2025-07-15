import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoleProvider } from '../../contexts/RoleContext';
import { AuthRedirectGate } from '../authRedirect/auth-redirect-gate';


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

export const react_root_wrapper = () => [
  {
    target: '$REACT_ROOT_WRAPPER',
    handler: {
      component: AppProviders,
    },
  },
  {
    target: "$REACT_ROOT_WRAPPER",
    handler: {
    component: AuthRedirectGate,
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