export interface DashboardResumen {
  kpis_mes_actual: {
    mes: string;
    total_facturado: number;
    total_cobrado: number;
    saldo_pendiente: number;

    cantidad_facturas?: number;
    facturas_pagadas?: number;
    facturas_vencidas?: number;
    ticket_promedio?: number;
  };

  facturas_por_estado: Record<string, number>;
}

export interface VentaMensual {
  mes: string;
  total_facturado: number;
  cantidad_facturas: number;
}

export interface TopCliente {
  cliente_id: number;
  cliente_nombre: string;
  total_comprado: number;
}

export interface TopProducto {
  producto_id: number;
  producto_nombre: string;
  cantidad_vendida: number;
  monto_generado: number;
}

export interface CuentaPorCobrar {
  factura_id: number;
  numero: string;
  cliente_nombre: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  estado: string;
  total: number;
  saldo_pendiente: number;
}
