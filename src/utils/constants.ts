/**
 * Constantes globales de la aplicación.
 * Única fuente de verdad para rutas y configuración.
 */

/** Rutas de la aplicación (paths) */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  VENTAS: '/ventas',
  PRODUCTOS: '/productos',
  PRODUCTOS_CREAR: '/productos/crear',
  PRODUCTOS_EDITAR: '/productos/:id/editar',
  CLIENTES: '/clientes',
  CLIENTES_CREAR: '/clientes/crear',
  CLIENTES_EDITAR: '/clientes/:id/editar',
  PROVEEDORES: '/proveedores',
  PROVEEDORES_CREAR: '/proveedores/crear',
  COMPRAS: '/compras',
  COMPRAS_CREAR: '/compras/crear',
  REPORTES: '/reportes',
  CONFIGURACION: '/configuracion',
} as const;

/** Nombre de la aplicación */
export const APP_NAME = 'ERP System';

/** Tiempo de timeout por defecto para peticiones (ms) */
export const API_TIMEOUT = 15000;
