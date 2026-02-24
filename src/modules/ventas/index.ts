/**
 * Exportaciones principales del módulo Ventas
 * Mismo patrón que compras/index.ts
 */

// Pages
export { default as VentasList } from "./ventas/pages/VentasList";
export { default as VentaCreate } from "./ventas/pages/VentaCreate";
export { default as VentaEdit } from "./ventas/pages/VentaEdit";
export { default as VentaDetalle } from "./ventas/pages/VentaDetalle";

// Hooks
export { useVentas } from "./ventas/hooks/useVenta";

// API
export { ventasAPI } from "./ventas/api/ventas.api";

// Types
export type {
  Venta,
  VentaList,
  VentaDetail,
  VentaDetalle as VentaDetalleType,
  VentaCreateInput,
  VentaUpdateInput,
  EstadoVenta,
  VentaFilters,
  VentaFormData,
} from "./ventas/types/venta.types";
