import { Customers } from './customers';
import { NavContent } from './nav-content';

export const customers = () => [
	{
		target: '$ONE_LAYOUT_NAV_CONTENT',
		handler: {
			component: NavContent,
		},
	},
	{
		target: '$ONE_LAYOUT_ROUTE',
		handler: {
			exact: true,
			path: '/customers',
			element: <Customers />,
		},
	},
];
