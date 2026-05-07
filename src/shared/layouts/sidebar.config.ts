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
  IconTrendingUp,
  IconTrendingDown,
  IconChartLine,
  IconBuildingBank,
  IconFileInvoice,
  IconScale,
  IconCashBanknotePlus,
  IconTrendingDown3,
  IconChartBar,
  IconRefresh,
  IconUserDollar,
  IconUserSearch,
  IconCalculator,
  IconTrendingUp2,
} from "@tabler/icons-react";

import type { Icon } from "@tabler/icons-react";

export interface SidebarSubItem {
  label: string;
  path: string;
  icon?: Icon;
}

export interface SidebarItemChild {
  label: string;
  path?: string;
  icon?: Icon;
  children?: SidebarSubItem[];
}

export interface SidebarSection {
  section: string;
  items: SidebarItemChild[];
}

export interface SidebarItem {
  label: string;
  path?: string;
  icon?: Icon;
  children?: SidebarSection[];
}

export const sidebarConfig: SidebarItem[] = [
  {
    label: "Panel de Control",
    icon: IconLayoutDashboard,
    children: [
      {
        section: "GENERAL",
        items: [
          { label: "Resumen ejecutivo", path: "/dashboard" },
          { label: "KPIs", path: "/dashboard/kpis" },
          {
            label: "Análisis de rendimiento",
            path: "/dashboard/analisis_rendimiento",
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
        section: "TRANSACCIONES",
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
        section: "ADMINISTRACIÓN",
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
        section: "TRANSACCIONES",
        items: [
          { label: "Nueva Compra", path: "/compras/crear" },
          { label: "Nueva requisición", path: "/compras/requisicion" },
          { label: "Lista de Compras", path: "/compras/lista" },
        ],
      },
      {
        section: "ADMINISTRACIÓN",
        items: [
          { label: "Lista de precios", path: "/precios/lista" },
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
        section: "OPERACIONES",
        items: [
          { label: "Dashboard Caja", path: "/caja/dashboard" },
          { label: "Abrir Sesión", path: "/caja/sesiones/nueva" },
        ],
      },
      {
        section: "ADMINISTRACIÓN",
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
        section: "CATÁLOGO",
        items: [
          { label: "Lista de productos", path: "/productos/lista" },
          { label: "Nuevo producto", path: "/productos/crear" },
          { label: "Categorías", path: "/categorias/lista" },
        ],
      },
      {
        section: "ADMINISTRACIÓN",
        items: [{ label: "Stock bajo", path: "/productos/stock_bajo" }],
      },
    ],
  },

  {
    label: "Clientes",
    icon: IconUsers,
    children: [
      {
        section: "GESTIÓN",
        items: [
          { label: "Nuevo Cliente", path: "/clientes/crear" },
          { label: "Cotizaciones", path: "/clientes/cotizaciones" },
          { label: "Lista de Clientes", path: "/clientes/lista" },
        ],
      },
    ],
  },

  {
    label: "Inventario",
    icon: IconBuildingWarehouse,
    children: [
      {
        section: "MOVIMIENTOS",
        items: [{ label: "Entradas/Salidas", path: "/inventario/movimientos" }],
      },
      {
        section: "REPORTES",
        items: [
          { label: "Stock actual", path: "/inventario/stock" },
          { label: "Stock bajo", path: "/productos/stock_bajo" },
        ],
      },
    ],
  },

  {
    label: "Documentos",
    icon: IconFileText,
    children: [
      {
        section: "CONSULTAS",
        items: [
          {
            label: "Todos los documentos",
            path: "/documentos",
            icon: IconList,
          },
        ],
      },
    ],
  },

  // 🔥 REPORTES BIEN ESTRUCTURADO
  {
    label: "Reportes",
    icon: IconReportAnalytics,
    children: [
      {
        section: "FINANCIEROS",
        items: [
          {
            label: "Balance general",
            children: [
              {
                label: "Activos",
                path: "/reportes/balance_general/activos",
                icon: IconBuildingBank,
              },
              {
                label: "Pasivos",
                path: "/reportes/balance_general/pasivos",
                icon: IconFileInvoice,
              },
              {
                label: "Patrimonio",
                path: "/reportes/balance_general/patrimonio",
                icon: IconScale,
              },
            ],
          },
          {
            label: "Estado de resultados",
            children: [
              {
                label: "Ingresos",
                path: "/reportes/estado_resultados/ingresos",
                icon: IconTrendingUp,
              },
              {
                label: "Costos",
                path: "/reportes/estado_resultados/costos",
                icon: IconTrendingDown,
              },
              {
                label: "Utilidad",
                path: "/reportes/estado_resultados/utilidad",
                icon: IconChartLine,
              },
            ],
          },
          {
            label: "Flujo de caja",
            children: [
              {
                label: "Entradas",
                path: "/reportes/flujo_caja/entradas",
                icon: IconCashBanknotePlus,
              },
              {
                label: "Salidas",
                path: "/reportes/flujo_caja/salidas",
                icon: IconTrendingDown3,
              },
              {
                label: "Balance",
                path: "/reportes/flujo_caja/balance",
                icon: IconChartBar,
              },
            ],
          },
        ],
      },

      {
        section: "OPERATIVOS",
        items: [
          {
            label: "Eficiencia operativa",
            children: [
              {
                label: "Costos vs Ventas",
                path: "/reportes/eficiencia_operativa/costos_ventas",
                icon: IconChartBar,
              },
              {
                label: "Rotación de inventario",
                path: "/reportes/eficiencia_operativa/rotacion_inventario",
                icon: IconRefresh,
              },
            ],
          },
          {
            label: "Productividad",
            children: [
              {
                label: "Ventas por empleado",
                path: "/reportes/productividad/ventas_empleado",
                icon: IconUserDollar,
              },
              {
                label: "Rendimiento",
                path: "/reportes/productividad/rendimiento",
                icon: IconChartLine,
              },
            ],
          },
        ],
      },

      {
        section: "ANALÍTICOS",
        items: [
          {
            label: "Tendencia de mercadeo",
            children: [
              {
                label: "Crecimiento",
                path: "/reportes/tendencia_mercadeo/crecimiento",
                icon: IconTrendingUp,
              },
              {
                label: "Comportamiento del cliente",
                path: "/reportes/tendencia_mercadeo/comportamiento_cliente",
                icon: IconUserSearch,
              },
            ],
          },
          {
            label: "Proyecciones",
            children: [
              {
                label: "Ventas futuras",
                path: "/reportes/proyecciones/ventas_futuras",
                icon: IconTrendingUp2,
              },
              {
                label: "Estimaciones",
                path: "/reportes/proyecciones/estimaciones",
                icon: IconCalculator,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    label: "Auditoría",
    icon: IconHistory,
    children: [
      {
        section: "CONTROL",
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
