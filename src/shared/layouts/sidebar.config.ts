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
  IconReceiptTax,
  IconFilePlus,
  IconFileDescription,
  IconSend,
  IconClock,
  IconCircleCheck,
  IconAlertCircle,
  IconFileX,
  IconFileCheck,
  IconArrowUpLeft,
  IconArrowDownRight,
  IconAlertTriangle,
  IconUserExclamation,
  IconFileAnalytics,
  IconBuildingStore,
  IconCash,
  IconCoins,
  IconDatabaseDollar,
  IconArrowBack,
  IconReceipt,
  IconFileArrowLeft,
  IconFileArrowRight,
  IconPrinter,
  IconFileCertificate,
  IconCirclePlus,
  IconShieldCheck,
  IconBellRinging,
  IconShieldX,
  IconCloudUpload,
  IconChecklist,
  IconX,
  IconBuildingMonument,
  IconCode,
  IconKey,
  IconPercentage,
  IconScissors,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconCashBanknote,
  IconPresentationAnalytics,
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
    label: "Facturacion",
    icon: IconReceiptTax,
    children: [
      {
        section: "GENERAL",
        items: [
          {
            label: "Dashboard",
            path: "/facturacion/dashboard",
            icon: IconLayoutDashboard,
          },
        ],
      },
      {
        section: "TRANSACIONALES",
        items: [
          {
            label: "Facturas de Venta",
            children: [
              {
                label: "Lista de Facturas",
                path: "/facturacion/facturas_venta/lista",
              },
              {
                label: "Nueva Factura",
                path: "/facturacion/facturas_venta/nueva_factura",
                icon: IconFilePlus,
              },
              {
                label: "Borradores",
                path: "/facturacion/facturas_venta/borradores",
                icon: IconFileDescription,
              },
              {
                label: "Emitidas",
                path: "/facturacion/facturas_venta/emitidas",
                icon: IconSend,
              },
              {
                label: "Pendientes por pago",
                path: "/facturacion/facturas_venta/pendientes_pago",
                icon: IconClock,
              },
              {
                label: "Pagadas",
                path: "/facturacion/facturas_venta/pagadas",
                icon: IconCircleCheck,
              },
              {
                label: "Vencidas",
                path: "/facturacion/facturas_venta/vencidas",
                icon: IconAlertCircle,
              },
              {
                label: "Anuladas",
                path: "/facturacion/facturas_venta/anuladas",
                icon: IconFileX,
              },
              {
                label: "Historial",
                path: "/facturacion/facturas_venta/historial",
                icon: IconHistory,
              },
            ],
          },
          {
            label: "Facturas de Compra",
            children: [
              {
                label: "Lista de Facturas",
                path: "/facturacion/facturas_compra/lista",
              },
              {
                label: "Nueva Factura",
                path: "/facturacion/facturas_compra/nueva_factura",
                icon: IconFilePlus,
              },
              {
                label: "Borradores",
                path: "/facturacion/facturas_compra/borradores",
                icon: IconFileDescription,
              },
              {
                label: "Registradas",
                path: "/facturacion/facturas_compra/registradas",
                icon: IconFileCheck,
              },
              {
                label: "Pendientes por pago",
                path: "/facturacion/facturas_compra/pendientes_pago",
                icon: IconClock,
              },
              {
                label: "Pagadas",
                path: "/facturacion/facturas_compra/pagadas",
                icon: IconCircleCheck,
              },
              {
                label: "Vencidas",
                path: "/facturacion/facturas_compra/vencidas",
                icon: IconAlertCircle,
              },
              {
                label: "Anuladas",
                path: "/facturacion/facturas_compra/anuladas",
                icon: IconFileX,
              },
              {
                label: "Historial",
                path: "/facturacion/facturas_compra/historial",
                icon: IconHistory,
              },
            ],
          },
          {
            label: "Notas Crédito",
            children: [
              {
                label: "Nueva Nota Crédito",
                path: "/facturacion/notas_credito/nueva_nota",
                icon: IconFilePlus,
              },
              {
                label: "Pendientes",
                path: "/facturacion/notas_credito/pendientes",
                icon: IconClock,
              },
              {
                label: "Aplicadas",
                path: "/facturacion/notas_credito/aplicadas",
                icon: IconCircleCheck,
              },
              {
                label: "Anuladas",
                path: "/facturacion/notas_credito/anuladas",
                icon: IconFileX,
              },
              {
                label: "Historial",
                path: "/facturacion/notas_credito/historial",
                icon: IconHistory,
              },
            ],
          },
          {
            label: "Notas Débito",
            children: [
              {
                label: "Nueva Nota Débito",
                path: "/facturacion/notas_debito/nueva_nota",
                icon: IconFilePlus,
              },
              {
                label: "Pendientes",
                path: "/facturacion/notas_debito/pendientes",
                icon: IconClock,
              },
              {
                label: "Aplicadas",
                path: "/facturacion/notas_debito/aplicadas",
                icon: IconCircleCheck,
              },
              {
                label: "Anuladas",
                path: "/facturacion/notas_debito/anuladas",
                icon: IconFileX,
              },
              {
                label: "Historial",
                path: "/facturacion/notas_debito/historial",
                icon: IconHistory,
              },
            ],
          },
          {
            label: "Devoluciones",
            children: [
              {
                label: "Devoluciones de Venta",
                path: "/facturacion/devoluciones/devoluciones_venta",
                icon: IconArrowUpLeft,
              },
              {
                label: "Devoluciones de Compra",
                path: "/facturacion/devoluciones/devoluciones_compra",
                icon: IconArrowDownRight,
              },
              {
                label: "Pendientes",
                path: "/facturacion/devoluciones/pendientes_devoluciones",
                icon: IconClock,
              },
              {
                label: "Historial",
                path: "/facturacion/devoluciones/historial",
                icon: IconHistory,
              },
            ],
          },
          {
            label: "Cuentas por Cobrar",
            children: [
              {
                label: "Facturas Pendientes",
                path: "/facturacion/cuentas_cobrar/facturas_pendientes",
                icon: IconClock,
              },
              {
                label: "Facturas Vencidas",
                path: "/facturacion/cuentas_cobrar/facturas_vencidas",
                icon: IconAlertTriangle,
              },
              {
                label: "Clientes Morosos",
                path: "/facturacion/cuentas_cobrar/clientes_morosos",
                icon: IconUserExclamation,
              },
              {
                label: "Abonos",
                path: "/facturacion/cuentas_cobrar/abonos",
                icon: IconTrendingUp,
              },
              {
                label: "Estado de Cuenta",
                path: "/facturacion/cuentas_cobrar/estado_cuenta",
                icon: IconFileAnalytics,
              },
            ],
          },
          {
            label: "Cuentas por Pagar",
            children: [
              {
                label: "Facturas Pendientes",
                path: "/facturacion/cuentas_pagar/facturas_pendientes",
                icon: IconClock,
              },
              {
                label: "Facturas Vencidas",
                path: "/facturacion/cuentas_pagar/facturas_vencidas",
                icon: IconAlertTriangle,
              },
              {
                label: "Proveedores",
                path: "/facturacion/cuentas_pagar/proveedores",
                icon: IconBuildingStore,
              },
              {
                label: "Pagos",
                path: "/facturacion/cuentas_pagar/pagos",
                icon: IconTrendingDown,
              },
              {
                label: "Estado de Cuenta",
                path: "/facturacion/cuentas_pagar/estado_cuenta",
                icon: IconFileAnalytics,
              },
            ],
          },
          {
            label: "Pagos y Recaudos",
            children: [
              {
                label: "Registrar Pago",
                path: "/facturacion/pagos_recaudos/registrar_pagos",
                icon: IconCash,
              },
              {
                label: "Pagos Parciales",
                path: "/facturacion/pagos_recaudos/pagos_parciales",
                icon: IconCoins,
              },
              {
                label: "Anticipos",
                path: "/facturacion/pagos_recaudos/anticipos",
                icon: IconDatabaseDollar,
              },
              {
                label: "Reembolsos",
                path: "/facturacion/pagos_recaudos/reembolsos",
                icon: IconArrowBack,
              },
              {
                label: "Historial",
                path: "/facturacion/pagos_recaudos/historial",
                icon: IconHistory,
              },
            ],
          },
          {
            label: "Numeración",
            children: [
              {
                label: "Facturas Venta",
                path: "facturacion/numeracion/factura_venta",
                icon: IconFileInvoice,
              },
              {
                label: "Facturas Compra",
                path: "facturacion/numeracion/factura_compra",
                icon: IconReceipt,
              },
              {
                label: "Notas Crédito",
                path: "facturacion/numeracion/notas_credito",
                icon: IconFileArrowLeft,
              },
              {
                label: "Notas Débito",
                path: "facturacion/numeracion/notas_debito",
                icon: IconFileArrowRight,
              },
              {
                label: "Recibos POS",
                path: "facturacion/numeracion/recibos_POS",
                icon: IconPrinter,
              },
              {
                label: "Comprobantes",
                path: "facturacion/numeracion/comprobantes",
                icon: IconFileCertificate,
              },
            ],
          },
          {
            label: "Resoluciones",
            children: [
              {
                label: "Crear Resolución",
                path: "/facturacion/resoluciones/crear_resolucion",
                icon: IconCirclePlus,
              },
              {
                label: "Vigentes",
                path: "/facturacion/resoluciones/vigentes",
                icon: IconShieldCheck,
              },
              {
                label: "Próximas a Vencer",
                path: "/facturacion/resoluciones/proximas_vencer",
                icon: IconBellRinging,
              },
              {
                label: "Vencidas",
                path: "/facturacion/resoluciones/vencidas",
                icon: IconShieldX,
              },
              {
                label: "Historial",
                path: "/facturacion/resoluciones/historial",
                icon: IconHistory,
              },
            ],
          },
          {
            label: "Facturación Electrónica",
            children: [
              {
                label: "Emitir Electrónica",
                path: "/facturacion/facturacion_electronica/emitir_electronica",
                icon: IconCloudUpload,
              },
              {
                label: "Enviadas",
                path: "/facturacion/facturacion_electronica/enviadas",
                icon: IconSend,
              },
              {
                label: "Aceptadas",
                path: "/facturacion/facturacion_electronica/aceptadas",
                icon: IconChecklist,
              },
              {
                label: "Rechazadas",
                path: "/facturacion/facturacion_electronica/rechazadas",
                icon: IconX,
              },
              {
                label: "Eventos DIAN",
                path: "/facturacion/facturacion_electronica/evento_DIAN",
                icon: IconBuildingMonument,
              },
              {
                label: "XML",
                path: "/facturacion/facturacion_electronica/XML",
                icon: IconCode,
              },
              {
                label: "CUFE",
                path: "/facturacion/facturacion_electronica/CUFE",
                icon: IconKey,
              },
            ],
          },
        ],
      },
      {
        section: "Administración",
        items: [
          {
            label: "Impuestos",
            children: [
              {
                label: "IVA",
                path: "/facturacion/impuestos/IVA",
                icon: IconPercentage,
              },
              {
                label: "INC",
                path: "/facturacion/impuestos/INC",
                icon: IconPercentage,
              },
              {
                label: "Retefuente",
                path: "/facturacion/impuestos/retefuente",
                icon: IconScissors,
              },
              {
                label: "ReteICA",
                path: "/facturacion/impuestos/reteICA",
                icon: IconScissors,
              },
              {
                label: "ReteIVA",
                path: "/facturacion/impuestos/reteIVA",
                icon: IconScissors,
              },
              {
                label: "Configuración",
                path: "/facturacion/impuestos/configuracion",
                icon: IconSettings,
              },
            ],
          },
          {
            label: "Reportes",
            children: [
              {
                label: "Ventas Facturadas",
                path: "facturacion/reportes/ventas_facturadas",
                icon: IconArrowUpRight,
              },
              {
                label: "Compras Facturadas",
                path: "/facturacion/reportes/compras_facturadas",
                icon: IconArrowDownLeft,
              },
              {
                label: "Facturas Pendientes",
                path: "/facturacion/reportes/facturas_pendientes",
                icon: IconClock,
              },
              {
                label: "Facturas Vencidas",
                path: "/facturacion/reportes/facturas_vencidas",
                icon: IconAlertCircle,
              },
              {
                label: "Notas Crédito",
                path: "/facturacion/reportes/notas_credito",
                icon: IconFileArrowLeft,
              },
              {
                label: "Notas Débito",
                path: "/facturacion/reportes/notas_debitos",
                icon: IconFileArrowRight,
              },
              {
                label: "Impuestos",
                path: "/facturacion/reportes/impuestos",
                icon: IconBuildingBank,
              },
              {
                label: "Cuentas por Cobrar",
                path: "/facturacion/reportes/cuentas_cobrar",
                icon: IconCashBanknote,
              },
              {
                label: "Cuentas por Pagar",
                path: "/facturacion/reportes/cuentas_pagar",
                icon: IconSend,
              },
              {
                label: "Rentabilidad",
                path: "/facturacion/reportes/rentabilidad",
                icon: IconPresentationAnalytics,
              },
            ],
          },
          {
            label: "Configuración",
            children: [
              {
                label: "Series",
                path: "/facturacion/configuracion/series",
              },
              {
                label: "Prefijos",
                path: "/facturacion/configuracio/prefijos",
              },
              {
                label: "Condiciones de Pago",
                path: "/facturacion/configuracion/condiciones_pago",
              },
              {
                label: "Métodos de Pago",
                path: "/facturacion/configuracion/metodos_pago",
              },
              {
                label: "Monedas",
                path: "/facturacion/configuracion/monedas",
              },
              {
                label: "Impuestos",
                path: "/facturacion/configuracion/impuestos",
              },
              {
                label: "Plantillas PDF",
                path: "/facturacion/configuracion/plantillas_PDF",
              },
              {
                label: "Plantillas Email",
                path: "/facturacion/configuracion/plantillas_Email",
              },
              {
                label: "Parámetros Generales",
                path: "/facturacion/configuracion/parametros_generales",
              },
            ],
          },
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

  //REPORTES BIEN ESTRUCTURADO
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
