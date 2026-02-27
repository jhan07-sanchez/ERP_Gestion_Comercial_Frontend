import axiosInstance from "@/api/axios";
import type {
  MovimientoInventario,
  MovimientoInventarioCreateInput,
} from "../types";

const API_BASE = "/inventario/movimientos";

export const movimientosAPI = {
  getMovimientos: async (
    params?: Record<string, unknown>,
  ): Promise<MovimientoInventario[]> => {
    const { data } = await axiosInstance.get<MovimientoInventario[]>(
      `${API_BASE}/`,
      { params },
    );
    return data;
  },

  getMovimientosByProducto: async (
    productoId: number,
  ): Promise<MovimientoInventario[]> => {
    const { data } = await axiosInstance.get<MovimientoInventario[]>(
      `/productos/${productoId}/movimientos/`,
    );
    return data;
  },

  createMovimiento: async (
    movimiento: MovimientoInventarioCreateInput,
  ): Promise<MovimientoInventario> => {
    const { data } = await axiosInstance.post<MovimientoInventario>(
      `${API_BASE}/`,
      movimiento,
    );
    return data;
  },
};
