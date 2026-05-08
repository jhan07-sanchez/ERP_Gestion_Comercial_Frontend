/**
 * 📦 TIPOS COMPARTIDOS DE API
 *
 * Tipos genéricos reutilizables para respuestas del backend Django REST Framework.
 * Todos los módulos deben importar desde aquí en lugar de definir sus propios tipos.
 *
 * @example
 * import type { PaginatedResponse, SuccessResponse } from "@shared/types";
 */

// ═══════════════════════════════════════════════════════════════
// Respuesta paginada estándar de Django REST Framework
// ═══════════════════════════════════════════════════════════════

/**
 * Respuesta paginada genérica de Django REST Framework.
 * Todos los endpoints que usan `PageNumberPagination` devuelven esta estructura.
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ═══════════════════════════════════════════════════════════════
// Respuesta de éxito genérica
// ═══════════════════════════════════════════════════════════════

/**
 * Respuesta genérica de éxito del backend.
 * Usada en endpoints custom que envuelven datos con un mensaje.
 */
export interface SuccessResponse<T> {
  detail: string;
  data: T;
}

// ═══════════════════════════════════════════════════════════════
// Estado de paginación para UI
// ═══════════════════════════════════════════════════════════════

/**
 * Estado de paginación para componentes de lista.
 * Representa el estado actual de la paginación en el frontend.
 */
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

// ═══════════════════════════════════════════════════════════════
// Respuesta genérica del backend (wrapper)
// ═══════════════════════════════════════════════════════════════

/**
 * Respuesta genérica del backend con wrapper de éxito.
 */
export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data: T;
}
