// src/modules/dashboard/types.ts

/**
 * Tipos para el módulo Dashboard
 */

// Estadísticas de KPI
export interface KPIStats {
  totalSales: number;
  salesTrend: 'up' | 'down' | 'stable';
  salesPercentage: number;
  pendingOrders: number;
  ordersTrend: 'up' | 'down' | 'stable';
  ordersPercentage: number;
  lowStockProducts: number;
  stockTrend: 'up' | 'down' | 'stable';
  stockPercentage: number;
  newCustomers: number;
  customersTrend: 'up' | 'down' | 'stable';
  customersPercentage: number;
}

// Actividad reciente
export interface RecentActivity {
  id: number;
  type: 'sale' | 'order' | 'product' | 'customer';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

// Alerta del sistema
export interface SystemAlert {
  id: number;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

// Datos completos del dashboard
export interface DashboardData {
  kpis: KPIStats;
  recentActivities: RecentActivity[];
  systemAlerts: SystemAlert[];
}

// Filtros del dashboard
export interface DashboardFilters {
  dateRange: 'today' | 'week' | 'month' | 'year';
  customStartDate?: string;
  customEndDate?: string;
}