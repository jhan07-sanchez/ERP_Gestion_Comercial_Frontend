/**
 * Router principal. Usa routes.config como fuente de verdad.
 */

import { createElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Login from '@/auth/Login';
import ProtectedRoute from '@/auth/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import NotFoundPage from '@/routes/NotFoundPage';
import {
  protectedRoutesConfig,
  defaultAuthenticatedPath,
} from '@/routes/routes.config';
import { protectedRouteComponents } from '@/routes/protectedRouteComponents';
import { ROUTES } from '@/utils/constants';

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOME} element={<Navigate to={defaultAuthenticatedPath} replace />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {protectedRoutesConfig.map(({ path, componentKey, placeholderProps }) => {
              const Component = protectedRouteComponents[componentKey];
              const element = createElement(Component, placeholderProps ?? {});
              return <Route key={path} path={path} element={element} />;
            })}
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
