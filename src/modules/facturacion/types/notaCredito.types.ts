export type EstadoNota = 'BORRADOR' | 'EMITIDA' | 'APLICADA' | 'ANULADA';

export interface NotaCreditoDetalle {
  id: number;
  producto?: number;
  producto_nombre: string;
  producto_codigo: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  subtotal: number;
  impuestos_linea: number;
  total_linea: number;
}

export interface NotaCredito {
  id: number;
  numero: string | null;
  factura: number; // ID de la factura
  factura_numero: string;
  motivo: string;
  subtotal: number;
  descuento_total: number;
  impuestos_total: number;
  total: number;
  estado: EstadoNota;
  fecha_emision: string;
  creado_por: number;
  creado_por_nombre: string;
  detalles?: NotaCreditoDetalle[];
}

export interface NotaCreditoDetalleCreate {
  producto_id?: number | null;
  producto_nombre?: string;
  producto_codigo?: string;
  cantidad: number;
  precio_unitario: number;
  descuento?: number;
  impuestos_linea?: number;
}

export interface NotaCreditoCreate {
  factura_id: number;
  motivo: string;
  detalles: NotaCreditoDetalleCreate[];
}

export interface EmitirNotaCreditoPayload {
  tipo_aplicacion: 'SALDO_FAVOR' | 'REEMBOLSO';
  revertir_inventario: boolean;
}

export interface AnularNotaCreditoPayload {
  motivo: string;
}

export interface NotasCreditoFilters {
  search?: string;
  estado?: EstadoNota | '';
  factura?: number;
  page?: number;
}
