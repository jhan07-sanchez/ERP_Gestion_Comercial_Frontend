/**
 * Exportaciones principales del módulo Ventas
 * Mismo patrón que compras/index.ts
 */

// Pages
export { default as VentasList } from "./pages/VentasList";
export { default as VentaCreate } from "./pages/VentaCreate";
export { default as VentaEdit } from "./pages/VentaEdit";
export { default as VentaDetalle } from "./pages/VentaDetalle";

// Hooks
export { useVentas } from "./hooks/useVenta";

// API
export { ventasAPI } from "./api/ventas.api";

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
} from "./types/venta.types";
