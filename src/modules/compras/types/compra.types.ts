/**
 * Tipos para el módulo Compras
 */

// ===============================
// Proveedor
// ===============================
export interface Proveedor {
  id: number;
  nombre: string;
  identificacion?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  estado: boolean;
  fecha_creacion?: string;
}

export interface ProveedorSimple {
  id: number;
  nombre: string;
}
export type EstadoCompra = "PENDIENTE" | "REALIZADA" | "ANULADA";

// ===============================
// Compra
// ===============================
export interface Compra {
  id: number;
  proveedor_id: number;
  fecha: string; // YYYY-MM-DD
  observaciones?: string;
  total: number;
  estado: EstadoCompra;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// ===============================
// Compra para listar
// ===============================
export interface CompraList extends Compra {
  proveedor_info?: ProveedorSimple;
  total_items?: number;
}

// ===============================
// Detalle de compra
// ===============================
export interface CompraDetalle {
  id: number;
  compra: number;
  producto: number;
  cantidad: number;
  precio_compra: number;
  subtotal: number;
}

// ===============================
// Compra con detalles (DETAIL)
// ===============================
export interface CompraDetail extends Compra {
  detalles: CompraDetalle[];
  proveedor: number; // ✅ Django envía esto
  proveedor_nombre?: string; // ✅ Django también envía esto
  proveedor_info?: ProveedorSimple; // ✅ Y esto
  fecha: string;
  estado: EstadoCompra;
}

// ===============================
// Compra para crear
// ===============================
export interface CompraCreateInput {
  proveedor_id: number;
  fecha: string;
  observaciones?: string;
  detalles: CompraDetalleCreateInput[];
}

// ===============================
// Compra para actualizar
// ===============================
export interface CompraUpdateInput {
  proveedor_id?: number;
  fecha?: string;
  observaciones?: string;
  estado?: EstadoCompra;
  detalles?: CompraDetalleCreateInput[];
}

// ===============================
// Detalle de compra (crear / editar)
// ===============================
export interface CompraDetalleCreateInput {
  producto_id: number;
  cantidad: number;
  precio_compra: number;
}

// ===============================
// Filtros de compras
// ===============================
export interface CompraFilters {
  search?: string;
  proveedor_id?: number;
  estado?: EstadoCompra;
  fecha_inicio?: string;
  fecha_fin?: string;
}

// ===============================
// Respuesta paginada (reutilizable)
// ===============================
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ===============================
// Respuesta genérica de éxito
// ===============================
export interface SuccessResponse<T> {
  detail: string;
  data: T;
}

/**
 * Tipo exclusivo para formularios (Create / Edit)
 * NO es el payload del backend
 */
export interface CompraFormValues {
  proveedor_id: number; // siempre number en UI
  fecha: string;
  observaciones?: string;
  estado?: EstadoCompra;
  detalles: {
    producto: number;
    cantidad: number;
    precio_compra: number;
  }[];
}
