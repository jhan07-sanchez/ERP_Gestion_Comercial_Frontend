/**
 * Exportaciones principales del módulo Compras
 */

// Pages
export { default as ComprasList } from "./pages/ComprasList";
export { default as CompraCreate } from "./pages/CompraCreate";
export { default as CompraEdit } from "./pages/CompraEdit";

// Hooks
export { useCompras } from "./hooks/useCompras";

// API
export { comprasAPI } from "./api/compras.api";

// Types
export type {
  Compra,
  CompraCreateInput,
  CompraUpdateInput,
  CompraDetalle,
} from "./types/compra.types";
