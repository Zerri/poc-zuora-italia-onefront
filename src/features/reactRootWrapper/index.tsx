import { AppQueryProvider } from './AppQueryProvider';
import { AppAuthRedirectGate } from './AppAuthRedirectGate';
import { AppRoleProvider } from './AppRoleProvider';
import { AppUserProvider } from './AppUserProvider';

// Export della configurazione con provider separati
// L'ordinamento di questi provider è importante per garantire che le dipendenze siano rispettate
export const react_root_wrapper = () => [
  {
    target: '$REACT_ROOT_WRAPPER',
    handler: {
      component: AppQueryProvider,
    },
  },
  {
    target: "$REACT_ROOT_WRAPPER",
    handler: {
      component: AppAuthRedirectGate,
    },
  },
  {
    target: '$REACT_ROOT_WRAPPER',
    handler: {
      component: AppUserProvider,
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
