// src/modules/compras/types/compra.types.ts
export interface CompraItem {
  id: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Compra {
  id: number;
  numero_factura: string;
  fecha: string;
  proveedor_id: number;
  proveedor_nombre: string;
  estado: "PENDIENTE" | "RECIBIDO" | "CANCELADO";
  total: number;
  observaciones: string | null;
  items: CompraItem[];
}

export interface CompraCreateInput {
  numero_factura: string;
  fecha: string;
  proveedor_id: number;
  observaciones?: string;
  items: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}

export interface CompraUpdateInput {
  numero_factura?: string;
  fecha?: string;
  proveedor_id?: number;
  estado?: "PENDIENTE" | "RECIBIDO" | "CANCELADO";
  observaciones?: string;
  items?: {
    id?: number;
    producto_id?: number;
    cantidad?: number;
    precio_unitario?: number;
  }[];
}
