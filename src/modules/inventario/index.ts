/**
 * Exportaciones principales del módulo Inventario
 */

// Pages
export { default as ProductosList } from './pages/ProductosList';
export { default as ProductoCreate } from './pages/ProductoCreate';
export { default as ProductoEdit } from './pages/ProductoEdit';

// Hooks
export { useProductos } from './hooks/useProductos';

// API
export { productosAPI } from './api/productos.api';

// Types
export type {
  Producto,
  ProductoList,
  ProductoCreateInput,
  ProductoUpdateInput,
  Categoria,
  Inventario,
  MovimientoInventario,
  ProductoFilters,
} from './types';
