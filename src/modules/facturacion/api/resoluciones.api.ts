import axiosInstance from "@/shared/api/axios";
import type { PaginatedResponse } from "@/shared/types";

export interface ResolucionFacturacion {
  id: number;
  prefijo: string | null;
  numero_resolucion: string;
  rango_inicial: number;
  rango_final: number;
  consecutivo_actual: number;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
}

const API_BASE = "/facturacion/resoluciones";

export const resolucionesAPI = {
  getResoluciones: async (params?: { activa?: boolean; search?: string }): Promise<PaginatedResponse<ResolucionFacturacion>> => {
    const response = await axiosInstance.get(`${API_BASE}/`, { params });
    return response.data;
  },
  createResolucion: async (data: Omit<ResolucionFacturacion, "id">): Promise<ResolucionFacturacion> => {
    const response = await axiosInstance.post(`${API_BASE}/`, data);
    return response.data;
  },
};
