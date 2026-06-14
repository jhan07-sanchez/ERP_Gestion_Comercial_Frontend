import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { showGlobalAlert } from '@/shared/components/alerts';

/** URL base del API (desarrollo: .env VITE_API_URL, producción: variable de entorno) */
const BASE_URL = import.meta.env.VITE_API_URL || 'https://erp-gestion-comercial-backend.onrender.com/api';

/**
 * Instancia principal de axios configurada
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 segundos timeout
});

/**
 * INTERCEPTOR DE REQUEST
 * Se ejecuta ANTES de cada petición al servidor
 * Agrega el token JWT si existe en localStorage
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('access_token');

    if (token && config.headers) {
      // Agregar token al header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * INTERCEPTOR DE RESPONSE
 * Se ejecuta DESPUÉS de cada respuesta del servidor
 * Maneja errores automáticamente (especialmente 401)
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, solo retornarla
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const data = error.response?.data as Record<string, string | Record<string, string>>;

    // Manejo de errores globales (excepto 401 que tiene su propia lógica abajo)
    if (status && status !== 401) {
      let message = "Ha ocurrido un error inesperado";
      let title = "Error del Sistema";

      if (status === 400) {
        title = "Datos Inválidos";
        const raw = data?.message || data?.error || data?.detail;
        message = typeof raw === 'string' ? raw : "Por favor, revisa la información enviada";
      } else if (status === 403) {
        title = "Acceso Denegado";
        message = "No tienes permisos para realizar esta acción";
      } else if (status === 404) {
        title = "No Encontrado";
        message = "El recurso solicitado no existe";
      } else if (status >= 500) {
        title = "Error del Servidor";
        message = "El servidor encontró un error interno. Intenta más tarde";
      }

      showGlobalAlert(title, 'error', { description: message });
    } else if (!status) {
      // Ignorar errores generados por peticiones canceladas o abortadas intencionalmente
      if (!axios.isCancel(error) && error.code !== 'ERR_CANCELED') {
        showGlobalAlert("Error de Conexión", "critical", {
          description: "No se pudo conectar con el servidor. Verifica tu internet."
        });
      }
    }

    // Si el error es 401 (No autorizado) y no es un intento de retry
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;

          // Guardar nuevo token
          localStorage.setItem('access_token', access);

          // Reintentar la petición original con el nuevo token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar tokens y redirigir al login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
