// src/auth/ProtectedRoute.tsx
/**
 * 🔒 PROTECTED ROUTE
 * 
 * Componente que protege rutas que requieren autenticación.
 * Si el usuario NO está autenticado, lo redirige al login.
 * 
 * USO:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */

import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { ROUTES } from '@/shared/utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, checkingSession, loadUser } = useAuthStore();
  const location = useLocation();

  // Al montar el componente, verificar si hay sesión activa
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Mostrar loading mientras verifica la sesión inicial
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
          <p className="mt-4 text-primary-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si NO está autenticado, redirigir al login
  // Guardamos la ruta que intentaba acceder para redirigir después
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
}