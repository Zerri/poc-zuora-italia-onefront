import { CatalogPage } from './catalog';
// import { NavContent } from './nav-content';

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
      element: <CatalogPage />,
    },
  },
];
