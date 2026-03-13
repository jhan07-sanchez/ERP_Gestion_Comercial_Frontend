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
  documento?: string;
  telefono?: string;
  email?: string;
}
export type EstadoCompra = "PENDIENTE" | "PARCIAL" | "COMPLETADA" | "ANULADA";
export type MetodoPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "YAPE" | "PLIN" | "CREDITO";

export interface PagoCompra {
  id: number;
  fecha: string;
  monto: number;
  metodo_pago: MetodoPago;
  metodo_pago_display?: string;
  referencia: string | null;
  usuario_nombre: string;
}

// ===============================
// Compra
// ===============================
export interface Compra {
  id: number;
  numero_compra: string;
  proveedor_id: number;
  fecha: string; // YYYY-MM-DD
  observaciones?: string;
  total: number;
  estado: EstadoCompra;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  estado_badge: {
    color: "success" | "warning" | "danger";
    texto: string;
    icono: string;
  };
  created_at: string;
  total_productos: number;
  total_unidades: number;
}

// ===============================
// Compra para listar
// ===============================
export interface CompraList extends Compra {
  proveedor_info?: ProveedorSimple;
  total_items?: number;
  productos_resumen?: string;
}

// ===============================
// Detalle de compra
// ===============================
export interface CompraDetalle {
  id: number;
  compra: number;
  producto: number;
  producto_nombre: string;
  cantidad: number;
  precio_compra: number;
  subtotal: number;
  margen_potencial: {
    precio_venta_actual: number;
    ganancia_unitaria: number;
    ganancia_total: number;
    margen_porcentaje: number;
    valor_compra: number;
    valor_venta_potencial: number;
    ganancia_potencial: number;
  };
  motivo_anulacion?: string | null;
  // PERMISOS INLINE
  puede_editar: boolean;
  puede_confirmar: boolean;
  puede_anular: boolean;
}

// ===============================
// Compra con detalles (DETAIL)
// ===============================
export interface CompraDetail extends Compra {
  detalles: CompraDetalle[];
  proveedor: number;
  proveedor_nombre?: string;
  usuario_nombre?: string;
  usuario_email?: string;
  proveedor_info: ProveedorSimple;
  fecha: string;
  estado: EstadoCompra;
  pagos: PagoCompra[];
  saldo_pendiente: number;
  margen_potencial: {
    valor_compra: number;
    valor_venta_potencial: number;
    ganancia_potencial: number;
    margen_porcentaje: number;
  };
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
  numero_compra?: number;
  proveedor_nombre?: string;
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

export interface ApiSuccessResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}