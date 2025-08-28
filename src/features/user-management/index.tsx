// src/features/user-management/index.tsx
import { UserManagementPage } from './user-management';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export const userManagement = () => [
  {
    target: '$ONE_LAYOUT_ROUTE',
    handler: {
      exact: true,
      path: '/admin/users',
      element: (
        <ProtectedRoute requiredRoute="/admin/users">
          <UserManagementPage />
        </ProtectedRoute>
      ),
    },
  },
];