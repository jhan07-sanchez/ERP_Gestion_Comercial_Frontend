/**
 * Utilidades para manejo robusto de errores de API.
 * Extrae mensajes de error de respuestas Axios/backend de forma consistente.
 */

export type ApiErrorShape = {
  response?: {
    status?: number;
    data?: {
      detail?: string;
      message?: string;
      error?: string;
      [key: string]: unknown;
    };
  };
};

/**
 * Obtiene un mensaje legible a partir de un error de API.
 * Prioridad: detail > message > error > mensaje por defecto.
 */
export function getApiErrorMessage(error: unknown, defaultMessage: string): string {
  const err = error as ApiErrorShape;
  const data = err?.response?.data;
  if (!data) return defaultMessage;
  if (typeof data.detail === 'string') return data.detail;
  if (typeof data.message === 'string') return data.message;
  if (typeof data.error === 'string') return data.error;
  return defaultMessage;
}

/**
 * Obtiene el código HTTP del error (si existe).
 */
export function getApiErrorStatus(error: unknown): number | undefined {
  const err = error as ApiErrorShape;
  return err?.response?.status;
}
