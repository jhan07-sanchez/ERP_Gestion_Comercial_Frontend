/**
 * 🌐 API DEL MÓDULO CONFIGURACIÓN
 * Basado en apps/configuracion/urls.py
 */

import axiosInstance from "@/shared/api/axios";
import type {
    Configuracion,
    ConfiguracionResumen,
    ConfiguracionUpdateInput,
    ResetConsecutivoInput,
    CondicionPago,
    CondicionPagoInput,
} from "../types/configuracion.types";

const API_BASE = "/configuracion";

type PaginationResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type CondicionPagoCreateInput = Pick<CondicionPagoInput, 'nombre' | 'dias_plazo' | 'activo'>;

type CondicionPagoUpdateInput = Partial<CondicionPagoCreateInput>;

export const configuracionAPI = {
    /**
     * Obtiene la configuración completa (Solo autenticados)
     */
    getConfiguracion: async (): Promise<Configuracion> => {
        const response = await axiosInstance.get(`${API_BASE}/`);
        return response.data;
    },

    /**
     * Obtiene información básica de la empresa (Público/Autenticado)
     */
    getEmpresaInfo: async (): Promise<ConfiguracionResumen> => {
        const response = await axiosInstance.get(`${API_BASE}/empresa/`);
        return response.data;
    },

    /**
     * Actualiza la configuración (Solo Administrador)
     * Soporta envío de archivos (logo) vía FormData
     */
    updateConfiguracion: async (data: ConfiguracionUpdateInput): Promise<Configuracion> => {
        const hasFile = data.logo instanceof File;

        if (hasFile) {
            const formData = new FormData();

            // Añadir todos los campos al FormData
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'logo' && value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            const response = await axiosInstance.patch(`${API_BASE}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        }

        // Si no hay archivo, enviar como JSON normal (PATCH parcial)
        const response = await axiosInstance.patch(`${API_BASE}/`, data);
        return response.data;
    },

    /**
     * Resetea el consecutivo de un documento (Solo Administrador)
     */
    resetConsecutivo: async (data: ResetConsecutivoInput): Promise<{ mensaje: string; configuracion: Configuracion }> => {
        const response = await axiosInstance.post(`${API_BASE}/reset-consecutivo/`, data);
        return response.data;
    },

    // === CONDICIONES DE PAGO (CRUD) ===
    getCondicionesPago: async (): Promise<CondicionPago[]> => {
        const response = await axiosInstance.get<CondicionPago[] | PaginationResponse<CondicionPago>>(`${API_BASE}/condiciones-pago/`);
        const data = response.data;
        if (Array.isArray(data)) {
            return data;
        }
        return data.results || [];
    },

    createCondicionPago: async (data: CondicionPagoCreateInput): Promise<CondicionPago> => {
        const response = await axiosInstance.post(`${API_BASE}/condiciones-pago/`, data);
        return response.data;
    },

    updateCondicionPago: async (id: number, data: CondicionPagoUpdateInput): Promise<CondicionPago> => {
        const response = await axiosInstance.patch(`${API_BASE}/condiciones-pago/${id}/`, data);
        return response.data;
    },

    deleteCondicionPago: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${API_BASE}/condiciones-pago/${id}/`);
    },
};
