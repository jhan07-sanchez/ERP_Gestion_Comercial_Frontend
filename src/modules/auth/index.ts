/**
 * Módulo de Autenticación
 * Exporta todo lo necesario para usar el módulo desde fuera
 */

// API
export { authAPI } from './api/auth.api';

// Pages
export { default as Login } from './pages/Login';

// Components
export { default as ProtectedRoute } from './components/ProtectedRoute';

// Store
export { useAuthStore } from './store/auth.store';

// Types
export type * from './types';
