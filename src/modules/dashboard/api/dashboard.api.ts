// src/modules/dashboard/api/dashboard.api.ts

import axiosInstance from "@/api/axios";
import type {
  DashboardData,
  DashboardFilters,
  KPIStats,
  SystemAlert,
  RecentActivity,
} from "../types";

const API_BASE = "/dashboard";

interface DashboardProductAlert {
  producto_id: number;
  nombre: string;
  codigo: string;
  categoria: string;
  tipo: string;
  severidad: "critica" | "media" | "baja";
  mensaje: string;
}

interface DashboardAlertsResponse {
  success: boolean;
  data: {
    total: number;
    sin_stock: DashboardProductAlert[];
    stock_bajo: DashboardProductAlert[];
    ventas_pendientes: DashboardProductAlert[];
  };
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

  /**
   * Obtiene KPIs desde endpoint de alertas (real)
   */
  getKPIStats: async (): Promise<KPIStats> => {
    const response = await axiosInstance.get<DashboardAlertsResponse>(
      `${API_BASE}/alertas/`,
    );

    const raw = response.data.data;

    return {
      totalProducts: 0,
      productsTrend: "stable",
      productsPercentage: 0,

      totalSales: 0,
      salesTrend: "stable",
      salesPercentage: 0,

      pendingOrders: raw.ventas_pendientes.length,
      ordersTrend: "stable",
      ordersPercentage: 0,

      lowStockProducts: raw.sin_stock.length + raw.stock_bajo.length,
      stockTrend: raw.sin_stock.length > 0 ? "down" : "stable",
      stockPercentage: 0,

      newCustomers: 0,
      customersTrend: "stable",
      customersPercentage: 0,
    };
  },

  /**
   * Obtiene alertas del sistema adaptadas al frontend
   */
  getSystemAlerts: async (): Promise<SystemAlert[]> => {
    const response = await axiosInstance.get<DashboardAlertsResponse>(
      `${API_BASE}/alertas/`,
    );

    const raw = response.data.data;

    const alerts: SystemAlert[] = [
      ...raw.sin_stock.map<SystemAlert>((item) => ({
        id: item.producto_id,
        severidad: item.severidad,
        title: item.nombre,
        message: item.mensaje,
        timestamp: new Date().toISOString(),
      })),

      ...raw.stock_bajo.map<SystemAlert>((item) => ({
        id: item.producto_id,
        severidad: item.severidad,
        title: item.nombre,
        message: item.mensaje,
        timestamp: new Date().toISOString(),
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
      response.data.data as RecentActivity[]
    ).map((item) => ({
      id: item.id,
      type: "order", // o usa lógica según item.tipo
      descripcion: item.descripcion,
      timestamp: item.fecha, // normalizamos la fecha
      fecha: item.fecha,
      estado: item.estado
    }));
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
