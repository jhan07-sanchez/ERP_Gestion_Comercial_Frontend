import axiosInstance from "@/shared/api/axios";
import type { PaginatedResponse } from "@/shared/types";
import type { 
    NotaDebito, 
    NotaDebitoCreate, 
    NotasDebitoFilters, 
    AnularNotaDebitoPayload 
} from "../types/notaDebito.types";

export const notasDebitoAPI = {
  getNotas: async (params?: NotasDebitoFilters): Promise<PaginatedResponse<NotaDebito>> => {
    const response = await axiosInstance.get("/facturacion/notas-debito/", { params });
    return response.data;
  },

  getNotaById: async (id: number): Promise<NotaDebito> => {
    const response = await axiosInstance.get(`/facturacion/notas-debito/${id}/`);
    return response.data;
  },

  createNota: async (data: NotaDebitoCreate): Promise<NotaDebito> => {
    const response = await axiosInstance.post("/facturacion/notas-debito/", data);
    return response.data;
  },

  emitirNota: async (id: number): Promise<{ status: string; numero: string }> => {
    const response = await axiosInstance.post(`/facturacion/notas-debito/${id}/emitir/`);
    return response.data;
  },

  anularNota: async (id: number, data: AnularNotaDebitoPayload): Promise<{ status: string }> => {
    const response = await axiosInstance.post(`/facturacion/notas-debito/${id}/anular/`, data);
    return response.data;
  },
};
