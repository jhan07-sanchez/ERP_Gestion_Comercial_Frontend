// src/modules/dashboard/types.ts

/**
 * Tipos para el módulo Dashboard
 */

// Estadísticas de KPI
export interface KPIStats {
  totalProducts: number;
  productsTrend: "up" | "down" | "stable";
  productsPercentage: number;
  totalSales: number;
  salesTrend: "up" | "down" | "stable";
  salesPercentage: number;
  pendingOrders: number;
  ordersTrend: "up" | "down" | "stable";
  ordersPercentage: number;
  lowStockProducts: number;
  stockTrend: "up" | "down" | "stable";
  stockPercentage: number;
  newCustomers: number;
  customersTrend: "up" | "down" | "stable";
  customersPercentage: number;
}

// Actividad reciente
export interface RecentActivity {
  id: number;
  type: 'sale' | 'order' | 'product' | 'customer';
  descripcion: string;
  timestamp: string;
  fecha: string;
  estado: 'success' | 'warning' | 'info' | 'error';
}

// Alerta del sistema
export interface SystemAlert {
  id: number;
  severidad: "critica" | "media" | "baja" | "advertencia" | "informacion";
  title: string;
  message: string;
  timestamp: string;
  type: 'product' | 'sale';
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