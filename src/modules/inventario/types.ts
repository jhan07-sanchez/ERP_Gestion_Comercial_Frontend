/**
 * Tipos para el módulo Inventario
 */

// Categoría de productos
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: string;
}

// Producto
export interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  categoria: Categoria | number;
  precio_venta: number;
  precio_compra?: number;
  stock_minimo: number;
  estado: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Producto para listar (respuesta del servidor)
export interface ProductoList extends Producto {
  stock_actual?: number;
}

// Producto para crear
export interface ProductoCreateInput {
  nombre: string;
  codigo: string;
  descripcion?: string;
  categoria_id: number;
  precio_venta: number;
  precio_compra?: number;
  stock_minimo: number;
  fecha_ingreso?: string; // Fecha de ingreso al inventario
}

// Producto para actualizar
export interface ProductoUpdateInput {
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  categoria?: number;
  precio_venta?: number;
  precio_compra?: number;
  stock_minimo?: number;
  estado?: boolean;
}

// Inventario
export interface Inventario {
  id: number;
  producto: number;
  stock_actual: number;
  fecha_actualizacion: string;
}

// Movimiento de inventario
export interface MovimientoInventario {
  id: number;
  producto: number;
  tipo_movimiento: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  referencia: string;
  usuario: number;
  fecha: string;
}

// Movimiento para crear
export interface MovimientoInventarioCreateInput {
  producto: number;
  tipo_movimiento: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  referencia: string;
}

// Ajuste de stock
export interface AjusteInventario {
  stock_nuevo: number;
  motivo: string;
}

// Filtros para productos
export interface ProductoFilters {
  search?: string;
  categoria_id?: number;
  categoria?: string;
  estado?: boolean;
  precio_min?: number;
  precio_max?: number;
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Respuesta de creación exitosa
export interface SuccessResponse<T> {
  detail: string;
  data: T;
}
