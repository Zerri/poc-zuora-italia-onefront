import { Dashboard } from './dashboard';
import { NavContent } from './nav-content';

export const dashboard = () => [
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
			path: '/',
			element: <Dashboard />,
		},
	},
];
