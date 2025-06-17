import { QuotePage } from './quote';

export const quote = () => [
	{
		target: '$ONE_LAYOUT_ROUTE',
		handler: {
			exact: true,
			path: '/quote/:id',
			element: <QuotePage />,
		},
	},
	{
		target: '$ONE_LAYOUT_ROUTE',
		handler: {
			exact: true,
			path: '/quote',
			element: <QuotePage />,
		},
	},
];
