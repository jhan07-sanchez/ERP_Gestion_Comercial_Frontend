import type {
  MovimientoFinanciero,
  ReportFilterOptions,
  BalanceGeneralData,
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

  getEstadoResultados: async (
    filtros?: ReportFilterOptions,
  ): Promise<MovimientoFinanciero[]> => {
    const response = await axiosInstance.get("/dashboard/reportes/estado-resultados/", {
      params: filtros,
    });
    return response.data.data;
  },

  getBalanceGeneral: async (
    filtros?: ReportFilterOptions,
  ): Promise<BalanceGeneralData> => {
    const response = await axiosInstance.get("/dashboard/reportes/balance-general/", {
      params: filtros,
    });
    return response.data.data;
  },
};
