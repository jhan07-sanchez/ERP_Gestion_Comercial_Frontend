// src/modules/dashboard/api/dashboard.api.ts

import axiosInstance from '@/api/axios';
import type { DashboardData, DashboardFilters } from '../types';

/**
 * API del módulo Dashboard
 * Centraliza todas las llamadas al backend relacionadas con el dashboard
 */

export const dashboardAPI = {
  /**
   * Obtiene los datos principales del dashboard
   * @param filters - Filtros de fecha y periodo
   */
  getDashboardData: async (filters?: DashboardFilters): Promise<DashboardData> => {
    const params = filters ? {
      date_range: filters.dateRange,
      start_date: filters.customStartDate,
      end_date: filters.customEndDate,
    } : {};

    const response = await axiosInstance.get('api/dashboard/', { params });
    return response.data;
  },

  /**
   * Obtiene solo las estadísticas KPI
   */
  getKPIStats: async () => {
    const response = await axiosInstance.get('api/dashboard/kpis/');
    return response.data;
  },

  /**
   * Obtiene actividades recientes
   */
  getRecentActivities: async (limit = 10) => {
    const response = await axiosInstance.get('api/dashboard/activities/', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Obtiene alertas del sistema
   */
  getSystemAlerts: async () => {
    const response = await axiosInstance.get('api/dashboard/alerts/');
    return response.data;
  },

  /**
   * Marca una alerta como leída
   */
  markAlertAsRead: async (alertId: number) => {
    const response = await axiosInstance.patch(`api/dashboard/alerts/${alertId}/`, {
      is_read: true,
    });
    return response.data;
  },
};