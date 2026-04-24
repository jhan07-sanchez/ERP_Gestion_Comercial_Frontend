import axiosInstance from "@/shared/api/axios";
import type { PrecioFilters } from "../types/precio.types";

export const preciosAPI = {
  getAll: async (params?: PrecioFilters) => {
    const response = await axiosInstance.get("/precios/", { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get(`/precios/${id}/`);
    return response.data;
  },

  create: async (data: {
    producto: number;
    proveedor: number;
    precio: number;
    fecha_inicio?: string;
  }) => {
    const response = await axiosInstance.post("/precios/", data);
    return response.data;
  },

  update: async (
    id: number,
    data: {
      precio?: number;
      fecha_inicio?: string;
      fecha_fin?: string;
    },
  ) => {
    const response = await axiosInstance.patch(`/precios/${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/precios/${id}/`);
    return response.data;
  },

  getPrecioVigente: async (productoId: number, proveedorId: number) => {
    const response = await axiosInstance.get("/precios/", {
      params: {
        producto: productoId,
        proveedor: proveedorId,
        vigente: true,
      },
    });

    const results = response.data.results || response.data;

    return results.length > 0 ? results[0] : null;
  },
};
