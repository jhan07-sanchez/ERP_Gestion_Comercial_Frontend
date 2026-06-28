import axiosInstance from "@/shared/api/axios";

import type { PaginatedResponse } from "@/shared/types";
import type {
  FacturaList,
  FacturaDetail,
  FacturaCreateInput,
  FacturaUpdateInput,
  FacturaFilters,
  AnularFacturaInput,
  RegistrarPagoInput,
  PagoFactura,
  ClienteParaFactura,
  ProductoParaFactura,
} from "../types";

const API_BASE = "/facturacion/facturas";

export const facturasVentaAPI = {
  getFacturas: async (
    params?: FacturaFilters & { page?: number; page_size?: number }
  ): Promise<PaginatedResponse<FacturaList>> => {
    const response = await axiosInstance.get(`${API_BASE}/`, { params });
    return response.data;
  },

  getFacturaById: async (id: number): Promise<FacturaDetail> => {
    const response = await axiosInstance.get(`${API_BASE}/${id}/`);
    return response.data;
  },

  createFactura: async (data: FacturaCreateInput): Promise<FacturaDetail> => {
    const response = await axiosInstance.post(`${API_BASE}/`, data);
    return response.data;
  },

  updateFactura: async (id: number, data: FacturaUpdateInput): Promise<FacturaDetail> => {
    const response = await axiosInstance.patch(`${API_BASE}/${id}/`, data);
    return response.data;
  },

  deleteFactura: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE}/${id}/`);
  },

  emitirFactura: async (id: number): Promise<{ status: string; numero: string }> => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/emitir/`);
    return response.data;
  },

  anularFactura: async (id: number, data: AnularFacturaInput): Promise<{ status: string }> => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/anular/`, data);
    return response.data;
  },

  registrarPago: async (id: number, data: RegistrarPagoInput): Promise<PagoFactura> => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/registrar_pago/`, data);
    return response.data;
  },

  enviarPorEmail: async (id: number): Promise<{ message: string }> => {
    const response = await axiosInstance.post(`${API_BASE}/${id}/enviar_email/`);
    return response.data;
  },

  descargarPDF: async (id: number): Promise<Blob> => {
    const response = await axiosInstance.get(`${API_BASE}/${id}/descargar_pdf/`, {
      responseType: "blob",
    });
    return response.data;
  },
};

// ─────────────────────────────────────────
// API de búsqueda para formulario
// ─────────────────────────────────────────

export interface ProductoApiResponse {
  id: number;
  codigo: string;
  nombre: string;
  precio_venta: number;
  stock_actual?: number;
  inventario?: { stock_actual?: number };
}

export const clientesFacturacionAPI = {
  buscarClientes: async (search: string): Promise<ClienteParaFactura[]> => {
    const params = new URLSearchParams({ search });
    const response = await axiosInstance.get("/clientes/", { params });
    return Array.isArray(response.data)
      ? response.data
      : (response.data.results ?? []);
  },
};

export const productosFacturacionAPI = {
  buscarProductos: async (search: string): Promise<ProductoParaFactura[]> => {
    const params = new URLSearchParams({ search });
    const response = await axiosInstance.get("/productos/productos", {
      params,
    });
    const results = Array.isArray(response.data)
      ? response.data
      : (response.data.results ?? []);

    return results.map((p: unknown) => {
      const prod = p as ProductoApiResponse;
      return {
        id: prod.id,
        codigo: prod.codigo,
        nombre: prod.nombre,
        precio_venta: prod.precio_venta,
        stock_actual: prod.inventario?.stock_actual ?? prod.stock_actual ?? 0,
      };
    });
  },
};


