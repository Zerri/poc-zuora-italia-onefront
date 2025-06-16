import { RoleProvider } from '../../contexts/RoleContext';

export const layout_provider = () => [
  {
    target: '$REACT_ROOT_WRAPPER',
    handler: {
      component: RoleProvider,
    },
  },
  // {
  //   target: '$REACT_ROOT_WRAPPER',
  //   handler: {
  //     component: nProvider, //...
  //   },
  // },
];
