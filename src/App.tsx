// src/App.tsx
/**
 * 🚀 COMPONENTE PRINCIPAL
 * 
 * Este es el punto de entrada de la aplicación.
 * Solo renderiza el router principal.
 */

import AppRouter from '@/core/routes/AppRouter';
import { AlertProvider } from '@/shared/components/alerts';
import { ConfigLoader } from '@/core/providers/ConfigLoader';
import { SessionTimeoutManager } from '@/shared/components/session/SessionTimeoutManager';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AlertProvider>
        <ConfigLoader>
          <SessionTimeoutManager />
          <AppRouter />
        </ConfigLoader>
      </AlertProvider>
    </QueryClientProvider>
  );
}

export default App;