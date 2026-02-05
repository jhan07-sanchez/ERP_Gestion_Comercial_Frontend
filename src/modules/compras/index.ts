// src/modules/compras/index.ts

// Types
export * from "./types/compra.types";

// API
export * from "./api/compras.api";

// Hooks
export * from "./hooks/useCompra";

// Components
export { CompraForm } from "./components/CompraForm";

// Pages
export { default as ComprasList } from "./pages/ComprasList";
export { default as CompraCreate } from "./pages/CompraCreate";
export { default as CompraEdit } from "./pages/CompraEdit";
export { default as CompraDetailPage } from "./pages/CompraDetailPage";
