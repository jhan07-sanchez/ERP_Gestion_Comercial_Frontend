// src/modules/auth/api/auth.api.ts
/**
 * 🔐 AUTH SERVICE
 * Funciones relacionadas con autenticación
 */

import axiosInstance from '@/shared/api/axios';

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
  logout: async () => {
    try {
      await axiosInstance.post('/token/logout/');
    } catch (error) {
      console.error('Error al registrar logout en backend', error);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};
