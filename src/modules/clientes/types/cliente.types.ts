/**
 * Tipos para el módulo Clientes
 * Mismo patrón que ventas/types/venta.types.ts
 */

// ===============================
// Tipo de documento (debe coincidir con backend)
// ===============================
export type TipoDocumento = "CEDULA" | "NIT" | "CEDULA_EXTRANJERA";

export const TIPO_DOCUMENTO_LABELS: Record<TipoDocumento, string> = {
  CEDULA: "Cédula de ciudadanía",
  NIT: "NIT",
  CEDULA_EXTRANJERA: "Cédula extranjera",
};

export function getTipoDocumentoLabel(value: string): string {
  return TIPO_DOCUMENTO_LABELS[value as TipoDocumento] ?? value;
}

/** Mapeo inverso: etiqueta → clave. Asegura enviar siempre la clave al backend. */
const LABEL_TO_KEY: Record<string, TipoDocumento> = {
  "Cédula de ciudadanía": "CEDULA",
  "Cédula de ciudadania": "CEDULA",
  "Cédula extranjera": "CEDULA_EXTRANJERA",
  NIT: "NIT",
};

export function normalizeTipoDocumentoForAPI(value: string | undefined): TipoDocumento {
  if (!value?.trim()) return "CEDULA";
  const v = value.trim();
  if (v === "CEDULA" || v === "NIT" || v === "CEDULA_EXTRANJERA") return v as TipoDocumento;
  return LABEL_TO_KEY[v] ?? "CEDULA";
}

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
  tipo_documento: TipoDocumento;
  numero_documento: string;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  estado?: boolean;
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
// Tipos compartidos (re-exportados desde shared)
// ===============================
export type { PaginatedResponse, SuccessResponse, PaginationState } from "@shared/types";

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
// Estadísticas de clientes
// ===============================
export interface EstadisticasClientes {
  total_clientes: number;

  clientes_activos: number;

  clientes_inactivos: number;

  clientes_nuevos: number;
}
