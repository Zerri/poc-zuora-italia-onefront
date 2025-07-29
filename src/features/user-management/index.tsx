// src/features/user-management/index.tsx
import { UserManagementPage } from './user-management';

export const userManagement = () => [
  {
    target: '$ONE_LAYOUT_ROUTE',
    handler: {
      exact: true,
      path: '/user-management',
      element: <UserManagementPage />,
    },
  },
];