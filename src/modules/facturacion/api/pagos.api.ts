import axiosInstance from "@/shared/api/axios";
import type { PaginatedResponse } from "@/shared/types";

export interface PagoFacturaDetail {
  id: number;
  factura: number;
  metodo_pago: number;
  metodo_pago_nombre: string;
  monto: number;
  referencia: string | null;
  observaciones: string | null;
  fecha: string;
  registrado_por: number;
  registrado_por_nombre: string;
}

export interface PagosFilters {
  search?: string;
  factura__estado?: string;
  metodo_pago?: number;
  ordering?: string;
}

const API_BASE = "/facturacion/pagos";

export const pagosFacturacionAPI = {
  getPagos: async (
    params?: PagosFilters & { page?: number; page_size?: number }
  ): Promise<PaginatedResponse<PagoFacturaDetail>> => {
    const response = await axiosInstance.get(`${API_BASE}/`, { params });
    return response.data;
  },

  getPagoById: async (id: number): Promise<PagoFacturaDetail> => {
    const response = await axiosInstance.get(`${API_BASE}/${id}/`);
    return response.data;
  },
};
