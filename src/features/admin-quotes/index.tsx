// src/features/admin-quotes/index.tsx
import { AdminQuotesPage } from './admin-quotes';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export const adminQuotes = () => [
  {
    target: '$ONE_LAYOUT_ROUTE',
    handler: {
      exact: true,
      path: '/admin-quotes',
      element: (
        <ProtectedRoute requiredRoute="/admin-quotes">
          <AdminQuotesPage />
        </ProtectedRoute>
      ),
    },
  },
];