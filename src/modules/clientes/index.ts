/**
 * Exportaciones principales del módulo Clientes
 * MISMO patrón que ventas/index.ts
 */

// Pages
export { default as ClientesList } from "./pages/ClientesList";
export { default as ClienteCreate } from "./pages/ClienteCreate";
export { default as ClienteEdit } from "./pages/ClienteEdit";
export { default as ClienteDetalle } from "./pages/ClienteDetalle";

// Hooks
export { useClientes } from "./hooks/useClientes";

// API
export { clientesAPI } from "./api/clientes.api";

// Types
export type {
  Cliente,
  ClienteList,
  ClienteDetail,
  ClienteCreateInput,
  ClienteUpdateInput,
  ClienteFilters,
  ClienteFormData,
} from "./types/cliente.types";
