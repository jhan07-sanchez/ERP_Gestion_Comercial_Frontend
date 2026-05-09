import type {
  ReportFilterOptions,
  BalanceGeneralData,
  EstadoResultadosData,
  FlujoCajaData,
  ProductividadData,
  ProyeccionData,
} from "../types/reportes.types";
import type { AnalyticsData } from "../types/analytics.types";
import axiosInstance from "@/shared/api/axios";

export interface AnalyticsFilters {
  rango: "7d" | "30d" | "90d" | "ytd";
  sucursal?: number;
  caja?: number;
  vendedor?: number;
}

export const reportesAPI = {
  getAnalyticsData: async (filtros: AnalyticsFilters): Promise<AnalyticsData> => {
    const response = await axiosInstance.get("/dashboard/analytics/", {
      params: filtros,
    });
    return response.data.data;
  },

  getEstadoResultados: async (filtros?: ReportFilterOptions): Promise<EstadoResultadosData> => {
    const response = await axiosInstance.get("/reportes/financieros/estado-resultados/", { params: filtros });
    return response.data.data;
  },

  getBalanceGeneral: async (): Promise<BalanceGeneralData> => {
    const response = await axiosInstance.get("/reportes/financieros/balance-general/");
    return response.data.data;
  },

  getFlujoCaja: async (filtros?: ReportFilterOptions): Promise<FlujoCajaData> => {
    const response = await axiosInstance.get("/reportes/financieros/flujo-caja/", { params: filtros });
    return response.data.data;
  },

  getProductividad: async (filtros?: ReportFilterOptions): Promise<ProductividadData[]> => {
    const response = await axiosInstance.get("/reportes/operativos/productividad/", { params: filtros });
    return response.data.data;
  },

  getProyecciones: async (): Promise<ProyeccionData> => {
    const response = await axiosInstance.get("/reportes/analiticos/proyecciones/");
    return response.data.data;
  },
};
