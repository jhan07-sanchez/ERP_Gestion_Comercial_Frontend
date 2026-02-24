/**
 * Exportaciones principales del módulo Clientes
 * MISMO patrón que ventas/index.ts
 */

// Pages
export { default as ClientesList } from "./clientes/pages/ClientesList";
export { default as ClienteCreate } from "./clientes/pages/ClienteCreate";
export { default as ClienteEdit } from "./clientes/pages/ClienteEdit";
export { default as ClienteDetalle } from "./clientes/pages/ClienteDetalle";

// Hooks
export { useClientes } from "./clientes/hooks/useClientes";

// API
export { clientesAPI } from "./clientes/api/clientes.api";

// Types
export type {
  Cliente,
  ClienteList,
  ClienteDetail,
  ClienteCreateInput,
  ClienteUpdateInput,
  ClienteFilters,
  ClienteFormData,
} from "./clientes/types/cliente.types";
