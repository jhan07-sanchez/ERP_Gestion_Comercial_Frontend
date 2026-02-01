// src/modules/dashboard/hooks/useDashboardData.ts

import { useState, useEffect, useCallback } from 'react';
import type { DashboardData, DashboardFilters } from '../types';

// Datos mock para pruebas
const mockData: DashboardData = {
    kpis: {
      totalSales: 45320,
      salesTrend: 'up',
      salesPercentage: 12.5,
      pendingOrders: 8,
      ordersTrend: 'down',
      ordersPercentage: -5.2,
      lowStockProducts: 3,
      stockTrend: 'stable',
      stockPercentage: 0,
      newCustomers: 24,
      customersTrend: 'up',
      customersPercentage: 8.3,
    },
    recentActivities: [
      {
        id: 1,
        type: 'sale',
        description: 'Venta realizada a Cliente ABC',
        timestamp: new Date().toISOString(),
        status: 'success',
      },
      {
        id: 2,
        type: 'order',
        description: 'Nuevo pedido #12345',
        timestamp: new Date().toISOString(),
        status: 'warning',
      },
      {
        id: 3,
        type: 'product',
        description: 'Producto actualizado: Laptop Dell',
        timestamp: new Date().toISOString(),
        status: 'info',
      },
    ],
    systemAlerts: [
      {
        id: 1,
        type: 'warning',
        title: 'Stock bajo',
        message: 'Se acaban los productos en inventario',
        timestamp: new Date().toISOString(),
      },
      ],
    };

  /**
   * Hook personalizado para manejar los datos del dashboard
   * Maneja loading, error y actualización de datos
   */
  export function useDashboardData(initialFilters?: DashboardFilters) {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<DashboardFilters>(
      initialFilters || { dateRange: 'week' }
    );

    // Función para cargar datos
    const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(mockData);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar datos cuando cambian los filtros
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Función para refrescar datos manualmente
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