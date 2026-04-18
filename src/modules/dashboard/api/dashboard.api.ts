// src/modules/dashboard/api/dashboard.api.ts

import axiosInstance from "@/shared/api/axios";
import type {
  DashboardData,
  KPIStats,
  SystemAlert,
  RecentActivity,
  CashStats,
  BackendResumen,
  BackendVentaDiaria,
  BackendProductoTop,
  BackendAlertas,
  BackendActividad,
  SalesDataPoint,
  ProductDataPoint,
  CashFlowPoint,
} from "../types";

const DASHBOARD_BASE = "/dashboard";
const CAJA_BASE = "/caja";

export const dashboardAPI = {
  /**
   * Obtiene los KPIs de las tarjetas principales
   */
  getResumen: async (): Promise<KPIStats> => {
    const response = await axiosInstance.get(`${DASHBOARD_BASE}/resumen/`);
    const raw: BackendResumen = response.data.data;

    return {
      totalSales: raw.ventas_mes.total,
      salesComparison: {
        value: 0, // El backend no envía el valor neto de la variación, solo el %
        percentage: raw.ventas_mes.variacion,
        trend: raw.ventas_mes.variacion >= 0 ? "up" : "down",
        label: "vs mes anterior"
      },
      salesTarget: 50000, // Meta fija o configurable en UI

      newCustomers: raw.clientes_nuevos.total,
      customersComparison: {
        value: 0,
        percentage: raw.clientes_nuevos.variacion,
        trend: raw.clientes_nuevos.variacion >= 0 ? "up" : "down",
        label: "vs mes anterior"
      },
      customersTarget: 30,

      pendingOrders: 0, // Calculado desde alertas si es necesario
      ordersComparison: {
        value: 0,
        percentage: 0,
        trend: "stable",
        label: "al día"
      },

      lowStockProducts: raw.alertas_stock,
      stockTrend: raw.alertas_stock > 10 ? "down" : "stable",
      criticalStockCount: 0 // Se obtiene de alertas
    };
  },

  /**
   * Obtiene datos para el gráfico de ventas
   */
  getGraficoVentas: async (periodo = 'semana'): Promise<SalesDataPoint[]> => {
    const response = await axiosInstance.get(`${DASHBOARD_BASE}/graficos/ventas/`, {
      params: { periodo, agrupacion: 'dia' }
    });
    const raw: BackendVentaDiaria[] = response.data.data;

    return raw.map(item => ({
      name: new Date(item.fecha).toLocaleDateString('es-ES', { weekday: 'short' }),
      ventas: item.total
    }));
  },

  /**
   * Obtiene el ranking de mejores productos
   */
  getProductosTop: async (limite = 5): Promise<ProductDataPoint[]> => {
    const response = await axiosInstance.get(`${DASHBOARD_BASE}/top/productos/`, {
      params: { limite }
    });
    const raw: BackendProductoTop[] = response.data.data;

    return raw.map(item => ({
      name: item.nombre,
      cantidad: item.total_unidades // Se mapea desde total_unidades
    }));
  },

  /**
   * Obtiene alertas del sistema (Stock, Ventas)
   */
  getAlertas: async (): Promise<SystemAlert[]> => {
    const response = await axiosInstance.get(`${DASHBOARD_BASE}/alertas/`);
    const raw: BackendAlertas = response.data.data;

    const alerts: SystemAlert[] = [];

    // Mapear alertas de falta de stock
    raw.sin_stock?.forEach((item, idx) => {
      alerts.push({
        id: item.producto_id || idx,
        severidad: "critica",
        title: "Stock Agotado",
        message: item.mensaje,
        timestamp: item.timestamp,
        type: 'product',
        actionable: true
      });
    });

    // Mapear alertas de stock crítico (bajo)
    raw.stock_critico?.forEach((item, idx) => {
      alerts.push({
        id: item.producto_id || (idx + 100),
        severidad: "critica",
        title: "Stock Crítico",
        message: item.mensaje,
        timestamp: item.timestamp,
        type: 'product',
        actionable: true
      });
    });

    // Mapear alertas de advertencia (próximo a agotarse)
    raw.stock_advertencia?.forEach((item, idx) => {
      alerts.push({
        id: item.producto_id || (idx + 200),
        severidad: "advertencia",
        title: "Stock Bajo",
        message: item.mensaje,
        timestamp: item.timestamp,
        type: 'product',
        actionable: true
      });
    });

    // Mapear ventas pendientes
    raw.ventas_pendientes?.forEach((item, idx) => {
      alerts.push({
        id: item.venta_id || (idx + 300),
        severidad: "media",
        title: "Venta Pendiente",
        message: item.mensaje,
        timestamp: item.timestamp,
        type: 'sale',
        actionable: true
      });
    });

    return alerts;
  },

  /**
   * Obtiene actividad reciente
   */
  getActividad: async (limite = 10): Promise<RecentActivity[]> => {
    const response = await axiosInstance.get(`${DASHBOARD_BASE}/actividad/`, {
      params: { limite }
    });
    const raw: BackendActividad[] = response.data.data;

    return raw.map(item => ({
      id: item.id,
      // El backend envía el nombre del módulo en 'type' (ej: 'VENTAS')
      type: item.type?.toLowerCase().includes('vent') ? 'sale' : 'order',
      descripcion: item.descripcion,
      usuario: item.usuario,
      modulo: item.type, // Usamos type como nombre del módulo
      timestamp: item.timestamp,
      fecha: new Date(item.timestamp).toLocaleDateString(),
      estado: item.estado
    }));
  },

  /**
   * Obtiene estado de caja
   */
  getCajaStats: async (): Promise<CashStats> => {
    // IMPORTANTE: El backend de caja devuelve el objeto directamente, no usa el wrapper extra 'data'
    // Además, el ViewSet mi-sesion tiene un wrapper { sesion_activa, data }
    const [resumenResp, miSesionResp] = await Promise.all([
      axiosInstance.get(`${CAJA_BASE}/sesiones/resumen-hoy/`).catch(() => ({ data: { total_ingresos: 0, total_egresos: 0, saldo_neto: 0 } })),
      axiosInstance.get(`${CAJA_BASE}/sesiones/mi-sesion/`).catch(() => ({ data: { data: null } }))
    ]);

    const resumen = resumenResp.data; // Aquí no hay .data.data adicional
    const miSesion = miSesionResp.data?.data; 

    return {
      balanceActual: miSesion ? Number(miSesion.saldo_esperado) : (resumen.saldo_neto || 0),
      ingresosDia: miSesion ? Number(miSesion.total_ingresos) : (resumen.total_ingresos || 0),
      egresosDia: miSesion ? Number(miSesion.total_egresos) : (resumen.total_egresos || 0),
      estado: (miSesionResp.data?.sesion_activa || miSesion) ? 'abierta' : 'cerrada',
      ultimaApertura: miSesion?.fecha_apertura || new Date().toISOString()
    };
  },

  /**
   * Obtiene datos para el gráfico de flujo de caja
   */
  getGraficoCaja: async (periodo = 'dia'): Promise<CashFlowPoint[]> => {
    const response = await axiosInstance.get(`${DASHBOARD_BASE}/graficos/caja/`, {
      params: { periodo }
    });
    return response.data.data;
  },

  /**
   * Obtiene todos los datos en paralelo para el montaje inicial
   */
  getDashboardData: async (): Promise<DashboardData> => {
    const results = await Promise.allSettled([
      dashboardAPI.getResumen(),
      dashboardAPI.getGraficoVentas(),
      dashboardAPI.getProductosTop(),
      dashboardAPI.getAlertas(),
      dashboardAPI.getActividad(),
      dashboardAPI.getCajaStats(),
      dashboardAPI.getGraficoCaja(),
    ]);

    const getValue = <T>(index: number, fallback: T): T => {
      const res = results[index];
      return res.status === 'fulfilled' ? (res.value as T) : fallback;
    };

    const kpis: KPIStats = getValue<KPIStats>(0, {
      totalSales: 0,
      salesComparison: { value: 0, percentage: 0, trend: 'stable', label: 'Sin datos' },
      salesTarget: 1,
      newCustomers: 0,
      customersComparison: { value: 0, percentage: 0, trend: 'stable', label: 'Sin datos' },
      customersTarget: 1,
      pendingOrders: 0,
      ordersComparison: { value: 0, percentage: 0, trend: 'stable', label: 'Sin datos' },
      lowStockProducts: 0,
      stockTrend: 'stable',
      criticalStockCount: 0
    });

    const alerts = getValue<SystemAlert[]>(3, []);

    // Enriquecer KPIs con datos de alertas
    kpis.criticalStockCount = alerts.filter(a => a.title === "Stock Agotado").length;
    kpis.pendingOrders = alerts.filter(a => a.type === "sale").length;

    return {
      kpis,
      charts: {
        salesHistory: getValue(1, []),
        topProducts: getValue(2, []),
        cashFlow: getValue(6, []) // Índice 6 ahora es el flujo de caja
      },
      systemAlerts: alerts,
      recentActivities: getValue(4, []),
      cash: getValue<CashStats>(5, {
        balanceActual: 0,
        ingresosDia: 0,
        egresosDia: 0,
        estado: 'cerrada',
        ultimaApertura: new Date().toISOString()
      }),
    };
  }
};


