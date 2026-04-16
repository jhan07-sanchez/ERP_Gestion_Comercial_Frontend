/**
 * 📄 TIPOS DEL MÓDULO DOCUMENTOS
 */

export const TIPO_DOCUMENTO = {
  FACTURA_VENTA: 'FACTURA_VENTA',
  FACTURA_COMPRA: 'FACTURA_COMPRA',
  TICKET_POS: 'TICKET_POS',
} as const;

export type TipoDocumento = keyof typeof TIPO_DOCUMENTO;

export const ESTADO_DOCUMENTO = {
  EMITIDO: 'EMITIDO',
  ANULADO: 'ANULADO',
} as const;

export type EstadoDocumento = keyof typeof ESTADO_DOCUMENTO;

/** Estructura de respuesta paginada (estándar del backend) */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DocumentoDetalle {
  id: number;
  orden: number;
  descripcion: string;
  producto_id: number | null;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface DocumentoList {
  id: number;
  uuid: string;
  tipo: TipoDocumento;
  tipo_display: string;
  estado: EstadoDocumento;
  estado_display: string;
  numero_interno: string;
  codigo_verificacion: string;
  entidad_nombre: string; // Cliente o Proveedor
  total: number;
  fecha_emision: string;
  usuario_nombre: string;
}

export interface DocumentoDetail extends DocumentoList {
  numero_secuencia: number;
  hash_verificacion: string;
  subtotal: number;
  impuestos: number;
  fecha_vencimiento: string | null;
  referencia_operacion: string;
  referencia_detallada: {
    venta_id: number | null;
    compra_id: number | null;
    numero?: string;
  };
  notas: string;
  lineas: DocumentoDetalle[];
}

export interface DocumentoFilters {
  tipo?: TipoDocumento | '';
  venta_id?: number;
  compra_id?: number;
  search?: string;
}
