import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MigrationPage } from './migration';

const queryClient = new QueryClient();

const MigrationPageWithQueryClientProvider = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MigrationPage />
    </QueryClientProvider>
  );
};

export const migration = () => [
  {
    target: '$ONE_LAYOUT_ROUTE',
    handler: {
      exact: true,
      path: '/migration/:subscriptionId',
      element: <MigrationPageWithQueryClientProvider />,
    },
  },
];