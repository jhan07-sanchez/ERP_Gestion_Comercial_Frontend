// src/modules/compras/types/compra-form.types.ts
export interface CompraItemForm {
  id: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface CompraFormData {
  numero_factura: string;
  fecha: string;
  proveedor_id: number;
  observaciones?: string;
  items: CompraItemForm[];
}