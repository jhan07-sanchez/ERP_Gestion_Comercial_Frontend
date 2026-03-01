/**
 * API del submódulo Historial de Cambios.
 */

import axiosInstance from '@/api/axios';
import type {
  LogAuditoriaDetail,
  LogAuditoriaFilters,
  PaginatedLogsResponse,
} from '../types';

const API_BASE = '/auditorias/logs';

export const historialCambiosAPI = {
  getLogs: async (
    filters?: LogAuditoriaFilters,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedLogsResponse> => {
    const params = new URLSearchParams();
    if (filters?.modulo) params.append('modulo', filters.modulo);
    if (filters?.accion) params.append('accion', filters.accion);
    if (filters?.nivel) params.append('nivel', filters.nivel);
    if (filters?.exitoso !== undefined)
      params.append('exitoso', String(filters.exitoso));
    if (filters?.usuario !== undefined)
      params.append('usuario', String(filters.usuario));
    if (filters?.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
    if (filters?.fecha_fin) params.append('fecha_fin', filters.fecha_fin);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.ordering) params.append('ordering', filters.ordering);
    params.append('page', String(page));
    params.append('page_size', String(pageSize));

    const response = await axiosInstance.get<PaginatedLogsResponse>(
      `${API_BASE}/`,
      { params }
    );
    return response.data;
  },

  getLogDetail: async (id: number): Promise<LogAuditoriaDetail> => {
    const response = await axiosInstance.get<LogAuditoriaDetail>(
      `${API_BASE}/${id}/`
    );
    return response.data;
  },
};
