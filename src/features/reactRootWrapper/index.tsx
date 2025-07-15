import React from 'react';
import { QueryProvider } from './QueryClientProvider';
import { RoleProvider } from '../../contexts/RoleContext';
import { AuthRedirectGate } from '../authRedirect/auth-redirect-gate';


// Provider separato per Role Context
const AppRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RoleProvider>
      {children}
    </RoleProvider>
  );
};

// Export della configurazione con provider separati
export const react_root_wrapper = () => [
  {
    target: "$REACT_ROOT_WRAPPER",
    handler: {
      component: AuthRedirectGate,
    },
  },
  {
    target: '$REACT_ROOT_WRAPPER',
    handler: {
      component: QueryProvider,
    },
  },
  {
    target: '$REACT_ROOT_WRAPPER',
    handler: {
      component: AppRoleProvider,
    },
  }
  // Puoi aggiungere altri target se necessario:
  // {
  //   target: '$ONE_LAYOUT_HEADER',
  //   handler: {
  //     component: GlobalHeader,
  //   },
  // },
];
