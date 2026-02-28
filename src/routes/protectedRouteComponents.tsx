/**
 * Registro de componentes para rutas protegidas.
 * Único archivo que mapea componentKey -> Component para cumplir react-refresh.
 */

import type { ComponentType } from 'react';
import PlaceholderPage from '@/routes/PlaceholderPage';
import ClientesList from '@/modules/clientes/clientes/pages/ClientesList';
import ClienteCreate from '@/modules/clientes/clientes/pages/ClienteCreate';
import ClienteEdit from '@/modules/clientes/clientes/pages/ClienteEdit';

import ProductosList from '@/modules/productos/pages/ProductosList';
import ProductoCreate from '@/modules/productos/pages/ProductoCreate';
import ProductoEdit from '@/modules/productos/pages/ProductoEdit';
import CategoriasList from '@/modules/categorias/pages/CategoriasList'; // ← NUEVO

import ComprasList from '@/modules/compras/pages/ComprasList';
import CompraCreate from '@/modules/compras/pages/CompraCreate';
import CompraEdit from "@/modules/compras/pages/CompraEdit";
import CompraDetalles from "@/modules/compras/pages/CompraDetalles";

import ProveedorList from '@/modules/proveedores/pages/ProveedorList';
import ProveedorCreate from '@/modules/proveedores/pages/ProveedorCreate';
import ProveedorEdit from "../modules/proveedores/pages/ProveedorEdit";

import { Dashboard } from '@/modules/dashboard'; //  Importar del módulo dashboard

import type { ProtectedRouteKey } from '@/routes/routes.config';

import VentasList from '@/modules/ventas/ventas/pages/VentasList';    // ← NUEVO
import VentaCreate from '@/modules/ventas/ventas/pages/VentaCreate';   // ← NUEVO
import VentaEdit from '@/modules/ventas/ventas/pages/VentaEdit';     // ← NUEVO
import VentaDetalle from '@/modules/ventas/ventas/pages/VentaDetalle';  // ← NUEVO

 // ← NUEVO

type RouteComponentProps = Record<string, string | undefined>;

export const protectedRouteComponents: Record<
  ProtectedRouteKey,
  ComponentType<RouteComponentProps>
> = {
  Dashboard,

  VentasList,
  VentaCreate, // ← NUEVO
  VentaEdit, // ← NUEVO
  VentaDetalle, // ← NUEVO

  Reportes: PlaceholderPage,

  Configuracion: PlaceholderPage,

  ProductosList,
  ProductoCreate,
  ProductoEdit,
  CategoriasList, // ← NUEVO

  ClientesList,
  ClienteCreate,
  ClienteEdit,

  ProveedorList,
  ProveedorEdit,
  ProveedorCreate,

  ComprasList,
  CompraCreate,
  CompraEdit,
  CompraDetalles,
};
