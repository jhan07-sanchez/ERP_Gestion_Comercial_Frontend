// proveedores/index.ts

// Types
export * from "./types/proveedor.types";

// API
export * from "./api";

// Hooks
export { useProveedor } from "./hooks/useProveedor";
export { useProveedorActions } from "./hooks/useProveedorActions";

// Components
export { ProveedorForm } from "./components/ProveedorForm";
export { ProveedorItem } from "./components/ProveedorItem";
export { ProveedorResumen } from "./components/ProveedorResumen";
export {
  ProveedorDetalleRow,
  ProveedorDetalleList,
} from "./components/ProveedorDetalleRow";

// Pages
export { default as ProveedorList } from "./pages/ProveedorList";
export { default as ProveedorCreate } from "./pages/ProveedorCreate";
export { default as ProveedorEdit } from "./pages/ProveedorEdit";
export { default as ProveedorDetailPage } from "./pages/ProveedorDetailPage";

