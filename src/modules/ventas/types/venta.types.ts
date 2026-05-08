/**
 * Tipos para el módulo Ventas
 * Mismo patrón que compras/types/compra.types.ts
 */

// ===============================
// Estado de Venta
// ===============================
export type EstadoVenta = "PENDIENTE" | "PARCIAL" | "COMPLETADA" | "CANCELADA";

// ===============================
// Método de Pago
// ===============================
export type MetodoPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "YAPE" | "PLIN" | "CREDITO";

// ===============================
// Badge de estado (viene del backend)
// ===============================
export interface EstadoBadge {
  color: "success" | "warning" | "danger";
  texto: string;
  icono: string;
}

// ===============================
// Cliente simple (para relaciones)
// ===============================
export interface ClienteSimple {
  id: number;
  nombre: string;
  numero_documento: string;
  telefono?: string;
  email?: string;
}

// ===============================
// Venta base
// ===============================
export interface Venta {
  id: number;
  numero_documento: string;
  tipo_documento: "FACTURA" | "RECIBO";
  cliente: number;
  usuario: number;
  total: number;
  total_pagado: number;
  saldo_pendiente: number;
  estado: EstadoVenta;
  fecha: string;
  estado_badge: EstadoBadge;
}

// ===============================
// Detalle de Venta (lectura)
// ===============================
export interface VentaDetalle {
  id: number;
  venta: number;
  producto: number;
  producto_codigo: string;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

// ===============================
// Venta para listar
// ===============================
export interface VentaList extends Venta {
  cliente_nombre: string;
  cliente_documento: string;
  usuario_nombre: string;
  total_productos: number;
}

// ===============================
// Pago de Venta
// ===============================
export interface PagoVenta {
  id: number;
  monto: number;
  metodo_pago: MetodoPago;
  metodo_pago_display: string;
  monto_recibido: number;
  vuelto: number;
  referencia: string | null;
  fecha: string;
  usuario_nombre: string;
}

// ===============================
// Documento ERP (emitido al completar venta; opcional en API)
// ===============================
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

// ===============================
// Venta DETAIL (con detalles)
// ===============================
export interface VentaDetail extends Venta {
  cliente_info: ClienteSimple;
  cliente_nombre: string;
  usuario_nombre: string;
  usuario_email: string;
  detalles: VentaDetalle[];
  pagos: PagoVenta[];
  total_productos: number;
  total_unidades: number;
  documento?: DocumentoEmitidoResumen | null;
}

// ===============================
// Detalle para crear (payload backend)
// ===============================
export interface VentaDetalleCreateInput {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}

// ===============================
// Venta para crear
// ===============================
export interface VentaCreateInput {
  cliente_id: number;
  estado?: EstadoVenta;
  tipo_documento?: "FACTURA" | "RECIBO";
  detalles: VentaDetalleCreateInput[];
}

export interface PagoVentaCreateInput {
  monto: number;
  metodo_pago: MetodoPago;
  monto_recibido?: number;
  vuelto?: number;
  referencia?: string;
}

// ===============================
// Venta para actualizar
// ===============================
export interface VentaUpdateInput {
  cliente_id?: number;
  estado?: EstadoVenta;
  metodo_pago?: MetodoPago;
  monto_recibido?: number;
  vuelto?: number;
  detalles?: VentaDetalleCreateInput[];
}

// ===============================
// Filtros de ventas
// ===============================
export interface VentaFilters {
  search?: string;
  estado?: EstadoVenta | "";
  cliente_id?: number;
  cliente?: string;
  usuario_id?: number;
  total_min?: number;
  total_max?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
}

// ===============================
// Tipos compartidos (re-exportados desde shared)
// ===============================
export type { PaginatedResponse, SuccessResponse, PaginationState } from "@shared/types";

// ===============================
// Producto para seleccionar en formulario
// ===============================
export interface ProductoParaVenta {
  id: number;
  codigo: string;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
}

// ===============================
// Cliente para seleccionar en formulario
// ===============================
export interface ClienteParaVenta {
  id: number;
  nombre: string;
  numero_documento: string;
  documento?: string; // Mantener por compatibilidad temporal
  telefono?: string;
  email?: string;
}

// ===============================
// Tipo exclusivo para formulario UI (NO payload backend)
// Mismo patrón que CompraFormValues
// ===============================
export interface VentaFormData {
  id?: number;
  numero_documento?: string;
  cliente_id: number;
  estado?: EstadoVenta;
  tipo_documento: "FACTURA" | "RECIBO";
  metodo_pago?: MetodoPago;
  monto_recibido?: number | "";
  vuelto?: number | "";
  detalles: {
    producto_id: number;
    producto_codigo: string;
    producto_nombre: string;
    stock_disponible: number;
    cantidad: number | "";
    precio_unitario: number | "";
    subtotal: number;
  }[];
  total: number;
}



// ===============================
// Estadísticas de una venta
// ===============================
export interface EstadisticasVenta {
  total_productos: number;
  total_unidades: number;
  total_valor: number;
}

// ===============================
// Resumen general
// ===============================
export interface ResumenVentas {
  total_ventas: number;
  total_ingresos: number;
  ventas_pendientes: number;
  ventas_completadas: number;
  ventas_canceladas: number;
}
