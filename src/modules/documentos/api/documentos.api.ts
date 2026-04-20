/**
 * 🌐 API DEL MÓDULO DOCUMENTOS
 */

import axiosInstance from "@/shared/api/axios";
import type {
  DocumentoList,
  DocumentoDetail,
  DocumentoFilters,
  PaginatedResponse
} from "../types/documentos.types";


const API_BASE = "/documentos";

export const documentosAPI = {
  /** Obtener listado de documentos con filtros */
  getDocumentos: async (
    filters?: DocumentoFilters,
    page = 1
  ): Promise<PaginatedResponse<DocumentoList>> => {
    const params = new URLSearchParams();

    if (filters?.tipo) params.append("tipo", filters.tipo);
    if (filters?.venta_id) params.append("venta_id", String(filters.venta_id));
    if (filters?.compra_id) params.append("compra_id", String(filters.compra_id));
    if (filters?.search) params.append("search", filters.search);

    params.append("page", String(page));

    const response = await axiosInstance.get(`${API_BASE}/`, { params });
    return response.data;
  },

  /** Obtener detalle completo de un documento */
  getDocumento: async (id: number): Promise<DocumentoDetail> => {
    const response = await axiosInstance.get(`${API_BASE}/${id}/`);
    return response.data;
  },

  /** 
   * Descargar PDF de un documento.
   * Abre el archivo en una nueva pestaña o lo descarga según el navegador.
   */
  descargarPDF: async (id: number, filename: string): Promise<void> => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/${id}/pdf/`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Limpieza
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      throw error;
    }
  }
};
