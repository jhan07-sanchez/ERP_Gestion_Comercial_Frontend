// modules/inventario/api/inventarios.api.ts
import axiosInstance from '@/api/axios';
import type { Inventario, ProductoList } from '../types';

const API_BASE = '/inventario/inventarios';

export const inventariosAPI = {
  getInventarios: async (filters?: {
    stock_bajo?: boolean;
    categoria?: string;
    solo_activos?: boolean;
  }): Promise<Inventario[]> => {
    const params = new URLSearchParams();

    if (filters?.stock_bajo) params.append('stock_bajo', 'true');
    if (filters?.categoria) params.append('categoria', filters.categoria);
    if (filters?.solo_activos) params.append('solo_activos', 'true');

    const response = await axiosInstance.get(`${API_BASE}/`, { params });
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  },

  getEstadisticasInventario: async () => {
    const response = await axiosInstance.get(`${API_BASE}/estadisticas/`);
    return response.data;
  },

   getProductosStockBajo: async (): Promise<ProductoList[]> => {
    const response = await axiosInstance.get(`${API_BASE}/stock_bajo/`);
    return response.data.productos ?? response.data;
  },
};
