import axiosInstance from "@/shared/api/axios";
import type { Inventario, AjusteInventario } from "../types";

const API_BASE = "/inventario/inventarios";

export const inventariosAPI = {
  getInventarios: async (
    params?: Record<string, unknown>,
  ): Promise<Inventario[]> => {
    const { data } = await axiosInstance.get<Inventario[]>(`${API_BASE}/`, {
      params,
    });
    return data;
  },

  getInventarioByProducto: async (productoId: number): Promise<Inventario> => {
    const { data } = await axiosInstance.get<Inventario>(
      `${API_BASE}/por_producto/`,
      {
        params: { producto_id: productoId },
      },
    );
    return data;
  },

  ajustarStock: async (
    productoId: number,
    ajuste: AjusteInventario,
  ): Promise<Inventario> => {
    const { data } = await axiosInstance.post<Inventario>(
      `/productos/${productoId}/ajustar_stock/`, // La lógica de ajuste sigue en el endpoint de producto del backend
      ajuste,
    );
    return data;
  },
};
