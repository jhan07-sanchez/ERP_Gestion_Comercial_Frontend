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
  ingresosOperativos: number;
  costoVentas: number;
  gastosOperativos: number;
  impuestos: number;
  detalles: MovimientoFinanciero[];
}

export interface BalanceGeneralData {
  activos: {
    corrientes: number;
    noCorrientes: number;
  };
  pasivos: {
    corrientes: number;
    noCorrientes: number;
  };
  patrimonio: number;
}
