// src/modules/dashboard/types.ts

/**
 * Tipos para la respuesta cruda del Backend (Django snake_case)
 */

export interface BackendComparison {
  total: number;
  cantidad?: number;
  variacion: number;
}

export interface BackendResumen {
  ventas_mes: BackendComparison;
  compras_mes: BackendComparison;
  ganancia_mes: BackendComparison;
  clientes_nuevos: BackendComparison;
  productos_activos: number;
  alertas_stock: number;
}

export interface BackendVentaDiaria {
  fecha: string;
  total: number;
  cantidad: number;
}

export interface BackendProductoTop {
  id: number;
  nombre: string;
  total_unidades: number; // El backend envía total_unidades
  total_monto: number;
  veces_vendido: number;
}

export interface BackendAlertaItem {
  producto_id?: number;
  venta_id?: number;
  nombre?: string;
  mensaje: string;
  timestamp: string;
}

export interface BackendAlertas {
  total: number;
  sin_stock: BackendAlertaItem[];
  stock_critico: BackendAlertaItem[];
  stock_advertencia: BackendAlertaItem[];
  ventas_pendientes: BackendAlertaItem[];
}

export interface BackendCajaResumen {
  total_ingresos: number;
  total_egresos: number;
  saldo_neto: number; // El backend envía saldo_neto
  sesiones_abiertas: number;
}

export interface BackendActividad {
  id: number;
  type: string; // El backend envía 'type', no 'tipo'
  accion: string;
  descripcion: string;
  usuario: string;
  timestamp: string;
  fecha: string;
  estado: 'success' | 'warning' | 'info' | 'error';
}

/**
 * Tipos Procesados para el Frontend (camelCase)
 */

export interface ComparisonStats {
  value: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  label: string;
}

export interface KPIStats {
  totalSales: number;
  salesComparison: ComparisonStats;
  salesTarget: number;
  
  newCustomers: number;
  customersComparison: ComparisonStats;
  customersTarget: number;

  pendingOrders: number;
  ordersComparison: ComparisonStats;
  
  lowStockProducts: number;
  stockTrend: "up" | "down" | "stable";
  criticalStockCount: number;
}

export interface SalesDataPoint {
  name: string;
  ventas: number;
}

export interface ProductDataPoint {
  name: string;
  cantidad: number;
}

export interface CashFlowPoint {
  name: string;
  ingresos: number;
  egresos: number;
}

export interface RecentActivity {
  id: number;
  type: 'sale' | 'order' | 'product' | 'customer';
  descripcion: string;
  usuario: string;
  modulo: string;
  timestamp: string;
  fecha: string;
  estado: 'success' | 'warning' | 'info' | 'error';
}

export interface SystemAlert {
  id: number;
  severidad: "critica" | "media" | "baja" | "advertencia" | "informacion";
  title: string;
  message: string;
  timestamp: string;
  type: 'product' | 'sale';
  actionable?: boolean;
}

export interface CashStats {
  balanceActual: number;
  ingresosDia: number;
  egresosDia: number;
  estado: 'abierta' | 'cerrada';
  ultimaApertura: string;
}

export interface DashboardData {
  kpis: KPIStats;
  charts: {
    salesHistory: SalesDataPoint[];
    topProducts: ProductDataPoint[];
    cashFlow: CashFlowPoint[];
  };
  cash: CashStats;
  recentActivities: RecentActivity[];
  systemAlerts: SystemAlert[];
}

export interface DashboardFilters {
  dateRange: 'today' | 'week' | 'month' | 'year';
  mode: 'executive' | 'operational';
  customStartDate?: string;
  customEndDate?: string;
}
