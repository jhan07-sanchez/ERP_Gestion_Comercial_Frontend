import axiosInstance from "@/api/axios";
import type {
  Compra,
  CompraList,
  CompraCreateInput,
  CompraUpdateInput,
  CompraFilters,
  PaginatedResponse,
  CompraDetail,
} from "../types";

const API_BASE = "/compras";

export const comprasAPI = {
  getCompras: async (
    filters?: CompraFilters,
    page = 1,
  ): Promise<PaginatedResponse<CompraList>> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.proveedor_id)
      params.append("proveedor_id", String(filters.proveedor_id));
    if (filters?.estado !== undefined)
      params.append("estado", String(filters.estado));

    if (filters?.fecha_inicio)
      params.append("fecha_inicio", filters.fecha_inicio);
    if (filters?.fecha_fin) params.append("fecha_fin", filters.fecha_fin);

    params.append("page", String(page));

    const response = await axiosInstance.get(`${API_BASE}/`, { params });
    return response.data;
  },

  getCompra: async (id: number): Promise<CompraDetail> => {
    const response = await axiosInstance.get(`${API_BASE}/${id}/`);
    return response.data;
  },

  createCompra: async (data: CompraCreateInput): Promise<Compra> => {
    const response = await axiosInstance.post(`${API_BASE}/`, data);
    return response.data;
  },

  updateCompra: async (
    id: number,
    data: CompraUpdateInput,
  ): Promise<Compra> => {
    const response = await axiosInstance.patch(`${API_BASE}/${id}/`, data);
    return response.data;
  },

  deleteCompra: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE}/${id}/`);
  },

  confirmarCompra: async (id: number) => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/confirmar/`);
    return response.data;
  },

  anularCompra: async (id: number) => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/anular/`);
    return response.data;
  },
};
