import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuotesPage } from './quotes';
// import { NavContent } from './nav-content';

const queryClient = new QueryClient();

const QuotesPageWithQueryClientProvider = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <QuotesPage />
    </QueryClientProvider>
  );
};

export const quotes = () => [
  // {
  //   target: '$ONE_LAYOUT_NAV_CONTENT',
  //   handler: {
  //     component: NavContent,
  //   },
  // },
  {
    target: '$ONE_LAYOUT_ROUTE',
    handler: {
      exact: true,
      path: '/quotes',
      element: <QuotesPageWithQueryClientProvider />,
    },
  },
];