import type { PropsWithChildren } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { appRouter } from './app.router';
import { useAuthStore } from './stores/auth/useAuthStore';

const queryClient = new QueryClient();

const CheckAuthProvider = ({ children }: PropsWithChildren) => {
  const { checkAuthStatus } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuthStatus,
    retry: false,
    refetchInterval: 1000 * 60 * 60 * 1.5, // Hora y media,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span>Cargando aplicación...</span>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Custom provider */}
      <CheckAuthProvider>
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
            classNames: {
              error: 'text-red-400',
              success: 'text-emerald-400',
              warning: 'text-yellow-400',
              info: 'text-blue-400',
            },
          }}
        />
        <RouterProvider router={appRouter} />
      </CheckAuthProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
