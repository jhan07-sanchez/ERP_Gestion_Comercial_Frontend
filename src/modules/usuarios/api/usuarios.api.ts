// src/modules/usuarios/api/usuarios.api.ts
/**
 * 👥 USUARIOS SERVICE
 */

import axiosInstance from '@/shared/api/axios';

export const usuariosAPI = {
    getAll: async (params?: Record<string, string>) => {
        const response = await axiosInstance.get('/usuarios/', { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await axiosInstance.get(`/usuarios/${id}/`);
        return response.data;
    },

    create: async (data: Record<string, unknown>) => {
        const response = await axiosInstance.post('/usuarios/', data);
        return response.data;
    },

    update: async (id: number, data: Record<string, unknown>) => {
        const response = await axiosInstance.patch(`/usuarios/${id}/`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/usuarios/${id}/`);
        return response.data;
    },

    changePassword: async (id: number, data: {
        old_password: string;
        new_password: string;
        new_password2: string;
    }) => {
        const response = await axiosInstance.post(`/usuarios/${id}/change_password/`, data);
        return response.data;
    },
};

/**
 * 🏷️ ROLES SERVICE
 */
export const rolesAPI = {
    getAll: async () => {
        const response = await axiosInstance.get('/roles/');
        return response.data;
    },

    create: async (data: { nombre: string; descripcion?: string }) => {
        const response = await axiosInstance.post('/roles/', data);
        return response.data;
    },
};
