import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CatalogPage } from './catalog';
// import { NavContent } from './nav-content';

const queryClient = new QueryClient();

const CatalogPageWithQueryClientProvider = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CatalogPage />
    </QueryClientProvider>
  );
};

export const catalog = () => [
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
      path: '/catalog',
      element: <CatalogPageWithQueryClientProvider />,
    },
  },
];
