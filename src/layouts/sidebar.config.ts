import {
  IconLayoutDashboard,
  IconShoppingCart,
  IconTruck,
  IconBox,
  IconUsers,
  IconReportAnalytics,
  IconSettings,
  IconBuildingWarehouse,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

export interface SidebarItem {
  label: string;
  path?: string;
  icon?: Icon;
  children?: SidebarSection[];
}

export interface SidebarSection {
  section: string;
  items: {
    label: string;
    path: string;
  }[];
}

export const sidebarConfig: SidebarItem[] = [
  {
    label: "Panel de Control",
    icon: IconLayoutDashboard,
    children: [
      {
        section: "General",
        items: [
          { label: "Resumen ejecutivo", path: "/dashboard" },
          { label: "KPIs", path: "/dashboar/kpis" },
          {
            label: "Analisis de rendimiento",
            path: "/dashboar/analisis_rendimiento",
          },
        ],
      },
    ],
  },
  {
    label: "Ventas",
    icon: IconShoppingCart,
    children: [
      {
        section: "Transacciones",
        items: [
          { label: "Nueva Venta", path: "/ventas/crear" },
          { label: "Cotizaciones", path: "/ventas/cotizaciones" },
          { label: "Pedidos", path: "/ventas/pedidos" },
        ],
      },
      {
        section: "Administración",
        items: [
          { label: "Lista de Ventas", path: "/ventas" },
          { label: "Devoluciones", path: "/ventas/devoluciones" },
        ],
      },
    ],
  },
  {
    label: "Compras",
    icon: IconTruck,
    children: [
      {
        section: "Transacciones",
        items: [
          { label: "Nueva Compra", path: "/compras/crear" },
          { label: "Nueva requisicion", path: "/compras/requisicion" },
          { label: "Lista de Compras", path: "/compras/lista" },
        ],
      },
      {
        section: "Administración",
        items: [
          { label: "Lista de precios", path: "/compras/lista_precios" },
          { label: "Proveedores", path: "/proveedores/lista" },
        ],
      },
    ],
  },
  {
    label: "Productos",
    icon: IconBox,
    children: [
      {
        section: "Transaciones",
        items: [
          { label: "Nuevo producto", path: "/productos/crear" },
          { label: "Lista de productos", path: "/productos" },
          { label: "Categorias", path: "/productos/categorias" },
          { label: "Marcas", path: "/productos/marcas" },
          { label: "Ajuste de inventario", path: "/productos/inventario" },
        ],
      },
      {
        section: "Administración",
        items: [
          { label: "Stock bajo", path: "/productos/stock_bajo" },
          { label: "Gestion de precios", path: "/productos/precios" },
        ],
      },
    ],
  },
  {
    label: "Clientes",
    icon: IconUsers,
    children: [
      {
        section: "Transacciones",
        items: [
          { label: "Nueva Cliente", path: "/cliente/crear" },
          { label: "Cotizaciones", path: "/cliente/cotizaciones" },
        ],
      },
      {
        section: "Administración",
        items: [{ label: "Lista de Clientes", path: "/cliente" }],
      },
    ],
  },
  {
    label: "Inventario",
    icon: IconBuildingWarehouse,
    children: [
      {
        section: "Transacciones",
        items: [
          { label: "Entrada de mercancia", path: "/inventario" },
          { label: "Salida de mercancia", path: "/inventario" },
          { label: "Transferencias", path: "/inventario" },
        ],
      },
      {
        section: "Administración",
        items: [
          { label: "Almacenes", path: "/inventario" },
          { label: "Ubicacion", path: "/inventario" },
        ],
      },
      {
        section: "Reportes",
        items: [
          { label: "Stock actual", path: "/inventario" },
          { label: "Valoracion de inventario", path: "/inventario" },
          { label: "Productos con Stock bajo", path: "/inventario" },
        ],
      },
    ],
  },
  {
    label: "Reportes",
    icon: IconReportAnalytics,
    children: [
      {
        section: "FINANCIEROS",
        items: [
          { label: "Balance general", path: "/reportes" },
          { label: "Estado de resultado", path: "/reportes" },
          { label: "Flujo de caja", path: "/reportes" },
        ],
      },
      {
        section: "OPERATIVOS",
        items: [
          { label: "Eficiencia operativa", path: "/reportes" },
          { label: "Productividad", path: "/reportes" },
        ],
      },
      {
        section: "ANALISIS",
        items: [
          { label: "Tendencia de mercadeo", path: "/reportes" },
          { label: "Proyecciones", path: "/reportes" },
        ],
      },
    ],
  },
  {
    label: "Configuraciones",
    icon: IconSettings,
    path: "/configuraciones",
  },
];
