// src/features/admin-quotes/index.tsx
import { AdminQuotesPage } from './admin-quotes';

export const adminQuotes = () => [
  {
    target: '$ONE_LAYOUT_ROUTE',
    handler: {
      exact: true,
      path: '/admin-quotes',
      element: <AdminQuotesPage />,
    },
  },
];