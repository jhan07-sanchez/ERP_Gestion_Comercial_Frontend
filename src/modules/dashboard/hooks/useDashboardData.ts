// src/modules/dashboard/hooks/useDashboardData.ts

import { useState, useEffect, useCallback } from "react";
import type { DashboardData, DashboardFilters } from "../types";
import { dashboardAPI } from "../api/dashboard.api";

export function useDashboardData(initialFilters?: DashboardFilters) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>(
    initialFilters || { dateRange: "week" },
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [kpis, systemAlerts, recentActivities] = await Promise.all([
        dashboardAPI.getKPIStats(),
        dashboardAPI.getSystemAlerts(),
        dashboardAPI.getRecentActivities(),
      ]);

      const dashboardData: DashboardData = {
        kpis,
        systemAlerts,
        recentActivities,
      };

      setData(dashboardData);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, filters]);

  const refresh = () => {
    fetchData();
  };

  return {
    data,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
  };
}
