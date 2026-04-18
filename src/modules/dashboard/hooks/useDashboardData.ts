// src/modules/dashboard/hooks/useDashboardData.ts

import { useState, useEffect, useCallback, useRef } from "react";
import type { DashboardData, DashboardFilters } from "../types";
import { dashboardAPI } from "../api/dashboard.api";
import { showGlobalAlert } from "@/shared/components/alerts";

export function useDashboardData(initialFilters?: Partial<DashboardFilters>) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: initialFilters?.dateRange || "week",
    mode: initialFilters?.mode || "executive",
    ...initialFilters
  });

  // Timer para el auto-refresh
  const refreshInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);
    
    setError(null);

    try {
      const dashboardData = await dashboardAPI.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      console.error("Dashboard integration error:", err);
      setError("Error al conectar con el servidor ERP");
      
      // Usamos una verificación simple; si llega aquí y falla un refresh silencioso, 
      // es muy probable que ya hubiera datos en pantalla.
      showGlobalAlert("Error de actualización", "warning", { 
        description: "No se pudieron obtener los datos más recientes." 
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []); // Dependencia vacía para evitar bucles

  // Efecto inicial y setup de polling
  useEffect(() => {
    fetchData();

    // Auto-refresh cada 60 segundos
    refreshInterval.current = setInterval(() => {
      fetchData(true);
    }, 60000);

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [fetchData]);

  const refresh = () => {
    fetchData();
  };

  const setMode = (mode: 'executive' | 'operational') => {
    setFilters(prev => ({ ...prev, mode }));
  };

  const setDateRange = (dateRange: DashboardFilters['dateRange']) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    filters,
    setFilters,
    setMode,
    setDateRange,
    refresh,
  };
}


