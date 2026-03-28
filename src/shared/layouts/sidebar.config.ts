import {
  IconLayoutDashboard,
  IconShoppingCart,
  IconTruck,
  IconBox,
  IconUsers,
  IconReportAnalytics,
  IconSettings,
  IconBuildingWarehouse,
  IconShoppingCartPlus,
  IconFileText,
  IconClipboardList,
  IconList,
  IconRotateClockwise,
  IconHistory,
  IconCashRegister,
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
    icon?: Icon;
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
          {
            label: "Nueva Venta",
            path: "/ventas/crear",
            icon: IconShoppingCartPlus,
          },
          {
            label: "Cotizaciones",
            path: "/ventas/cotizaciones",
            icon: IconFileText,
          },
          {
            label: "Pedidos",
            path: "/ventas/pedidos",
            icon: IconClipboardList,
          },
        ],
      },
      {
        section: "Administración",
        items: [
          { label: "Lista de Ventas", path: "/ventas/lista", icon: IconList },
          {
            label: "Devoluciones",
            path: "/ventas/devoluciones",
            icon: IconRotateClockwise,
          },
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
    label: "Caja",
    icon: IconCashRegister,
    children: [
      {
        section: "Operaciones",
        items: [
          { label: "Dashboard Caja", path: "/caja/dashboard" },
          { label: "Abrir Sesión", path: "/caja/sesiones/nueva" },
        ],
      },
      {
        section: "Administración",
        items: [
          { label: "Cajas Registradas", path: "/caja/lista" },
          { label: "Crear Caja Fija", path: "/caja/crear" },
        ],
      },
    ],
  },
  {
    label: "Productos",
    icon: IconBox,
    children: [
      {
        section: "Catálogo",
        items: [
          { label: "Lista de productos", path: "/productos/lista" },
          { label: "Nuevo producto", path: "/productos/crear" },
          { label: "Categorías", path: "/categorias/lista" },
        ],
      },
      {
        section: "Administración",
        items: [{ label: "Stock bajo", path: "/productos/stock_bajo" }],
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
          { label: "Nuevo Cliente", path: "/clientes/crear" },
          { label: "Cotizaciones", path: "/clientes/cotizaciones" },
        ],
      },
      {
        section: "Administración",
        items: [{ label: "Lista de Clientes", path: "/clientes/lista" }],
      },
    ],
  },
  {
    label: "Inventario",
    icon: IconBuildingWarehouse,
    children: [
      {
        section: "Movimientos",
        items: [{ label: "Entradas/Salidas", path: "/inventario/movimientos" }],
      },
      {
        section: "Reportes",
        items: [
          { label: "Stock actual", path: "/inventario/stock" },
          { label: "Productos con Stock bajo", path: "/productos/stock_bajo" },
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
          { label: "Balance general", path: "/reportes/balance_general" },
          { label: "Estado de resultado", path: "/reportes/estado_resultado" },
          { label: "Flujo de caja", path: "/reportes/flujos_caja" },
        ],
      },
      {
        section: "OPERATIVOS",
        items: [
          {
            label: "Eficiencia operativa",
            path: "/reportes/eficiencia_operativa",
          },
          { label: "Productividad", path: "/reportes/productividad" },
        ],
      },
      {
        section: "ANALISIS",
        items: [
          {
            label: "Tendencia de mercadeo",
            path: "/reportes/tendencia_mercadeo",
          },
          { label: "Proyecciones", path: "/reportes/proyecciones" },
        ],
      },
    ],
  },
  {
    label: "Auditoría",
    icon: IconHistory,
    children: [
      {
        section: "Control",
        items: [
          {
            label: "Log de Auditoría",
            path: "/auditoria/lista",
            icon: IconList,
          },
        ],
      },
    ],
  },
  {
    label: "Configuración",
    icon: IconSettings,
    path: "/configuracion",
  },
];
