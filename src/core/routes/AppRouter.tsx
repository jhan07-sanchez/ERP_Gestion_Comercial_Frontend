/**
 * Router principal. Usa routes.config como fuente de verdad.
 */

import { createElement, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import Login from '@/modules/auth/pages/Login';
import PlanesPage from '@/modules/auth/pages/PlanesPage';
import ProtectedRoute from '@/modules/auth/components/ProtectedRoute';
import DashboardLayout from '@/shared/layouts/DashboardLayout';
import NotFoundPage from '@/core/routes/NotFoundPage';
import { Loader } from '@/shared/components/ui';
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
          <Route path={ROUTES.PLANES} element={<PlanesPage />} />

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
              const element = (
                <Suspense fallback={<div className="flex justify-center items-center h-full min-h-[50vh]"><Loader /></div>}>
                  {createElement(Component, placeholderProps ?? {})}
                </Suspense>
              );
              return <Route key={path} path={path} element={element} />;
            })}
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
