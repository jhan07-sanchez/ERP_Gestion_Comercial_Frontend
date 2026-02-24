/**
 * Tipos para el módulo Clientes
 * Mismo patrón que ventas/types/venta.types.ts
 */

// ===============================
// Estado de Cliente
// ===============================
export type EstadoCliente = "ACTIVO" | "INACTIVO" | "BLOQUEADO";

// ===============================
// Badge de estado (viene del backend)
// ===============================
export interface EstadoBadge {
  color: "success" | "warning" | "danger";
  texto: string;
  icono: string;
}

// ===============================
// Cliente base
// ===============================
export interface Cliente {
  id: number;

  nombre: string;

  tipo_documento: string;

  numero_documento: string;

  telefono?: string;

  email?: string;

  direccion?: string;

  estado: EstadoCliente;

  fecha_creacion: string;

  estado_badge: EstadoBadge;

}

// ===============================
// Cliente para listar
// ===============================
export interface ClienteList extends Cliente {
  total_compras?: number;

  total_gastado?: number;
}

// ===============================
// Cliente DETAIL
// ===============================
export interface ClienteDetail extends Cliente {
  usuario_creador?: string;

  usuario_creador_email?: string;

  fecha_actualizacion?: string;
}

// ===============================
// Cliente para crear
// ===============================
export interface ClienteCreateInput {
  nombre: string;
  numero_documento: string;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
}

// ===============================
// Cliente para actualizar
// ===============================
export interface ClienteUpdateInput {
  nombre?: string;

  tipo_documento: string;

  numero_documento?: string;

  telefono?: string;

  email?: string;

  direccion?: string;

  estado?: EstadoCliente;

  fecha_actualizacion?: string;
}

// ===============================
// Filtros de clientes
// ===============================
export interface ClienteFilters {
  search?: string;

  nombre?: string;

  numero_documento?: string;

  estado?: EstadoCliente | "";

  fecha_inicio?: string;

  fecha_fin?: string;
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
// Respuesta de éxito genérica
// ===============================
export interface SuccessResponse<T> {
  detail: string;

  data: T;
}

// ===============================
// Cliente para seleccionar en formulario
// ===============================
export interface ClienteParaSeleccion {
  id: number;

  nombre: string;

  numero_documento?: string;

  telefono?: string;

  email?: string;
}

// ===============================
// Tipo exclusivo para formulario UI
// ===============================
export interface ClienteFormData {
  nombre: string;

  tipo_documento: string;

  numero_documento: string;

  telefono?: string;

  email?: string;

  direccion?: string;

  estado?: EstadoCliente;
}

// ===============================
// Paginación state
// ===============================
export interface PaginationState {
  currentPage: number;

  totalPages: number;

  pageSize: number;

  totalCount: number;
}

// ===============================
// Estadísticas de clientes
// ===============================
export interface EstadisticasClientes {
  total_clientes: number;

  clientes_activos: number;

  clientes_inactivos: number;

  clientes_nuevos: number;
}
