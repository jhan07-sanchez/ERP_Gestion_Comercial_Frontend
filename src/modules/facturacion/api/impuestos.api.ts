import axiosInstance from "@/shared/api/axios";
import type { PaginatedResponse } from "@/shared/types";

export interface Impuesto {
  id: number;
  nombre: string;
  porcentaje: string;
  activo: boolean;
}

const API_BASE = "/facturacion/impuestos";

export const impuestosAPI = {
  getImpuestos: async (params?: { activo?: boolean; search?: string }): Promise<PaginatedResponse<Impuesto>> => {
    const response = await axiosInstance.get(`${API_BASE}/`, { params });
    return response.data;
  },
  createImpuesto: async (data: Omit<Impuesto, "id">): Promise<Impuesto> => {
    const response = await axiosInstance.post(`${API_BASE}/`, data);
    return response.data;
  },
};
