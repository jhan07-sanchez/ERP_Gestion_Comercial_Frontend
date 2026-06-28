/**
 * Configuración centralizada de rutas (paths y claves de componente).
 * Los elementos se construyen en AppRouter para cumplir react-refresh.
 */

import { ROUTES } from '@/shared/utils/constants';

export interface RouteConfigItem {
  path: string;
  componentKey: ProtectedRouteKey;
  placeholderProps?: { 
    title: string; 
    description?: string; 
    subtitle?: string; 
    defaultEstado?: string;
    tipo?: "CREDITO" | "DEBITO";
    filtroActiva?: boolean;
    filtroNombre?: string;
  };
}

/** Claves de componentes para rutas protegidas */
export type ProtectedRouteKey =
  | "Dashboard"
  | "DashboardKPIs"
  | "DashboardAnalytics"
  | "DashboardFacturacion"
  | "VentasList"
  | "VentaCreate"
  | "VentaEdit"
  | "VentaDetalle"
  | "Reportes"
  | "ReportesFinancieros"
  | "ReportesOperativos"
  | "AuditoriaLogs"
  | "DocumentosList"
  | "Configuracion"
  | "ProductosList"
  | "ProductoCreate"
  | "ProductoEdit"
  | "CategoriasList"
  | "CategoriasCreate" // ← NUEVO
  | "ClientesList"
  | "ClienteCreate"
  | "ClienteEdit"
  | "ProveedorList"
  | "ProveedorCreate"
  | "ProveedorEdit"
  | "ProveedorDetailPage"
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
  | "PrecioListPage"
  | "PrecioCreate"
  | "PrecioEdit"
  | "PrecioDetalle"
  | "FacturasVentaList"
  | "FacturaVentaCreate"
  | "FacturaVentaEdit"
  | "FacturaVentaDetalle"
  | "FacturasCompraList"
  | "PagosList"
  | "NotasList"
  | "ResolucionesList"
  | "ImpuestosList";




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
    path: "dashboard/kpis",
    componentKey: "DashboardKPIs",
    placeholderProps: {
      title: "KPIs",
      description: "Métricas y rendimiento comercial.",
    },
  },
  {
    path: "dashboard/analisis_rendimiento",
    componentKey: "DashboardAnalytics",
    placeholderProps: {
      title: "Análisis de Rendimiento",
      description: "Tendencias y comportamiento de inventario.",
    },
  },
  {
    path: "facturacion/dashboard",
    componentKey: "DashboardFacturacion",
    placeholderProps: {
      title: "Analisis de facturacion",
      description: "comportamiento sobre las facturas",
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
  },
  {
    path: "categorias/crear",
    componentKey: "CategoriasCreate",
    placeholderProps: {
      title: "Crear Categoría",
      description: "Agrega una nueva categoría de productos.",
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
    path: "proveedores/:id",
    componentKey: "ProveedorDetailPage",
    placeholderProps: {
      title: "Detalle del Proveedor",
      description: "Información detallada del proveedor.",
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
      title: "Centro de Inteligencia",
      description: "KPIs y analítica general del negocio.",
    },
  },
  {
    path: "reportes/financieros",
    componentKey: "ReportesFinancieros",
    placeholderProps: {
      title: "Reportes Financieros",
      description: "Balance General, Estado de Resultados y Flujo de Caja.",
    },
  },
  {
    path: "reportes/balance_general/activos",
    componentKey: "ReportesFinancieros",
  },
  {
    path: "reportes/balance_general/pasivos",
    componentKey: "ReportesFinancieros",
  },
  {
    path: "reportes/balance_general/patrimonio",
    componentKey: "ReportesFinancieros",
  },
  {
    path: "reportes/estado_resultados/ingresos",
    componentKey: "ReportesFinancieros",
  },
  {
    path: "reportes/estado_resultados/costos",
    componentKey: "ReportesFinancieros",
  },
  {
    path: "reportes/estado_resultados/utilidad",
    componentKey: "ReportesFinancieros",
  },
  {
    path: "reportes/flujo_caja/entradas",
    componentKey: "ReportesFinancieros",
  },
  {
    path: "reportes/flujo_caja/salidas",
    componentKey: "ReportesFinancieros",
  },
  {
    path: "reportes/flujo_caja/balance",
    componentKey: "ReportesFinancieros",
  },
  {
    path: "reportes/operativos",
    componentKey: "ReportesOperativos",
    placeholderProps: {
      title: "Analítica Operativa",
      description: "Productividad y eficiencia de ventas.",
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
    path: "documentos",
    componentKey: "DocumentosList",
    placeholderProps: {
      title: "Documentos",
      description: "Listado de documentos emitidos.",
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
  {
    path: "precios/lista",
    componentKey: "PrecioListPage",
    placeholderProps: {
      title: "Precios",
      description: "Gestión de precios de productos.",
    },
  },
  {
    path: "precios/crear",
    componentKey: "PrecioCreate",
    placeholderProps: {
      title: "Crear Precio",
      description: "Registra un nuevo precio.",
    },
  },
  {
    path: "precios/:id/editar",
    componentKey: "PrecioEdit",
    placeholderProps: {
      title: "Editar Precio",
      description: "Modifica los detalles del precio.",
    },
  },
  {
    path: "precios/:id/detalles",
    componentKey: "PrecioDetalle",
    placeholderProps: {
      title: "Detalles de Precio",
      description: "Información detallada del precio.",
    },
  },
  {
    path: "facturacion/facturas_venta/lista",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Lista de facturas",
      subtitle: "Listado general de todas las facturas de ventas",
    },
  },
  {
    path: "facturacion/facturas_venta/borradores",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Borradores",
      subtitle: "Facturas en estado borrador",
      defaultEstado: "BORRADOR",
    },
  },
  {
    path: "facturacion/facturas_venta/emitidas",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Facturas Emitidas",
      subtitle: "Listado de facturas ya emitidas",
      defaultEstado: "EMITIDA",
    },
  },
  {
    path: "facturacion/facturas_venta/pendientes_pago",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Pendientes por Pago",
      subtitle: "Facturas emitidas y parciales con saldo pendiente",
      defaultEstado: "PARCIAL",
    },
  },
  {
    path: "facturacion/facturas_venta/pagadas",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Facturas Pagadas",
      subtitle: "Facturas que han sido pagadas en su totalidad",
      defaultEstado: "PAGADA",
    },
  },
  {
    path: "facturacion/facturas_venta/vencidas",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Facturas Vencidas",
      subtitle: "Facturas cuyo plazo de pago ha expirado",
      defaultEstado: "VENCIDA",
    },
  },
  {
    path: "facturacion/facturas_venta/anuladas",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Facturas Anuladas",
      subtitle: "Historial de facturas anuladas",
      defaultEstado: "ANULADA",
    },
  },
  {
    path: "facturacion/facturas_venta/nueva_factura",
    componentKey: "FacturaVentaCreate",
    placeholderProps: {
      title: "Crear Factura",
      description: "Emitir una nueva factura de venta.",
    },
  },
  {
    path: "facturacion/facturas_venta/:id/editar",
    componentKey: "FacturaVentaEdit",
    placeholderProps: {
      title: "Editar Factura",
      description: "Modificar borrador de factura.",
    },
  },
  {
    path: "facturacion/facturas_venta/:id/detalle",
    componentKey: "FacturaVentaDetalle",
    placeholderProps: {
      title: "Detalle de Factura",
      description: "Ver los detalles de la factura emitida.",
    },
  },
  {
    path: "facturacion/pagos_recaudos/historial",
    componentKey: "PagosList",
    placeholderProps: {
      title: "Historial de Pagos",
      subtitle: "Registro histórico de todos los pagos recibidos",
    },
  },
  {
    path: "facturacion/pagos_recaudos/registrar_pagos",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Registrar Pago",
      subtitle: "Selecciona una factura pendiente para registrar su pago",
      defaultEstado: "PARCIAL",
    },
  },
  {
    path: "facturacion/cuentas_cobrar/facturas_pendientes",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Cuentas por Cobrar - Pendientes",
      subtitle: "Facturas emitidas y parciales con saldo pendiente",
      defaultEstado: "PARCIAL",
    },
  },
  {
    path: "facturacion/cuentas_cobrar/facturas_vencidas",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Cuentas por Cobrar - Vencidas",
      subtitle: "Facturas cuyo plazo de pago ha expirado",
      defaultEstado: "VENCIDA",
    },
  },
  {
    path: "facturacion/notas_credito/historial",
    componentKey: "NotasList",
    placeholderProps: {
      tipo: "CREDITO",
      title: "Historial de Notas de Crédito",
      subtitle: "Todas las notas de crédito registradas",
    },
  },
  {
    path: "facturacion/notas_credito/pendientes",
    componentKey: "NotasList",
    placeholderProps: {
      tipo: "CREDITO",
      title: "Notas de Crédito Pendientes",
      subtitle: "Notas en estado borrador",
      defaultEstado: "BORRADOR",
    },
  },
  {
    path: "facturacion/notas_credito/aplicadas",
    componentKey: "NotasList",
    placeholderProps: {
      tipo: "CREDITO",
      title: "Notas de Crédito Aplicadas",
      subtitle: "Notas aplicadas a facturas",
      defaultEstado: "EMITIDA",
    },
  },
  {
    path: "facturacion/notas_credito/anuladas",
    componentKey: "NotasList",
    placeholderProps: {
      tipo: "CREDITO",
      title: "Notas de Crédito Anuladas",
      subtitle: "Notas anuladas",
      defaultEstado: "ANULADA",
    },
  },
  {
    path: "facturacion/notas_debito/historial",
    componentKey: "NotasList",
    placeholderProps: {
      tipo: "DEBITO",
      title: "Historial de Notas de Débito",
      subtitle: "Todas las notas de débito registradas",
    },
  },
  {
    path: "facturacion/notas_debito/pendientes",
    componentKey: "NotasList",
    placeholderProps: {
      tipo: "DEBITO",
      title: "Notas de Débito Pendientes",
      subtitle: "Notas en estado borrador",
      defaultEstado: "BORRADOR",
    },
  },
  {
    path: "facturacion/notas_debito/aplicadas",
    componentKey: "NotasList",
    placeholderProps: {
      tipo: "DEBITO",
      title: "Notas de Débito Aplicadas",
      subtitle: "Notas aplicadas a facturas",
      defaultEstado: "EMITIDA",
    },
  },
  {
    path: "facturacion/notas_debito/anuladas",
    componentKey: "NotasList",
    placeholderProps: {
      tipo: "DEBITO",
      title: "Notas de Débito Anuladas",
      subtitle: "Notas anuladas",
      defaultEstado: "ANULADA",
    },
  },
  {
    path: "facturacion/facturas_compra/lista",
    componentKey: "FacturasCompraList",
    placeholderProps: {
      title: "Lista de facturas",
      subtitle: "Listado general de todas las facturas de compras",
    },
  },
  {
    path: "facturacion/facturas_compra/nueva_factura",
    componentKey: "CompraCreate",
    placeholderProps: {
      title: "Nueva Factura de Compra",
      description: "Registrar una nueva compra",
    },
  },
  {
    path: "facturacion/facturas_compra/borradores",
    componentKey: "ComprasList",
    placeholderProps: {
      title: "Compras en Borrador",
      subtitle: "Facturas de compra pendientes de confirmación",
      defaultEstado: "PENDIENTE",
    },
  },
  {
    path: "facturacion/facturas_compra/registradas",
    componentKey: "ComprasList",
    placeholderProps: {
      title: "Compras Registradas",
      subtitle: "Facturas de compra confirmadas",
      defaultEstado: "COMPLETADA",
    },
  },
  {
    path: "facturacion/facturas_compra/pendientes_pago",
    componentKey: "ComprasList",
    placeholderProps: {
      title: "Compras Pendientes de Pago",
      subtitle: "Facturas con saldo pendiente",
      defaultEstado: "PARCIAL",
    },
  },
  {
    path: "facturacion/facturas_compra/pagadas",
    componentKey: "ComprasList",
    placeholderProps: {
      title: "Compras Pagadas",
      subtitle: "Facturas totalmente pagadas",
      defaultEstado: "COMPLETADA",
    },
  },
  {
    path: "facturacion/facturas_compra/vencidas",
    componentKey: "ComprasList",
    placeholderProps: {
      title: "Compras Vencidas",
      subtitle: "Facturas con saldo y plazo vencido",
      defaultEstado: "PARCIAL",
    },
  },
  {
    path: "facturacion/facturas_compra/anuladas",
    componentKey: "ComprasList",
    placeholderProps: {
      title: "Compras Anuladas",
      subtitle: "Facturas anuladas",
      defaultEstado: "ANULADA",
    },
  },
  {
    path: "facturacion/facturas_compra/historial",
    componentKey: "ComprasList",
    placeholderProps: {
      title: "Historial de Compras",
      subtitle: "Listado completo de todas las compras",
    },
  },
  {
    path: "facturacion/devoluciones/devoluciones_venta",
    componentKey: "NotasList",
    placeholderProps: {
      tipo: "CREDITO",
      title: "Devoluciones de Venta",
      subtitle: "Notas de crédito generadas por devoluciones de clientes",
    },
  },
  {
    path: "facturacion/devoluciones/devoluciones_compra",
    componentKey: "NotasList",
    placeholderProps: {
      tipo: "DEBITO",
      title: "Devoluciones de Compra",
      subtitle: "Notas de débito generadas por devoluciones a proveedores",
    },
  },
  {
    path: "facturacion/devoluciones/pendientes_devoluciones",
    componentKey: "NotasList",
    placeholderProps: {
      tipo: "CREDITO",
      title: "Devoluciones Pendientes",
      subtitle: "Notas de crédito en estado borrador",
      defaultEstado: "BORRADOR",
    },
  },
  {
    path: "facturacion/devoluciones/historial",
    componentKey: "NotasList",
    placeholderProps: {
      tipo: "CREDITO",
      title: "Historial de Devoluciones",
      subtitle: "Listado histórico de notas aplicadas por devolución",
    },
  },
  {
    path: "facturacion/resoluciones/crear_resolucion",
    componentKey: "ResolucionesList",
    placeholderProps: {
      title: "Crear Resolución",
      subtitle: "Gestión de resoluciones de facturación",
    },
  },
  {
    path: "facturacion/resoluciones/vigentes",
    componentKey: "ResolucionesList",
    placeholderProps: { title: "Resoluciones Vigentes", filtroActiva: true },
  },
  {
    path: "facturacion/resoluciones/proximas_vencer",
    componentKey: "ResolucionesList",
    placeholderProps: {
      title: "Resoluciones Próximas a Vencer",
      filtroActiva: true,
    },
  },
  {
    path: "facturacion/resoluciones/vencidas",
    componentKey: "ResolucionesList",
    placeholderProps: { title: "Resoluciones Vencidas", filtroActiva: false },
  },
  {
    path: "facturacion/resoluciones/historial",
    componentKey: "ResolucionesList",
    placeholderProps: { title: "Historial de Resoluciones" },
  },
  {
    path: "facturacion/impuestos/IVA",
    componentKey: "ImpuestosList",
    placeholderProps: {
      title: "Impuesto al Valor Agregado (IVA)",
      filtroNombre: "IVA",
    },
  },
  {
    path: "facturacion/impuestos/INC",
    componentKey: "ImpuestosList",
    placeholderProps: {
      title: "Impuesto Nacional al Consumo (INC)",
      filtroNombre: "INC",
    },
  },
  {
    path: "facturacion/impuestos/retefuente",
    componentKey: "ImpuestosList",
    placeholderProps: {
      title: "Retención en la Fuente",
      filtroNombre: "Retefuente",
    },
  },
  {
    path: "facturacion/impuestos/reteICA",
    componentKey: "ImpuestosList",
    placeholderProps: {
      title: "Retención de Industria y Comercio",
      filtroNombre: "ReteICA",
    },
  },
  {
    path: "facturacion/impuestos/reteIVA",
    componentKey: "ImpuestosList",
    placeholderProps: { title: "Retención de IVA", filtroNombre: "ReteIVA" },
  },
  {
    path: "facturacion/impuestos/configuracion",
    componentKey: "ImpuestosList",
    placeholderProps: { title: "Configuración de Impuestos" },
  },
  {
    path: "facturacion/reportes/ventas_facturadas",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Reporte de Ventas Facturadas",
      subtitle: "Consolidado de ventas emitidas",
    },
  },
  {
    path: "facturacion/reportes/compras_facturadas",
    componentKey: "ComprasList",
    placeholderProps: {
      title: "Reporte de Compras Facturadas",
      subtitle: "Consolidado de compras realizadas",
    },
  },
  {
    path: "facturacion/reportes/facturas_pendientes",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Reporte de Facturas Pendientes",
      defaultEstado: "PARCIAL",
    },
  },
  {
    path: "facturacion/reportes/facturas_vencidas",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Reporte de Facturas Vencidas",
      defaultEstado: "VENCIDA",
    },
  },
  {
    path: "facturacion/reportes/notas_credito",
    componentKey: "NotasList",
    placeholderProps: { title: "Reporte de Notas de Crédito", tipo: "CREDITO" },
  },
  {
    path: "facturacion/reportes/notas_debitos",
    componentKey: "NotasList",
    placeholderProps: { title: "Reporte de Notas de Débito", tipo: "DEBITO" },
  },
  {
    path: "facturacion/reportes/impuestos",
    componentKey: "ImpuestosList",
    placeholderProps: { title: "Reporte de Impuestos y Retenciones" },
  },
  {
    path: "facturacion/reportes/cuentas_cobrar",
    componentKey: "FacturasVentaList",
    placeholderProps: {
      title: "Reporte de Cartera (Cuentas por Cobrar)",
      defaultEstado: "PARCIAL",
    },
  },
  {
    path: "facturacion/reportes/cuentas_pagar",
    componentKey: "ComprasList",
    placeholderProps: {
      title: "Reporte de Cuentas por Pagar",
      defaultEstado: "PARCIAL",
    },
  },
  {
    path: "facturacion/reportes/rentabilidad",
    componentKey: "ReportesFinancieros",
    placeholderProps: {
      title: "Reporte de Rentabilidad",
      description: "Estado de resultados y utilidades",
    },
  },
];

export const defaultAuthenticatedPath = ROUTES.DASHBOARD;
