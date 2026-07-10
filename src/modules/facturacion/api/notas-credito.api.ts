import axiosInstance from "@/shared/api/axios";
import type { PaginatedResponse } from "@/shared/types";
import type { 
    NotaCredito, 
    NotaCreditoCreate, 
    NotasCreditoFilters, 
    EmitirNotaCreditoPayload, 
    AnularNotaCreditoPayload 
} from "../types/notaCredito.types";

export const notasCreditoAPI = {
  getNotas: async (params?: NotasCreditoFilters): Promise<PaginatedResponse<NotaCredito>> => {
    const response = await axiosInstance.get("/facturacion/notas-credito/", { params });
    return response.data;
  },

  getNotaById: async (id: number): Promise<NotaCredito> => {
    const response = await axiosInstance.get(`/facturacion/notas-credito/${id}/`);
    return response.data;
  },

  createNota: async (data: NotaCreditoCreate): Promise<NotaCredito> => {
    const response = await axiosInstance.post("/facturacion/notas-credito/", data);
    return response.data;
  },

  emitirNota: async (id: number, data: EmitirNotaCreditoPayload): Promise<{ status: string; numero: string; tipo_aplicacion: string }> => {
    const response = await axiosInstance.post(`/facturacion/notas-credito/${id}/emitir/`, data);
    return response.data;
  },

  anularNota: async (id: number, data: AnularNotaCreditoPayload): Promise<{ status: string }> => {
    const response = await axiosInstance.post(`/facturacion/notas-credito/${id}/anular/`, data);
    return response.data;
  },
};
