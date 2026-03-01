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
  | "Dashboard"

  | "VentasList"
  | "VentaCreate"
  | "VentaEdit"
  | "VentaDetalle"

  | "Reportes"

  | "AuditoriaActividadReciente"
  | "HistorialCambiosList"
  | "AccesosPage"
  | "ReportesAuditoriaPage"
  | "UsuariosAuditoriaPage"
  | "VentasAuditoriaPage"

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
  | "CompraDetalles";


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
    path: "auditorias/actividad_reciente",
    componentKey: "AuditoriaActividadReciente",
    placeholderProps: {
      title: "Actividad Reciente",
      description: "Historial completo de actividades del sistema.",
    },
  },
  {
    path: "auditorias/historial_cambios",
    componentKey: "HistorialCambiosList",
    placeholderProps: {
      title: "Historial de cambios",
      description: "Registro de actividades y eventos del sistema.",
    },
  },
  {
    path: "auditorias/accesos",
    componentKey: "AccesosPage",
    placeholderProps: { title: "Accesos", description: "Auditoría de accesos al sistema." },
  },
  {
    path: "auditorias/reportes",
    componentKey: "ReportesAuditoriaPage",
    placeholderProps: { title: "Reportes de auditoría", description: "Reportes del módulo de auditoría." },
  },
  {
    path: "auditorias/usuarios",
    componentKey: "UsuariosAuditoriaPage",
    placeholderProps: { title: "Auditoría por usuarios", description: "Actividad por usuario." },
  },
  {
    path: "auditorias/ventas",
    componentKey: "VentasAuditoriaPage",
    placeholderProps: { title: "Auditoría de ventas", description: "Historial de ventas." },
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
