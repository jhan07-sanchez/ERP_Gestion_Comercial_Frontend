import axiosInstance from "@/shared/api/axios";
import type { PaginatedResponse } from "@/shared/types";
import type { EstadoFactura } from "../types/facturacion.types";

export interface NotaBase {
  id: number;
  factura: number;
  numero: string | null;
  motivo: string;
  subtotal: number;
  impuesto: number;
  total: number;
  estado: EstadoFactura;
  fecha_emision: string;
}

export interface NotaFiltros {
  search?: string;
  estado?: string;
  page?: number;
}

export const notasCreditoAPI = {
  getNotas: async (params?: NotaFiltros): Promise<PaginatedResponse<NotaBase>> => {
    const response = await axiosInstance.get("/facturacion/notas-credito/", { params });
    return response.data;
  },
};

export const notasDebitoAPI = {
  getNotas: async (params?: NotaFiltros): Promise<PaginatedResponse<NotaBase>> => {
    const response = await axiosInstance.get("/facturacion/notas-debito/", { params });
    return response.data;
  },
};
