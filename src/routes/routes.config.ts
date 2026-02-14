/**
 * Configuración centralizada de rutas (paths y claves de componente).
 * Los elementos se construyen en AppRouter para cumplir react-refresh.
 */

import { ROUTES } from '@/utils/constants';

export interface RouteConfigItem {
  path: string;
  componentKey: ProtectedRouteKey;
  placeholderProps?: { title: string; description?: string };
}

/** Claves de componentes para rutas protegidas */
export type ProtectedRouteKey =
  | 'Dashboard'
  | 'Ventas'
  | 'Reportes'
  | 'Configuracion'
  | 'ProductosList'
  | 'ProductoCreate'
  | 'ProductoEdit'
  | 'ClientesList'
  | 'ClienteCreate'
  | 'ClienteEdit'
  | 'ProveedorList'
  | 'ProveedorCreate'
  | 'ProveedorEdit'
  | 'ComprasList'
  | 'CompraCreate'
  | 'CompraEdit';

/**
 * Rutas protegidas (path relativo al layout).
 */
export const protectedRoutesConfig: RouteConfigItem[] = [
  { path: 'dashboard', componentKey: 'Dashboard', placeholderProps: { title: 'Dashboard', description: 'Bienvenido al sistema ERP.' } },
  { path: 'ventas', componentKey: 'Ventas', placeholderProps: { title: 'Ventas', description: 'Gestión de ventas.' } },
  { path: 'productos', componentKey: 'ProductosList' },
  { path: 'productos/crear', componentKey: 'ProductoCreate' },
  { path: 'productos/:id/editar', componentKey: 'ProductoEdit' },
  { path: 'clientes', componentKey: 'ClientesList' },
  { path: 'clientes/crear', componentKey: 'ClienteCreate' },
  { path: 'clientes/:id/editar', componentKey: 'ClienteEdit' },
  { path: 'proveedores', componentKey: 'ProveedorList' },
  { path: 'proveedores/crear', componentKey: 'ProveedorCreate' },
  { path: 'proveedores/:id/editar', componentKey: 'ProveedorEdit' },

  { path: 'compras', componentKey: 'ComprasList' },
  { path: 'compras/crear', componentKey: 'CompraCreate' },
  { path: 'compras/:id/editar', componentKey: 'CompraEdit' },
  { path: 'reportes', componentKey: 'Reportes', placeholderProps: { title: 'Reportes', description: 'Reportes y estadísticas.' } },
  { path: 'configuracion', componentKey: 'Configuracion', placeholderProps: { title: 'Configuración', description: 'Configuración del sistema.' } },
];

export const defaultAuthenticatedPath = ROUTES.DASHBOARD;
