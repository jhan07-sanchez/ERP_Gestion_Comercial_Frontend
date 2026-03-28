/**
 * Configuración centralizada de rutas (paths y claves de componente).
 * Los elementos se construyen en AppRouter para cumplir react-refresh.
 */

import { ROUTES } from '@/shared/utils/constants';

export interface RouteConfigItem {
  path: string;
  componentKey: ProtectedRouteKey;
  placeholderProps?: { title: string; description?: string };
}

/** Claves de componentes para rutas protegidas */
export type ProtectedRouteKey =
  | "Dashboard"

  | "VentasList"
  | "VentaCreate"
  | "VentaEdit"
  | "VentaDetalle"

  | "Reportes"

  | "AuditoriaLogs"

  | "Configuracion"

  | "ProductosList"
  | "ProductoCreate"
  | "ProductoEdit"
  | "CategoriasList" // ← NUEVO

  | "ClientesList"
  | "ClienteCreate"
  | "ClienteEdit"

  | "ProveedorList"
  | "ProveedorCreate"
  | "ProveedorEdit"

  | "ComprasList"
  | "CompraCreate"
  | "CompraEdit"
  | "CompraDetalles"

  | "CajaCreate"
  | "CajaList"
  | "CajaAbrir"
  | "CajaDetail"
  | "CajaCierre"
  | "CajaMovimientos"
  | "CajaArqueo"
  | "CajaDashboard"



/**
 * Rutas protegidas (path relativo al layout).
 */
export const protectedRoutesConfig: RouteConfigItem[] = [
  {
    path: "dashboard",
    componentKey: "Dashboard",
    placeholderProps: {
      title: "Dashboard",
      description: "Bienvenido al sistema ERP.",
    },
  },

  {
    path: "ventas/lista",
    componentKey: "VentasList",
    placeholderProps: { title: "Ventas", description: "Gestión de ventas." },
  },
  {
    path: "ventas/crear",
    componentKey: "VentaCreate",
    placeholderProps: {
      title: "Crear Venta",
      description: "Registra una nueva venta.",
    },
  },
  {
    path: "ventas/:id/editar",
    componentKey: "VentaEdit",
    placeholderProps: {
      title: "Editar Venta",
      description: "Modifica los detalles de la venta.",
    },
  },
  {
    path: "ventas/:id/detalle",
    componentKey: "VentaDetalle",
    placeholderProps: {
      title: "Detalle de Venta",
      description: "Información detallada de la venta.",
    },
  },
  {
    path: "caja/crear",
    componentKey: "CajaCreate",
    placeholderProps: {
      title: "Crear Caja",
      description: "Registra una nueva caja.",
    },
  },
  {
    path: "caja/lista",
    componentKey: "CajaList",
    placeholderProps: {
      title: "Lista de Cajas",
      description: "Gestión de cajas.",
    },
  },
  {
    path: "caja/sesiones/nueva",
    componentKey: "CajaAbrir",
    placeholderProps: {
      title: "Abrir Sesión",
      description: "Abre una sesión de caja.",
    },
  },
  {
    path: "caja/abrir/:id",
    componentKey: "CajaAbrir",
    placeholderProps: {
      title: "Abrir Caja",
      description: "Abre una sesión de una caja específica.",
    },
  },
  {
    path: "caja/sesion/:id",
    componentKey: "CajaDetail",
    placeholderProps: {
      title: "Detalle de Sesión",
      description: "Ver detalles y operaciones de la sesión de caja.",
    },
  },
  {
    path: "caja/sesiones/:id",
    componentKey: "CajaDetail",
    placeholderProps: {
      title: "Gestionar Caja",
      description: "Gestionar sesión activa de la caja.",
    },
  },
  {
    path: "caja/sesion/:id/cerrar",
    componentKey: "CajaCierre",
    placeholderProps: {
      title: "Cerrar Caja",
      description: "Cierre de sesión de caja con arqueo.",
    },
  },
  {
    path: "caja/sesion/:id/movimientos",
    componentKey: "CajaMovimientos",
    placeholderProps: {
      title: "Movimientos de Caja",
      description: "Registrar y consultar movimientos de caja.",
    },
  },
  {
    path: "caja/sesion/:id/arqueo",
    componentKey: "CajaArqueo",
    placeholderProps: {
      title: "Arqueo de Caja",
      description: "Conteo físico vs sistema.",
    },
  },
  {
    path: "caja/dashboard",
    componentKey: "CajaDashboard",
    placeholderProps: {
      title: "Dashboard de Caja",
      description: "Resumen rápido de la sesión activa.",
    },
  },
  {
    path: "productos/lista",
    componentKey: "ProductosList",
    placeholderProps: {
      title: "Productos",
      description: "Lista de productos.",
    },
  },
  {
    path: "productos/crear",
    componentKey: "ProductoCreate",
    placeholderProps: {
      title: "Crear Producto",
      description: "Registra un nuevo producto.",
    },
  },
  {
    path: "productos/:id/editar",
    componentKey: "ProductoEdit",
    placeholderProps: {
      title: "Editar Producto",
      description: "Modifica los detalles del producto.",
    },
  },
  {
    path: "categorias/lista",
    componentKey: "CategoriasList",
    placeholderProps: {
      title: "Categorías",
      description: "Lista de categorías de productos.",
    },
  }, // ← NUEVO

  {
    path: "clientes/lista",
    componentKey: "ClientesList",
    placeholderProps: { title: "Clientes", description: "Lista de clientes." },
  },
  {
    path: "clientes/crear",
    componentKey: "ClienteCreate",
    placeholderProps: {
      title: "Crear Cliente",
      description: "Registra un nuevo cliente.",
    },
  },
  {
    path: "clientes/:id/editar",
    componentKey: "ClienteEdit",
    placeholderProps: {
      title: "Editar Cliente",
      description: "Modifica los detalles del cliente.",
    },
  },

  {
    path: "proveedores/lista",
    componentKey: "ProveedorList",
    placeholderProps: {
      title: "Proveedores",
      description: "Lista de proveedores.",
    },
  },
  {
    path: "proveedores/crear",
    componentKey: "ProveedorCreate",
    placeholderProps: {
      title: "Crear Proveedor",
      description: "Registra un nuevo proveedor.",
    },
  },
  {
    path: "proveedores/:id/editar",
    componentKey: "ProveedorEdit",
    placeholderProps: {
      title: "Editar Proveedor",
      description: "Modifica los detalles del proveedor.",
    },
  },

  {
    path: "compras/lista",
    componentKey: "ComprasList",
    placeholderProps: { title: "Compras", description: "Gestión de compras." },
  },
  {
    path: "compras/crear",
    componentKey: "CompraCreate",
    placeholderProps: {
      title: "Crear Compra",
      description: "Registra una nueva compra.",
    },
  },
  {
    path: "compras/:id/editar",
    componentKey: "CompraEdit",
    placeholderProps: {
      title: "Editar Compra",
      description: "Modifica los detalles de la compra.",
    },
  },
  {
    path: "compras/:id/detalles",
    componentKey: "CompraDetalles",
    placeholderProps: {
      title: "Detalles de Compra",
      description: "Información detallada de la compra.",
    },
  },

  {
    path: "reportes",
    componentKey: "Reportes",
    placeholderProps: {
      title: "Reportes",
      description: "Visualiza los reportes del sistema.",
    },
  },

  {
    path: "auditoria/lista",
    componentKey: "AuditoriaLogs",
    placeholderProps: {
      title: "Centro de Auditoría",
      description: "Historial completo de acciones y cambios en el ERP.",
    },
  },

  {
    path: "configuracion",
    componentKey: "Configuracion",
    placeholderProps: {
      title: "Configuración",
      description: "Configuración del sistema.",
    },
  },
];

export const defaultAuthenticatedPath = ROUTES.DASHBOARD;
