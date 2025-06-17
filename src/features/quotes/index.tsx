import { QuotesPage } from './quotes';
// import { NavContent } from './nav-content';

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
      element: <QuotesPage />,
    },
  },
];