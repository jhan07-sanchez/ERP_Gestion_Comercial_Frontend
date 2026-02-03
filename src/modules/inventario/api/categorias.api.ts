// modules/inventario/api/categorias.api.ts
import axiosInstance from '@/api/axios';
import type { Categoria } from '../types';

const API_BASE = '/inventario/categorias';

export const categoriasAPI = {
  getCategorias: async (): Promise<Categoria[]> => {
    const response = await axiosInstance.get(`${API_BASE}/`);
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  },

  getCategoria: async (id: number): Promise<Categoria> => {
    const response = await axiosInstance.get(`${API_BASE}/${id}/`);
    return response.data;
  },
};
