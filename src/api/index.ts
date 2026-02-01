// src/api/index.ts
/**
 * 🌐 API SERVICE LAYER
 * 
 * Este archivo centraliza todas las llamadas al backend.
 * Cada módulo (usuarios, productos, ventas) tiene su propio servicio.
 * 
 * VENTAJAS:
 * - Código organizado y fácil de mantener
 * - Reutilización de funciones
 * - Tipado TypeScript completo
 * - Fácil testing
 */

import axiosInstance from './axios';

/**
 * 🔐 AUTH SERVICE
 * Funciones relacionadas con autenticación
 */
export const authAPI = {
  /**
   * Iniciar sesión
   * @param email - Email del usuario
   * @param password - Contraseña
   * @returns Token de acceso y refresh
   */
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post('/token/', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Registrar nuevo usuario
   */
  register: async (data: {
    username: string;
    email: string;
    password: string;
    password2: string;
  }) => {
    const response = await axiosInstance.post('/usuarios/', data);
    return response.data;
  },

  /**
   * Obtener información del usuario autenticado
   */
  getMe: async () => {
    const response = await axiosInstance.get('/usuarios/me/');
    return response.data;
  },

  /**
   * Cerrar sesión (limpiar tokens)
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

/**
 * 👥 USUARIOS SERVICE
 */
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

/**
 * 📦 PRODUCTOS SERVICE (cuando lo implementes)
 */
export const productosAPI = {
  getAll: async (params?: Record<string, string>) => {
    const response = await axiosInstance.get('/productos/', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get(`/productos/${id}/`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await axiosInstance.post('/productos/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number, data: FormData) => {
    const response = await axiosInstance.patch(`/productos/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/productos/${id}/`);
    return response.data;
  },
};

/**
 * 🛒 VENTAS SERVICE (cuando lo implementes)
 */
export const ventasAPI = {
  getAll: async (params?: Record<string, string>) => {
    const response = await axiosInstance.get('/ventas/', { params });
    return response.data;
  },

  create: async (data: Record<string, unknown>) => {
    const response = await axiosInstance.post('/ventas/', data);
    return response.data;
  },
};

/**
 * 👥 CLIENTES SERVICE (cuando lo implementes)
 */
export const clientesAPI = {
  getAll: async (params?: Record<string, string>) => {
    const response = await axiosInstance.get('/clientes/', { params });
    return response.data;
  },

  create: async (data: Record<string, unknown>) => {
    const response = await axiosInstance.post('/clientes/', data);
    return response.data;
  },
};

// Exportar instancia de axios por si se necesita directamente
export { axiosInstance };