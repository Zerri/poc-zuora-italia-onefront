import { MigrationPage } from './migration';

export const migration = () => [
  {
    target: '$ONE_LAYOUT_ROUTE',
    handler: {
      exact: true,
      path: '/migration/:subscriptionId',
      element: <MigrationPage />,
    },
  },
];