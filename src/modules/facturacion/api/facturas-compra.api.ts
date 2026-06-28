/**
 * 📦 API: Facturas de Compra
 *
 * Reutiliza el endpoint de compras (/compras/compras/)
 * Las "facturas de compra" en el ERP son las compras registradas.
 */

import axiosInstance from "@/shared/api/axios";
import type { PaginatedResponse } from "@/shared/types";
import type { FacturaCompraList, FacturaCompraFilters } from "../types/facturaCompra.types";

const API_BASE = "/compras/compras";

export const facturasCompraAPI = {
  getFacturasCompra: async (
    filters?: FacturaCompraFilters,
    page = 1,
  ): Promise<PaginatedResponse<FacturaCompraList>> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.estado) params.append("estado", filters.estado);
    if (filters?.proveedor_id)
      params.append("proveedor_id", String(filters.proveedor_id));
    if (filters?.fecha_inicio)
      params.append("fecha_inicio", filters.fecha_inicio);
    if (filters?.fecha_fin) params.append("fecha_fin", filters.fecha_fin);

    params.append("page", String(page));

    const response = await axiosInstance.get(`${API_BASE}/`, { params });
    return response.data;
  },

  anularFacturaCompra: async (
    id: number,
    motivo: string,
  ): Promise<{ status: string }> => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/anular/`, {
      motivo,
    });
    return response.data;
  },
};
