export interface SidebarItem {
  label: string;
  path?: string;
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
    children: [
      {
        section: "General",
        items: [
          { label: "Resumen ejecutivo", path: "/dashboard" },
          { label: "KPIs", path: "/dashboar/kpis" },
          { label: "Analisis de rendimiento", path: "/dashboar/analisis_rendimiento" },
        ],
      },
    ],
  },
  {
    label: "Ventas",
    children: [
      {
        section: "Transacciones",
        items: [
          { label: "Nueva Venta", path: "/ventas" },
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
    children: [
      {
        section: "Transacciones",
        items: [
          { label: "Nueva Compra", path: "/compras/crear" },
          { label: "Nueva requisicion", path: "/compras/requisicion" },
          { label: "Lista de Compras", path: "/compras" },
        ],
      },
      {
        section: "Administración",
        items: [{ label: "Lista de precios", path: "/compras/lista_precios" }],
      },
    ],
  },
  {
    label: "Productos",
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
    label: "Reportes",
    path: "/reportes",
  },
  {
    label: "Configuraciones",
    path: "/configuraciones",
  },
];
