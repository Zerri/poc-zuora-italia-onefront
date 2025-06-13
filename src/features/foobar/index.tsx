import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FooBar } from './FooBar';

const queryClient = new QueryClient();

const FoobarWithQueryClientProvider = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FooBar />
    </QueryClientProvider>
  );
};



export const foobar = () => [
  {
    target: '$ONE_TOOLBAR_CONTENT_RIGHT',
    handler: {
      component: FoobarWithQueryClientProvider
    },
  },
];