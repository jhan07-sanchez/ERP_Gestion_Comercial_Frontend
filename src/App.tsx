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

function App() {
  return (
    <AlertProvider>
      <ConfigLoader>
        <AppRouter />
      </ConfigLoader>
    </AlertProvider>
  );
}

export default App;