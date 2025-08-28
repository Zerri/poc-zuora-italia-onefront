// src/features/user-management/index.tsx
import { CustomerManagementPage } from './customer-management';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export const customerManagement = () => [
  {
    target: '$ONE_LAYOUT_ROUTE',
    handler: {
      exact: true,
      path: '/admin/customers',
      element: (
        <ProtectedRoute requiredRoute="/admin/customers">
          <CustomerManagementPage />
        </ProtectedRoute>
      ),
    },
  },
];