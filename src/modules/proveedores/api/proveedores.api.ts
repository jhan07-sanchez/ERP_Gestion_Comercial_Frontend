import axiosInstance from "@/api/axios";
import type {
  Proveedor,
  ProveedorList,
  ProveedorCreateInput,
  ProveedorUpdateInput,
  ProveedorFilters,
  PaginatedResponse,
  ProveedorDetail,
} from "../types/proveedor.types";

const API_BASE = "/proveedores";

export const proveedoresAPI = {
  getProveedores: async (
    filters?: ProveedorFilters,
    page = 1,
  ): Promise<PaginatedResponse<ProveedorList>> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.documento) params.append("documento", filters.documento);
    if (filters?.estado !== undefined)
      params.append("estado", String(filters.estado));

    params.append("page", String(page));

    const response = await axiosInstance.get(`${API_BASE}/`, { params });
    return response.data;
  },

  getProveedor: async (id: number): Promise<ProveedorDetail> => {
    const response = await axiosInstance.get(`${API_BASE}/${id}/`);
    return response.data;
  },

  createProveedor: async (data: ProveedorCreateInput): Promise<Proveedor> => {
    const response = await axiosInstance.post(`${API_BASE}/`, data);
    return response.data;
  },

  updateProveedor: async (
    id: number,
    data: ProveedorUpdateInput,
  ): Promise<Proveedor> => {
    const response = await axiosInstance.patch(`${API_BASE}/${id}/`, data);
    return response.data;
  },

  deleteProveedor: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE}/${id}/`);
  },
};
