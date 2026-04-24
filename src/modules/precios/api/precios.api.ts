import axiosInstance from "@/shared/api/axios";
import type { 
  PrecioFilters,
  PrecioList,
  PrecioDetail,
  PrecioCreateInput,
  PrecioUpdateInput,
  PaginatedResponse
} from "../types/precio.types";

export const preciosAPI = {
  getAll: async (params?: PrecioFilters): Promise<PaginatedResponse<PrecioList>> => {
    const response = await axiosInstance.get("/precios/precios/", { params });
    return response.data;
  },

  getById: async (id: number): Promise<PrecioDetail> => {
    const response = await axiosInstance.get(`/precios/precios/${id}/`);
    return response.data;
  },

  create: async (data: PrecioCreateInput): Promise<PrecioDetail> => {
    const response = await axiosInstance.post("/precios/precios/", data);
    return response.data;
  },

  update: async (id: number, data: PrecioUpdateInput): Promise<PrecioDetail> => {
    const response = await axiosInstance.patch(`/precios/precios/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/precios/precios/${id}/`);
  },

  getPrecioVigente: async (productoId: number, proveedorId: number): Promise<PrecioDetail | null> => {
    const response = await axiosInstance.get("/precios/precios/precio_vigente/", {
      params: {
        producto: productoId,
        proveedor: proveedorId,
      },
    });

    return response.data.precio === null ? null : response.data;
  },
};
