// src/modules/auditoria/services/auditoriaService.ts
import api from '@/shared/api/axios'; // Assuming there's a base axios instance
import type { AuditLog, AuditFilters, AuditStats } from '../types';

const BASE_URL = '/auditorias/logs/';

export const auditoriaService = {
    getLogs: async (filters: AuditFilters = {}) => {
        const response = await api.get<{ count: number; next: string; previous: string; results: AuditLog[] }>(
            BASE_URL,
            { params: filters }
        );
        return response.data;
    },

    getLogById: async (id: number) => {
        const response = await api.get<AuditLog>(`${BASE_URL}${id}/`);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get<{ success: boolean; data: AuditStats }>('/auditorias/estadisticas/');
        return response.data;
    },

    getMisLogs: async () => {
        const response = await api.get<{ success: boolean; count: number; data: AuditLog[] }>(`${BASE_URL}mis-logs/`);
        return response.data;
    },

    getLogsByObject: async (app: string, modelo: string, id: string | number) => {
        const response = await api.get<{ success: boolean; data: AuditLog[] }>(`${BASE_URL}por-objeto/`, {
            params: { app, modelo, id }
        });
        return response.data;
    },

    exportToCSV: async (filters: AuditFilters = {}) => {
        // Basic implementation for CSV export (if backend supports it, otherwise frontend side skip)
        // For now, let's assume we fetch all and process or call a special endpoint if exists
        const response = await api.get(BASE_URL, { params: { ...filters, page_size: 1000 }, responseType: 'blob' });
        return response.data;
    }
};
