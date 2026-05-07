export interface KpiMetrics {
  ventasDelDia: number;
  ventasDelMes: number;
  margenGanancia: number;
  ticketPromedio: number;
  balanceCaja: number;
}

export interface ChartDataPoint {
  name: string;
  ingresos: number;
  egresos?: number;
}

export interface TopProducto {
  id: number;
  nombre: string;
  cantidad: number;
  ventas: number;
}

export interface DashboardAlert {
  id: string;
  tipo: 'warning' | 'danger' | 'info';
  mensaje: string;
  fecha: string;
}

export interface RecentActivityItem {
  id: string;
  tipo: 'venta' | 'caja_movimiento' | 'compra';
  descripcion: string;
  monto?: number;
  fecha: string;
}

export interface DashboardData {
  kpis: KpiMetrics;
  graficoVentas: ChartDataPoint[];
  graficoIngresosEgresos: ChartDataPoint[];
  topProductos: TopProducto[];
  alertas: DashboardAlert[];
  actividadReciente: RecentActivityItem[];
}
