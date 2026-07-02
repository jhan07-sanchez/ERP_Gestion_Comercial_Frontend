/**
 * Registro de componentes para rutas protegidas.
 * Único archivo que mapea componentKey -> Component para cumplir react-refresh.
 */

import type { ComponentType } from 'react';
import AnalyticsDashboard from '@/modules/reportes/pages/AnalyticsDashboard';
import ReportsPage from '@/modules/reportes/pages/ReportsPage';
import FinancialReportsPage from '@/modules/reportes/pages/FinancialReportsPage';
import OperationalReportsPage from '@/modules/reportes/pages/OperationalReportsPage';
import ClientesList from '@/modules/clientes/pages/ClientesList';
import ClienteCreate from '@/modules/clientes/pages/ClienteCreate';
import ClienteEdit from '@/modules/clientes/pages/ClienteEdit';

import ProductosList from '@/modules/productos/pages/ProductosList';
import ProductoCreate from '@/modules/productos/pages/ProductoCreate';
import ProductoEdit from '@/modules/productos/pages/ProductoEdit';
import CategoriasList from '@/modules/categorias/pages/CategoriasList'; // ← NUEVO
import CategoriasCreate from '@/modules/categorias/pages/CategoriasCreate'; // ← NUEVO

import ComprasList from '@/modules/compras/pages/ComprasList';
import CompraCreate from '@/modules/compras/pages/CompraCreate';
import CompraEdit from "@/modules/compras/pages/CompraEdit";
import CompraDetalles from "@/modules/compras/pages/CompraDetalles";

import ProveedorList from '@/modules/proveedores/pages/ProveedorList';
import ProveedorCreate from '@/modules/proveedores/pages/ProveedorCreate';
import ProveedorEdit from "@/modules/proveedores/pages/ProveedorEdit";
import ProveedorDetailPage from "@/modules/proveedores/pages/ProveedorDetailPage";

import { Dashboard, DashboardKPIsPage } from '@/modules/dashboard'; //  Importar del módulo dashboard

import type { ProtectedRouteKey } from '@/core/routes/routes.config';

import VentasList from '@/modules/ventas/pages/VentasList';    // ← NUEVO
import VentaCreate from '@/modules/ventas/pages/VentaCreate';   // ← NUEVO
import VentaEdit from '@/modules/ventas/pages/VentaEdit';     // ← NUEVO
import VentaDetalle from '@/modules/ventas/pages/VentaDetalle';  // ← NUEVO

import { CajaCreate } from '@/modules/caja/pages';
import { CajaList } from '@/modules/caja/pages';
import { CajaAbrir } from '@/modules/caja/pages';
import { CajaDetail } from '@/modules/caja/pages';
import { CajaCierre } from '@/modules/caja/pages';
import { CajaMovimientos } from '@/modules/caja/pages';
import { CajaArqueo } from '@/modules/caja/pages';
import { CajaDashboard } from '@/modules/caja/pages';

import {
  DashboardFacturacion,
  FacturasVentaList,
  FacturaVentaCreate,
  FacturaVentaEdit,
  FacturaVentaDetalle,
  FacturasCompraList,
  PagosList,
  NotasList,
  ResolucionesList,
  ImpuestosList
} from '@/modules/facturacion/pages';

import { AuditPage as AuditoriaLogs } from '@/modules/auditoria';
import { ConfiguracionPage } from '@/modules/configuracion';
import DocumentosList from '@/modules/documentos/pages/DocumentosList';

import PrecioListPage from '@/modules/precios/pages/PreciosListPage';
import PrecioCreate from '@/modules/precios/pages/PrecioCreate';
import PrecioEdit from '@/modules/precios/pages/PrecioEdit';
import PrecioDetalle from '@/modules/precios/pages/PrecioDetalle';
import { CondicionesPagoPage } from '@/modules/configuracion';


type RouteComponentProps = Record<string, string | undefined>;

export const protectedRouteComponents: Record<
  ProtectedRouteKey,
  ComponentType<RouteComponentProps>
> = {
  Dashboard,
  DashboardKPIs: DashboardKPIsPage,
  DashboardAnalytics: AnalyticsDashboard,
  DashboardFacturacion,

  VentasList,
  VentaCreate, // ← NUEVO
  VentaEdit, // ← NUEVO
  VentaDetalle, // ← NUEVO

  Reportes: ReportsPage,
  ReportesFinancieros: FinancialReportsPage,
  ReportesOperativos: OperationalReportsPage,

  AuditoriaLogs,
  DocumentosList,
  Configuracion: ConfiguracionPage,

  ProductosList,
  ProductoCreate,
  ProductoEdit,
  CategoriasList, // ← NUEVO
  CategoriasCreate, // ← NUEVO

  ClientesList,
  ClienteCreate,
  ClienteEdit,

  ProveedorList,
  ProveedorEdit,
  ProveedorCreate,
  ProveedorDetailPage,

  ComprasList,
  CompraCreate,
  CompraEdit,
  CompraDetalles,

  CajaCreate,
  CajaList,
  CajaAbrir,
  CajaDetail,
  CajaCierre,
  CajaMovimientos,
  CajaArqueo,
  CajaDashboard,

  PrecioListPage,
  PrecioCreate,
  PrecioEdit,
  PrecioDetalle,

  FacturasVentaList,
  FacturaVentaCreate,
  FacturaVentaEdit,
  FacturaVentaDetalle,
  PagosList,
  NotasList,
  ResolucionesList: ResolucionesList as unknown as ComponentType<RouteComponentProps>,
  ImpuestosList: ImpuestosList as unknown as ComponentType<RouteComponentProps>,
  FacturasCompraList,

  CondicionesPagoPage,
};
