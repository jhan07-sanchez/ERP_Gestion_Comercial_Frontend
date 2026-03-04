// src/modules/dashboard/api/dashboard.api.ts

import axiosInstance from "@/shared/api/axios";
import type {
  DashboardData,
  DashboardFilters,
  KPIStats,
  SystemAlert,
  RecentActivity,
} from "../types";

const API_BASE = "/dashboard";

interface DashboardAlertItem {
  producto_id?: number;
  venta_id?: number;
  nombre?: string;
  codigo?: string;
  categoria?: string;
  tipo: string;
  severidad: SystemAlert['severidad'];
  mensaje: string;
  timestamp?: string;
  fecha?: string;
  stock_actual?: number;
  stock_minimo?: number;
}

interface DashboardAlertsResponse {
  success: boolean;
  data: {
    total: number;
    sin_stock: DashboardAlertItem[];
    stock_critico: DashboardAlertItem[];
    stock_advertencia: DashboardAlertItem[];
    ventas_pendientes: DashboardAlertItem[];
  };
}

interface RawActivity {
  id: number;
  tipo?: string;
  type?: string;
  descripcion: string;
  fecha: string;
  estado: RecentActivity['estado'];
}

export const dashboardAPI = {
  /**
   * Obtiene datos completos del dashboard
   */
  getDashboardData: async (
    filters?: DashboardFilters,
  ): Promise<DashboardData> => {
    const params = new URLSearchParams();

    if (filters?.dateRange) params.append("date_range", filters.dateRange);
    if (filters?.customStartDate)
      params.append("start_date", filters.customStartDate);
    if (filters?.customEndDate)
      params.append("end_date", filters.customEndDate);

    const response = await axiosInstance.get(`${API_BASE}/`, { params });

    return response.data;
  },

  getKPIStats: async (): Promise<KPIStats> => {
    const [alertsResponse, clientsResponse] = await Promise.all([
      axiosInstance.get<DashboardAlertsResponse>(`${API_BASE}/alertas/`),
      axiosInstance.get(`${API_BASE}/clientes/`),
    ]);

    const alerts = alertsResponse.data.data;
    const clients = clientsResponse.data.data;

    return {
      totalProducts: 0,
      productsTrend: "stable",
      productsPercentage: 0,
      totalSales: 0,
      salesTrend: "stable",
      salesPercentage: 0,
      pendingOrders: alerts.ventas_pendientes.length,
      ordersTrend: "stable",
      ordersPercentage: 0,
      lowStockProducts: alerts.sin_stock.length + alerts.stock_critico.length + alerts.stock_advertencia.length,
      stockTrend: (alerts.sin_stock.length + alerts.stock_critico.length) > 0 ? "down" : "stable",
      stockPercentage: 0,
      newCustomers: clients.nuevos_este_mes,
      customersTrend: clients.nuevos_este_mes > 0 ? "up" : "stable",
      customersPercentage: 0,
    };
  },

  getSystemAlerts: async (): Promise<SystemAlert[]> => {
    const response = await axiosInstance.get<DashboardAlertsResponse>(
      `${API_BASE}/alertas/`,
    );

    const raw = response.data.data;

    const alerts: SystemAlert[] = [
      ...raw.sin_stock.map<SystemAlert>((item: DashboardAlertItem) => ({
        id: item.producto_id || 0,
        severidad: item.severidad,
        title: item.nombre || "Sin nombre",
        message: item.mensaje,
        timestamp: item.timestamp || new Date().toISOString(),
        type: 'product',
      })),

      ...raw.stock_critico.map<SystemAlert>((item: DashboardAlertItem) => ({
        id: item.producto_id || 0,
        severidad: item.severidad,
        title: item.nombre || "Sin nombre",
        message: item.mensaje,
        timestamp: item.timestamp || new Date().toISOString(),
        type: 'product',
      })),

      ...raw.stock_advertencia.map<SystemAlert>((item: DashboardAlertItem) => ({
        id: item.producto_id || 0,
        severidad: item.severidad,
        title: item.nombre || "Sin nombre",
        message: item.mensaje,
        timestamp: item.timestamp || new Date().toISOString(),
        type: 'product',
      })),

      ...raw.ventas_pendientes.map<SystemAlert>((item: DashboardAlertItem) => ({
        id: item.venta_id || 0,
        severidad: item.severidad,
        title: `Venta #${item.venta_id}`,
        message: item.mensaje,
        timestamp: item.timestamp || item.fecha || new Date().toISOString(),
        type: 'sale',
      })),
    ];

    return alerts;
  },

  /**
   * Obtiene actividades recientes
   */
  getRecentActivities: async (limit = 10): Promise<RecentActivity[]> => {
    const params = new URLSearchParams();
    params.append("limit", String(limit));

    const response = await axiosInstance.get(`${API_BASE}/actividad/`, {
      params,
    });

    // Normalizamos fecha -> timestamp
    const RecentActivity: RecentActivity[] = (
      response.data.data as RawActivity[]
    ).map((item) => {
      // Heurística para mapear tipos del backend al frontend
      let type: RecentActivity['type'] = 'order';
      const rawType = (item.type || item.tipo || '').toLowerCase();

      if (rawType.includes('vent')) type = 'sale';
      else if (rawType.includes('compr')) type = 'order';
      else if (rawType.includes('client')) type = 'customer';
      else if (rawType.includes('prod')) type = 'product';

      return {
        id: item.id,
        type,
        descripcion: item.descripcion,
        timestamp: item.fecha, // normalizamos la fecha
        fecha: item.fecha,
        estado: item.estado,
      };
    });
    return RecentActivity;
  },

  /**
   * Marca alerta como leída
   */
  markAlertAsRead: async (alertId: number) => {
    const response = await axiosInstance.patch(
      `${API_BASE}/alerts/${alertId}/`,
      { is_read: true },
    );

    return response.data;
  },
};
