/**
 * 📦 Tipos: Facturas de Compra
 *
 * Reutiliza los tipos de compras del módulo compras,
 * adaptados al contexto de facturación.
 */

import type { EstadoCompra } from "@/modules/compras/types";

export type { EstadoCompra } from "@/modules/compras/types";

/** Factura de compra en listados (basada en CompraList) */
export interface FacturaCompraList {
  id: number;
  numero_compra: string;
  proveedor_id: number;
  fecha: string;
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
  proveedor_info?: {
    id: number;
    nombre: string;
    documento?: string;
    telefono?: string;
    email?: string;
  };
  total_items?: number;
  productos_resumen?: string;
  saldo_pendiente?: number;
}

/** Filtros para listado de facturas de compra */
export interface FacturaCompraFilters {
  search?: string;
  estado?: EstadoCompra | "";
  proveedor_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
}
