import { useState, useEffect, useCallback } from 'react';
import type { AnalyticsData } from '../types/analytics.types';
import { reportesAPI, type AnalyticsFilters } from '../api/reportes.api';

export function useAnalyticsData() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros globales sincronizados
  const [filters, setFilters] = useState<AnalyticsFilters>({
    rango: '30d',
    sucursal: undefined,
    caja: undefined,
    vendedor: undefined,
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await reportesAPI.getAnalyticsData(filters);
      setData(result);
    } catch (err: unknown) {
      console.error('Analytics Fetch Error:', err);
      const errorResponse = err as { response?: { data?: { error?: string } } };
      setError(errorResponse.response?.data?.error || 'Error al obtener datos de analítica real.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilters = (newFilters: Partial<AnalyticsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const setDateRange = (rango: AnalyticsFilters['rango']) => {
    updateFilters({ rango });
  };

  return {
    data,
    isLoading,
    error,
    dateRange: filters.rango,
    filters,
    setDateRange,
    updateFilters,
    refresh: fetchData,
  };
}
