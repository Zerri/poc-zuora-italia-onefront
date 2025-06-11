import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomersPage } from './customers';
// import { NavContent } from './nav-content';

const queryClient = new QueryClient();

const CustomersPageWithQueryClientProvider = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomersPage />
    </QueryClientProvider>
  );
};

export const customers = () => [
	// {
	// 	target: '$ONE_LAYOUT_NAV_CONTENT',
	// 	handler: {
	// 		component: NavContent,
	// 	},
	// },
	{
		target: '$ONE_LAYOUT_ROUTE',
		handler: {
			exact: true,
			path: '/customers',
			element: <CustomersPageWithQueryClientProvider />,
		},
	},
];
