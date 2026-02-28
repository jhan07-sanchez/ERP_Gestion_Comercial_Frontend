// src/App.tsx
/**
 * 🚀 COMPONENTE PRINCIPAL
 * 
 * Este es el punto de entrada de la aplicación.
 * Solo renderiza el router principal.
 */

import AppRouter from '@/routes/AppRouter';
import { AlertProvider } from '@/components/alerts';

function App() {
  return (
    <AlertProvider>
      <AppRouter />
    </AlertProvider>
  );
}

export default App;