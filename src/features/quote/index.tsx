import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuotePage } from './quote';

const queryClient = new QueryClient();

const QuotePageWithQueryClientProvider = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <QuotePage />
    </QueryClientProvider>
  );
};

export const quote = () => [
	{
		target: '$ONE_LAYOUT_ROUTE',
		handler: {
			exact: true,
			path: '/quote/:id',
			element: <QuotePageWithQueryClientProvider />,
		},
	},
];
