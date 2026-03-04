/**
 * Router principal. Usa routes.config como fuente de verdad.
 */

import { createElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import Login from '@/modules/auth/pages/Login';
import ProtectedRoute from '@/modules/auth/components/ProtectedRoute';
import DashboardLayout from '@/shared/layouts/DashboardLayout';
import NotFoundPage from '@/core/routes/NotFoundPage';
import {
  protectedRoutesConfig,
  defaultAuthenticatedPath,
} from '@/core/routes/routes.config';
import { protectedRouteComponents } from '@/core/routes/protectedRouteComponents';
import { ROUTES } from '@/shared/utils/constants';

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
