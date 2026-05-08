/**
 * 📦 BARREL EXPORT — shared/types
 *
 * Punto de entrada único para todos los tipos compartidos del ERP.
 * Los módulos deben importar desde aquí en lugar de archivos individuales.
 *
 * @example
 * import type { PaginatedResponse, SuccessResponse } from "@shared/types";
 */

export type {
  PaginatedResponse,
  SuccessResponse,
  PaginationState,
  ApiResponse,
} from "./api.types";
