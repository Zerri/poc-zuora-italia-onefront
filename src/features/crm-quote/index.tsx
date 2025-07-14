import { CRMIntegrationPage } from './crm-quote';

export const crm_quote = () => [
  {
    target: '$ONE_LAYOUT_ROUTE',
    handler: {
      exact: true,
      path: '/crm-quote',
      element: <CRMIntegrationPage />,
    },
  },
  {
    target: '$ONE_LAYOUT_ROUTE',
    handler: {
      exact: true,
      path: '/crm-quote/:customerId',
      element: <CRMIntegrationPage />,
    },
  },
];
