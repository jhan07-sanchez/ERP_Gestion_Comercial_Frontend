/**
 * 🌐 API DEL MÓDULO CLIENTES
 * Mismo patrón que ventas.api.ts
 */

import axiosInstance from "@/shared/api/axios";

import type {
  ClienteList,
  ClienteDetail,
  ClienteCreateInput,
  ClienteUpdateInput,
  ClienteFilters,
  PaginatedResponse,
} from "../types/cliente.types";

const API_BASE = "/clientes";

export const clientesAPI = {
  // ─────────────────────────────────
  // CRUD principal
  // ─────────────────────────────────

  getClientes: async (
    filters?: ClienteFilters,
    page = 1,
  ): Promise<PaginatedResponse<ClienteList>> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);

    if (filters?.nombre) params.append("nombre", filters.nombre);

    if (filters?.numero_documento) params.append("numero_documento", filters.numero_documento);

    if (filters?.estado !== undefined)
      params.append("estado", String(filters.estado));

    params.append("page", String(page));

    const response = await axiosInstance.get(`${API_BASE}/`, { params });

    return response.data;
  },

  getCliente: async (id: number): Promise<ClienteDetail> => {
    const response = await axiosInstance.get(`${API_BASE}/${id}/`);

    return response.data;
  },

  createCliente: async (
    data: ClienteCreateInput,
  ): Promise<{ detail: string; cliente: ClienteDetail }> => {
    const response = await axiosInstance.post(`${API_BASE}/`, data, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  },

  updateCliente: async (
    id: number,
    data: ClienteUpdateInput,
  ): Promise<ClienteDetail> => {
    const response = await axiosInstance.patch(`${API_BASE}/${id}/`, data);

    return response.data;
  },

  deleteCliente: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE}/${id}/`);
  },

  // ─────────────────────────────────
  // Acciones especiales
  // ─────────────────────────────────

  activarCliente: async (
    id: number,
  ): Promise<{ detail: string; cliente: ClienteDetail }> => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/activar/`);

    return response.data;
  },

  desactivarCliente: async (
    id: number,
  ): Promise<{ detail: string; cliente: ClienteDetail }> => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/desactivar/`);

    return response.data;
  },

  // ─────────────────────────────────
  // Estadísticas
  // ─────────────────────────────────

  getEstadisticas: async () => {
    const response = await axiosInstance.get(`${API_BASE}/estadisticas/`);

    return response.data;
  },
};
