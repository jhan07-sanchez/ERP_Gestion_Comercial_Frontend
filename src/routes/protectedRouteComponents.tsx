/**
 * Registro de componentes para rutas protegidas.
 * Único archivo que mapea componentKey -> Component para cumplir react-refresh.
 */

import type { ComponentType } from 'react';
import PlaceholderPage from '@/routes/PlaceholderPage';
import ClientesList from '@/modules/clientes/pages/ClientesList';
import ClienteCreate from '@/modules/clientes/pages/ClienteCreate';
import ClienteEdit from '@/modules/clientes/pages/ClienteEdit';
import ProductosList from '@/modules/inventario/pages/ProductosList';
import ProductoCreate from '@/modules/inventario/pages/ProductoCreate';
import ProductoEdit from '@/modules/inventario/pages/ProductoEdit';
import ComprasList from '@/modules/compras/pages/ComprasList';
import CompraCreate from '@/modules/compras/pages/CompraCreate';
import CompraEdit from "@/modules/compras/pages/CompraEdit";
import ProveedorList from '@/modules/proveedores/pages/ProveedorList';
import ProveedorCreate from '@/modules/proveedores/pages/ProveedorCreate';
import { Dashboard } from '@/modules/dashboard'; //  Importar del módulo dashboard
import type { ProtectedRouteKey } from '@/routes/routes.config';
import ProveedorEdit from '../modules/proveedores/pages/ProveedorEdit';

type RouteComponentProps = Record<string, string | undefined>;

export const protectedRouteComponents: Record<
  ProtectedRouteKey,
  ComponentType<RouteComponentProps>
> = {
  Dashboard,
  Ventas: PlaceholderPage,
  Reportes: PlaceholderPage,
  Configuracion: PlaceholderPage,
  ProductosList,
  ProductoCreate,
  ProductoEdit,
  ClientesList,
  ClienteCreate,
  ClienteEdit,
  ProveedorList,
  ProveedorEdit,
  ProveedorCreate,
  ComprasList,
  CompraCreate,
  CompraEdit,

};
