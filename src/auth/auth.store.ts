// src/auth/auth.store.ts
/**
 * 🗄️ STORE DE AUTENTICACIÓN
 * 
 * Zustand es como Redux pero más simple.
 * Este store maneja:
 * - Estado del usuario (logueado o no)
 * - Tokens JWT
 * - Funciones de login/logout/register
 * 
 * USO:
 * const { user, login, logout } = useAuthStore();
 */

import { create } from 'zustand';
import { authAPI } from '@/api';
import { getApiErrorMessage } from '@/utils/apiError';
import type { AuthStore, LoginCredentials, RegisterData } from './auth.types';

/**
 * Hook personalizado para usar el store de autenticación
 */
const initialAccessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

export const useAuthStore = create<AuthStore>((set) => ({
  // ====== ESTADO INICIAL ======
  user: null,
  isAuthenticated: false,
  // `isLoading` para acciones (login/register)
  isLoading: false,
  // `checkingSession` para la verificación inicial al arrancar la app
  checkingSession: !!initialAccessToken,
  error: null,

  // ====== ACCIONES ======

  /**
   * 🔐 Iniciar sesión
   */
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });

    try {
      // Llamar al API de login
      const data = await authAPI.login(credentials.email, credentials.password);

      // Guardar tokens en localStorage
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // Actualizar estado
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = getApiErrorMessage(error, 'Error al iniciar sesión');
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      
      throw error;
    }
  },

  /**
   * 📝 Registrar nuevo usuario
   */
  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });

    try {
      await authAPI.register(data);

      // Después de registrar, hacer login automático
      const loginData = await authAPI.login(data.email, data.password);

      localStorage.setItem('access_token', loginData.access);
      localStorage.setItem('refresh_token', loginData.refresh);

      set({
        user: loginData.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = getApiErrorMessage(error, 'Error al registrarse');
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      
      throw error;
    }
  },

  /**
   * 🚪 Cerrar sesión
   */
  logout: () => {
    authAPI.logout();
    
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  /**
   * 👤 Cargar datos del usuario actual
   * Se llama al iniciar la app para verificar si hay sesión activa
   */
  loadUser: async () => {
    // Verificar si hay token
    const token = localStorage.getItem('access_token');

    if (!token) {
      set({ isAuthenticated: false, user: null, checkingSession: false });
      return;
    }

    set({ checkingSession: true });

    try {
      const userData = await authAPI.getMe();
      
      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        checkingSession: false,
        error: null,
      });
    } catch {
      // Si falla, limpiar tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        checkingSession: false,
        error: null,
      });
    }
  },

  /**
   * ⚠️ Establecer error manualmente
   */
  setError: (error: string | null) => {
    set({ error });
  },
}));