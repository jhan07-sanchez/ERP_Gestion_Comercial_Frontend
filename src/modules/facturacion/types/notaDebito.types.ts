import type { EstadoNota } from './notaCredito.types';
export type { EstadoNota };

export interface NotaDebitoDetalle {
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

export interface NotaDebito {
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
  detalles?: NotaDebitoDetalle[];
}

export interface NotaDebitoDetalleCreate {
  producto_id?: number | null;
  producto_nombre?: string;
  producto_codigo?: string;
  cantidad: number;
  precio_unitario: number;
  descuento?: number;
  impuestos_linea?: number;
}

export interface NotaDebitoCreate {
  factura_id: number;
  motivo: string;
  detalles: NotaDebitoDetalleCreate[];
}

export interface AnularNotaDebitoPayload {
  motivo: string;
}

export interface NotasDebitoFilters {
  search?: string;
  estado?: EstadoNota | '';
  factura?: number;
  page?: number;
}
