/**
 * 🌐 API DEL MÓDULO VENTAS
 * Mismo patrón que compras.api.ts
 */

import axiosInstance from "@/api/axios";
import type {
  VentaList,
  VentaDetail,
  VentaCreateInput,
  VentaUpdateInput,
  VentaFilters,
  PaginatedResponse,
  ProductoParaVenta,
  ClienteParaVenta,
} from "../types/venta.types";

const API_BASE = "/ventas/ventas";

export const ventasAPI = {
  // ─────────────────────────────────
  // CRUD principal
  // ─────────────────────────────────

  getVentas: async (
    filters?: VentaFilters,
    page = 1,
  ): Promise<PaginatedResponse<VentaList>> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.estado) params.append("estado", filters.estado);
    if (filters?.cliente_id)
      params.append("cliente_id", String(filters.cliente_id));
    if (filters?.usuario_id)
      params.append("usuario_id", String(filters.usuario_id));
    if (filters?.fecha_inicio)
      params.append("fecha_inicio", filters.fecha_inicio);
    if (filters?.fecha_fin) params.append("fecha_fin", filters.fecha_fin);
    params.append("page", String(page));

    const response = await axiosInstance.get(`${API_BASE}/`, { params });
    return response.data;
  },

  getVenta: async (id: number): Promise<VentaDetail> => {
    const response = await axiosInstance.get(`${API_BASE}/${id}/`);
    return response.data;
  },

  createVenta: async (
    data: VentaCreateInput,
  ): Promise<{ detail: string; venta: VentaList }> => {
    const response = await axiosInstance.post(`${API_BASE}/`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  updateVenta: async (
    id: number,
    data: VentaUpdateInput,
  ): Promise<VentaList> => {
    const response = await axiosInstance.patch(`${API_BASE}/${id}/`, data);
    return response.data;
  },

  deleteVenta: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE}/${id}/`);
  },

  // ─────────────────────────────────
  // Acciones especiales
  // ─────────────────────────────────

  completarVenta: async (
    id: number,
  ): Promise<{ detail: string; venta: VentaList }> => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/completar/`);
    return response.data;
  },

  cancelarVenta: async (
    id: number,
    motivo: string) => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/cancelar/`, {
      motivo,
    });
    return response.data;
  },

  // ─────────────────────────────────
  // Estadísticas y resumen
  // ─────────────────────────────────

  getResumen: async (fechaInicio?: string, fechaFin?: string) => {
    const params = new URLSearchParams();
    if (fechaInicio) params.append("fecha_inicio", fechaInicio);
    if (fechaFin) params.append("fecha_fin", fechaFin);
    const response = await axiosInstance.get(`${API_BASE}/resumen/`, {
      params,
    });
    return response.data;
  },

  getVentasPendientes: async () => {
    const response = await axiosInstance.get(`${API_BASE}/pendientes/`);
    return response.data;
  },

  getVentasCompletadas: async (fechaInicio?: string, fechaFin?: string) => {
    const params = new URLSearchParams();
    if (fechaInicio) params.append("fecha_inicio", fechaInicio);
    if (fechaFin) params.append("fecha_fin", fechaFin);
    const response = await axiosInstance.get(`${API_BASE}/completadas/`, {
      params,
    });
    return response.data;
  },
};

// ─────────────────────────────────────────
// API de clientes para búsqueda en formulario
// ─────────────────────────────────────────

export const clientesVentaAPI = {
  buscarClientes: async (search: string): Promise<ClienteParaVenta[]> => {
    const params = new URLSearchParams({ search });
    const response = await axiosInstance.get("/clientes/", { params });
    return Array.isArray(response.data)
      ? response.data
      : (response.data.results ?? []);
  },
};

// ─────────────────────────────────────────
// API de productos para búsqueda en formulario
// ─────────────────────────────────────────

export const productosVentaAPI = {
  buscarProductos: async (search: string): Promise<ProductoParaVenta[]> => {
    const params = new URLSearchParams({ search });
    const response = await axiosInstance.get("/inventario/productos/", {
      params,
    });
    const results = Array.isArray(response.data)
      ? response.data
      : (response.data.results ?? []);

    return results.map(
      (p: {
        id: number;
        codigo: string;
        nombre: string;
        precio_venta: number;
        inventario?: { stock_actual: number };
        stock_actual?: number;
      }) => ({
        id: p.id,
        codigo: p.codigo,
        nombre: p.nombre,
        precio_venta: p.precio_venta,
        stock_actual: p.inventario?.stock_actual ?? p.stock_actual ?? 0,
      }),
    );
  },
};
