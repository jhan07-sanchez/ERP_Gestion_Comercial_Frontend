export interface ReportFilterOptions {
  clienteId?: number;
  productoId?: number;
  categoria?: string;
  tipo?: 'ingreso' | 'egreso';
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface MovimientoFinanciero {
  id: string;
  fecha: string;
  concepto: string;
  tipo: 'ingreso' | 'egreso';
  monto: number;
  categoria: string;
}

export interface EstadoResultadosData {
  ingresos: number;
  costos: number;
  gastos: number;
  utilidad_bruta: number;
  utilidad_neta: number;
  margen_bruto: number;
  periodo: {
    inicio?: string | null;
    fin?: string | null;
  };
}

export interface BalanceGeneralData {
  activos: {
    disponible: number;
    inventarios: number;
    total_corrientes: number;
    total: number;
  };
  pasivos: {
    cuentasPorPagar: number;
    total: number;
  };
  patrimonio: number;
  fecha_corte: string;
}

export interface ProductividadData {
  empleado_id: number;
  nombre: string;
  total_ventas: number;
  cantidad: number;
  ticket_promedio: number;
}

export interface ProyeccionData {
  diario_promedio: number;
  proyeccion_7d: number;
  proyeccion_15d: number;
  proyeccion_30d: number;
}

export interface FlujoCajaData {
  entradas: number;
  salidas: number;
  balance: number;
  detalle: {
    tipo: string;
    monto: number;
    fecha: string;
    concepto: string;
  }[];
}
