// modules/inventario/api/productos.api.ts
import axiosInstance from '@/api/axios';
import type {
  Producto,
  ProductoList,
  ProductoCreateInput,
  ProductoUpdateInput,
  ProductoFilters,
  PaginatedResponse,
  AjusteInventario,
  MovimientoInventario,
} from '../types';

const API_BASE = '/inventario/productos';

export const productosAPI = {
  getProductos: async (
    filters?: ProductoFilters,
    page = 1
  ): Promise<PaginatedResponse<ProductoList>> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.categoria_id) params.append('categoria_id', String(filters.categoria_id));
    if (filters?.estado !== undefined) params.append('estado', String(filters.estado));
    if (filters?.precio_min) params.append('precio_min', String(filters.precio_min));
    if (filters?.precio_max) params.append('precio_max', String(filters.precio_max));
    params.append('page', String(page));

    const response = await axiosInstance.get(`${API_BASE}/`, { params });
    return response.data;
  },

  getProducto: async (id: number): Promise<Producto> => {
    const response = await axiosInstance.get(`${API_BASE}/${id}/`);
    return response.data;
  },

  createProducto: async (data: ProductoCreateInput): Promise<Producto> => {
    const response = await axiosInstance.post(`${API_BASE}/`, data);
    return response.data;
  },

  updateProducto: async (id: number, data: ProductoUpdateInput): Promise<Producto> => {
    const response = await axiosInstance.patch(`${API_BASE}/${id}/`, data);
    return response.data;
  },

  deleteProducto: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE}/${id}/`);
  },

  activarProducto: async (id: number) => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/activar/`);
    return response.data;
  },

  desactivarProducto: async (id: number) => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/desactivar/`);
    return response.data;
  },

  ajustarStock: async (id: number, data: AjusteInventario) => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/ajustar_stock/`, data);
    return response.data;
  },

  getMovimientosProducto: async (id: number) => {
    const response = await axiosInstance.get(`${API_BASE}/${id}/movimientos/`);
    return response.data as {
      movimientos: MovimientoInventario[];
    };
  },
};
