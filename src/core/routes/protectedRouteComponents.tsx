/**
 * Registro de componentes para rutas protegidas.
 * Único archivo que mapea componentKey -> Component para cumplir react-refresh.
 * Ahora utiliza React.lazy para Code Splitting (Fases 3 y 4).
 */

import { lazy, type ComponentType } from 'react';
import type { ProtectedRouteKey } from '@/core/routes/routes.config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteComponentProps = Record<string, any>;

export const protectedRouteComponents: Record<
  ProtectedRouteKey,
  ComponentType<RouteComponentProps>
> = {
  Dashboard: lazy(() => import('@/modules/dashboard/pages/Dashboard')),
  DashboardKPIs: lazy(() => import('@/modules/dashboard/pages/DashboardKPIsPage')),
  DashboardAnalytics: lazy(() => import('@/modules/reportes/pages/AnalyticsDashboard')),
  DashboardFacturacion: lazy(() => import('@/modules/facturacion/pages/DashboardFacturacion')),

  VentasList: lazy(() => import('@/modules/ventas/pages/VentasList')),
  VentaCreate: lazy(() => import('@/modules/ventas/pages/VentaCreate')),
  VentaEdit: lazy(() => import('@/modules/ventas/pages/VentaEdit')),
  VentaDetalle: lazy(() => import('@/modules/ventas/pages/VentaDetalle')),

  Reportes: lazy(() => import('@/modules/reportes/pages/ReportsPage')),
  ReportesFinancieros: lazy(() => import('@/modules/reportes/pages/FinancialReportsPage')),
  ReportesOperativos: lazy(() => import('@/modules/reportes/pages/OperationalReportsPage')),

  AuditoriaLogs: lazy(() => import('@/modules/auditoria/pages/AuditPage')),
  DocumentosList: lazy(() => import('@/modules/documentos/pages/DocumentosList')),
  Configuracion: lazy(() => import('@/modules/configuracion/pages/ConfiguracionPage')),

  ProductosList: lazy(() => import('@/modules/productos/pages/ProductosList')),
  ProductoCreate: lazy(() => import('@/modules/productos/pages/ProductoCreate')),
  ProductoEdit: lazy(() => import('@/modules/productos/pages/ProductoEdit')),
  CategoriasList: lazy(() => import('@/modules/categorias/pages/CategoriasList')),
  CategoriasCreate: lazy(() => import('@/modules/categorias/pages/CategoriasCreate')),

  ClientesList: lazy(() => import('@/modules/clientes/pages/ClientesList')),
  ClienteCreate: lazy(() => import('@/modules/clientes/pages/ClienteCreate')),
  ClienteEdit: lazy(() => import('@/modules/clientes/pages/ClienteEdit')),

  ProveedorList: lazy(() => import('@/modules/proveedores/pages/ProveedorList')),
  ProveedorEdit: lazy(() => import('@/modules/proveedores/pages/ProveedorEdit')),
  ProveedorCreate: lazy(() => import('@/modules/proveedores/pages/ProveedorCreate')),
  ProveedorDetailPage: lazy(() => import('@/modules/proveedores/pages/ProveedorDetailPage')),

  ComprasList: lazy(() => import('@/modules/compras/pages/ComprasList')),
  CompraCreate: lazy(() => import('@/modules/compras/pages/CompraCreate')),
  CompraEdit: lazy(() => import('@/modules/compras/pages/CompraEdit')),
  CompraDetalles: lazy(() => import('@/modules/compras/pages/CompraDetalles')),

  CajaCreate: lazy(() => import('@/modules/caja/pages/CajaCreate')),
  CajaList: lazy(() => import('@/modules/caja/pages/CajaList')),
  CajaAbrir: lazy(() => import('@/modules/caja/pages/CajaAbrir')),
  CajaDetail: lazy(() => import('@/modules/caja/pages/CajaDetail')),
  CajaCierre: lazy(() => import('@/modules/caja/pages/CajaCierre')),
  CajaMovimientos: lazy(() => import('@/modules/caja/pages/CajaMovimientos')),
  CajaArqueo: lazy(() => import('@/modules/caja/pages/CajaArqueo')),
  CajaDashboard: lazy(() => import('@/modules/caja/pages/CajaDashboard')),

  PrecioListPage: lazy(() => import('@/modules/precios/pages/PreciosListPage')),
  PrecioCreate: lazy(() => import('@/modules/precios/pages/PrecioCreate')),
  PrecioEdit: lazy(() => import('@/modules/precios/pages/PrecioEdit')),
  PrecioDetalle: lazy(() => import('@/modules/precios/pages/PrecioDetalle')),

  FacturasVentaList: lazy(() => import('@/modules/facturacion/pages/FacturasVentaList')),
  FacturaVentaCreate: lazy(() => import('@/modules/facturacion/pages/FacturaVentaCreate')),
  FacturaVentaEdit: lazy(() => import('@/modules/facturacion/pages/FacturaVentaEdit')),
  FacturaVentaDetalle: lazy(() => import('@/modules/facturacion/pages/FacturaVentaDetalle')),
  PagosList: lazy(() => import('@/modules/facturacion/pages/PagosList')),
  NotasList: lazy(() => import('@/modules/facturacion/pages/NotasList')),
  ResolucionesList: lazy(() => import('@/modules/facturacion/pages/ResolucionesList')) as unknown as ComponentType<RouteComponentProps>,
  ImpuestosList: lazy(() => import('@/modules/facturacion/pages/ImpuestosList')) as unknown as ComponentType<RouteComponentProps>,
  FacturasCompraList: lazy(() => import('@/modules/facturacion/pages/FacturasCompraList')),

  CondicionesPagoPage: lazy(() => import('@/modules/configuracion/pages/CondicionesPagoPage')),

  NotasCreditoList: lazy(() => import('@/modules/facturacion/pages/NotasCreditoList')),
  NotaCreditoCreate: lazy(() => import('@/modules/facturacion/pages/NotaCreditoCreate')),
  NotaCreditoDetalle: lazy(() => import('@/modules/facturacion/pages/NotaCreditoDetalle')),
  NotasDebitoList: lazy(() => import('@/modules/facturacion/pages/NotasDebitoList')),
  NotaDebitoCreate: lazy(() => import('@/modules/facturacion/pages/NotaDebitoCreate')),
  NotaDebitoDetalle: lazy(() => import('@/modules/facturacion/pages/NotaDebitoDetalle')),
};
