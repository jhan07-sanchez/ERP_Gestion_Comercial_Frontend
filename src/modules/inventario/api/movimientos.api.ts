// modules/inventario/api/movimientos.api.ts
import axiosInstance from '@/api/axios';
import type {
  MovimientoInventario,
  MovimientoInventarioCreateInput,
  PaginatedResponse,
} from '../types';

const API_BASE = '/inventario/movimientos';

export const movimientosAPI = {
  getMovimientos: async (filters?: {
    producto_id?: number;
    tipo?: string;
    referencia?: string;
    usuario_id?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
  }): Promise<PaginatedResponse<MovimientoInventario>> => {
    const params = new URLSearchParams();

    if (filters?.producto_id) params.append('producto_id', String(filters.producto_id));
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.referencia) params.append('referencia', filters.referencia);
    if (filters?.usuario_id) params.append('usuario_id', String(filters.usuario_id));
    if (filters?.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
    if (filters?.fecha_fin) params.append('fecha_fin', filters.fecha_fin);

    const response = await axiosInstance.get(`${API_BASE}/`, { params });
    return response.data;
  },

  createMovimiento: async (data: MovimientoInventarioCreateInput) => {
    const response = await axiosInstance.post(`${API_BASE}/`, data);
    return response.data;
  },

  getResumenMovimientos: async (filters?: {
    fecha_inicio?: string;
    fecha_fin?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
    if (filters?.fecha_fin) params.append('fecha_fin', filters.fecha_fin);

    const response = await axiosInstance.get(`${API_BASE}/resumen/`, { params });
    return response.data;
  },
};
