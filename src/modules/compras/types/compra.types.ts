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

/** Documento ERP generado al confirmar / completar compra (opcional en API). */
export interface DocumentoEmitidoResumen {
  id: number;
  tipo: "FACTURA_VENTA" | "TICKET_POS" | "FACTURA_COMPRA";
  tipo_display: string;
  estado: string;
  numero_interno: string;
  referencia_operacion: string;
  subtotal: string;
  impuestos: string;
  total: string;
  fecha_emision: string | null;
  numero_fiscal: string | null;
  prefijo_fiscal: string | null;
}

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
  documento?: DocumentoEmitidoResumen | null;
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
// Tipos compartidos (re-exportados desde shared)
// ===============================
export type { PaginatedResponse, SuccessResponse, PaginationState, ApiResponse as ApiSuccessResponse } from "@shared/types";

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

// 🆕 Cuenta por Pagar (generada por pagos a crédito)
export interface CuentaPorPagar {
  id: number;
  compra: number;
  proveedor: number;
  proveedor_nombre?: string;
  monto_total: number;
  saldo_pendiente: number;
  estado: 'PENDIENTE' | 'PARCIAL' | 'PAGADO';
  porcentaje_pagado?: number;
  fecha_vencimiento?: string | null;
  notas?: string | null;
  fecha_creacion: string;
}