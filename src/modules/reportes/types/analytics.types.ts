export interface TrendMetric {
  value: number;
  trend: number;
  isPositive: boolean;
}

export interface FinancialKPIs {
  ventasDiarias: TrendMetric;
  ventasSemanales: TrendMetric;
  ventasMensuales: TrendMetric;
  ventasAnuales: TrendMetric;
  ingresosNetos: TrendMetric;
  utilidadBruta: TrendMetric;
  utilidadNeta: TrendMetric;
  margenGanancia: TrendMetric; // %
  margenOperativo: TrendMetric; // %
  flujoCaja: TrendMetric;
  ticketPromedio: TrendMetric;
  proyeccionVentas: TrendMetric;
}

export interface CommercialKPIs {
  clientesNuevos: TrendMetric;
  clientesRecurrentes: TrendMetric;
  tasaRecompra: TrendMetric; // %
  clientesInactivos: TrendMetric;
  conversionVentas: TrendMetric; // %
  pedidosCompletados: TrendMetric;
  pedidosPendientes: TrendMetric;
  pedidosCancelados: TrendMetric;
  promedioPorCliente: TrendMetric;
}

export interface InventoryKPIs {
  stockCritico: TrendMetric;
  productosAgotados: TrendMetric;
  productosMasVendidos: TrendMetric;
  rotacionInventario: TrendMetric; // días
  valorizacionStock: TrendMetric;
  movimientosInventario: TrendMetric;
}

export interface OperativeKPIs {
  rendimientoDiario: TrendMetric; // %
  eficienciaOperativa: TrendMetric; // %
  tiempoPromedioVenta: TrendMetric; // minutos
  tiempoPromedioFacturacion: TrendMetric; // minutos
  cajasAbiertas: number;
  movimientosCaja: TrendMetric;
  gastosVsIngresos: TrendMetric; // %
}

export interface SalesTrendData {
  fecha: string;
  actual: number;
  anterior: number;
  proyectado?: number;
}

export interface ProductPerformanceData {
  nombre: string;
  ventas: number;
  ingresos: number;
  rotacion: 'Alta' | 'Media' | 'Baja';
  stockActual: number;
  tendencia: number;
}

export interface CategoryPerformanceData {
  categoria: string;
  ingresos: number;
  costos: number;
  utilidad: number;
  porcentaje: number;
}

export interface CustomerAnalyticsData {
  mes: string;
  nuevos: number;
  recurrentes: number;
  inactivos: number;
}

export interface AnalyticsData {
  kpis: {
    financieros: FinancialKPIs;
    comerciales: CommercialKPIs;
    inventario: InventoryKPIs;
    operativos: OperativeKPIs;
  };
  charts: {
    salesTrend: SalesTrendData[];
    categoryPerformance: CategoryPerformanceData[];
    customerRetention: CustomerAnalyticsData[];
    topProducts: ProductPerformanceData[];
    lowRotationProducts: ProductPerformanceData[];
  };
}
