/**
 * Tipos para el módulo Proveedores
 */

// ===============================
// Proveedor base
// ===============================
export interface Proveedor {
  id: number;
  nombre: string;
  documento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  estado: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// ===============================
// Proveedor simple (selects, refs)
// ===============================
export interface ProveedorSimple {
  id: number;
  nombre: string;
}

// ===============================
// Proveedor para listar
// ===============================
export interface ProveedorList extends Proveedor {}

// ===============================
// Proveedor DETAIL
// ===============================
export interface ProveedorDetail extends Proveedor {}

// ===============================
// Proveedor para crear
// ===============================
export interface ProveedorCreateInput {
  nombre: string;
  documento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  fecha_creacion?: string;
  estado?: boolean;
}

// ===============================
// Proveedor para actualizar
// ===============================
export interface ProveedorUpdateInput {
  nombre?: string;
  documento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  fecha_actualizacion?: string;
  estado?: boolean;
}

// ===============================
// Filtros de proveedores
// ===============================
export interface ProveedorFilters {
  search?: string;
  documento?: string;
  estado?: boolean;
}

// ===============================
// Respuesta paginada (reutilizable)
// ===============================
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ===============================
// Respuesta genérica de éxito
// ===============================
export interface SuccessResponse<T> {
  detail: string;
  data: T;
}

/**
 * Tipo exclusivo para formularios (Create / Edit)
 * NO es el payload del backend
 */
export interface ProveedorFormData {
  nombre: string;
  documento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  estado?: boolean;
}
