/**
 * Tipos para el módulo de Inventario (Stock y Movimientos)
 */

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
