import axiosInstance from "@/shared/api/axios";
import type { Categoria } from "../types";

const API_BASE = "/categorias/categorias";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const categoriasAPI = {
  getCategorias: async (): Promise<Categoria[]> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Categoria>>(
      `${API_BASE}/`,
    );

    return data.results; // 🔥 ESTA ES LA CLAVE
  },

  getCategoria: async (id: number): Promise<Categoria> => {
    const { data } = await axiosInstance.get<Categoria>(`${API_BASE}/${id}/`);
    return data;
  },

  createCategoria: async (
    categoria: Partial<Categoria>,
  ): Promise<Categoria> => {
    const { data } = await axiosInstance.post<Categoria>(
      `${API_BASE}/`,
      categoria,
    );
    return data;
  },

  updateCategoria: async (
    id: number,
    categoria: Partial<Categoria>,
  ): Promise<Categoria> => {
    const { data } = await axiosInstance.put<Categoria>(
      `${API_BASE}/${id}/`,
      categoria,
    );
    return data;
  },

  deleteCategoria: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE}/${id}/`);
  },
};
