/**
 * Tipos para el submódulo Historial de Cambios.
 * Alineados con el serializer LogAuditoria del backend Django.
 */

export interface UsuarioAuditoriaInfo {
  id: number;
  username: string;
  nombre: string;
  email?: string;
}

export interface LogAuditoria {
  id: number;
  fecha_hora: string;
  usuario_nombre: string;
  usuario_info: UsuarioAuditoriaInfo | null;
  accion: string;
  accion_display: string;
  modulo: string;
  modulo_display: string;
  nivel: string;
  nivel_display: string;
  descripcion: string;
  ip_address: string | null;
  exitoso: boolean;
  icono: string;
  objeto_repr: string;
  duracion_ms: number | null;
}

export interface TipoObjeto {
  app: string;
  modelo: string;
  nombre: string;
}

export interface LogAuditoriaDetail extends LogAuditoria {
  content_type: number | null;
  object_id: string | null;
  user_agent: string;
  endpoint: string;
  metodo_http: string;
  datos_antes: Record<string, unknown> | null;
  datos_despues: Record<string, unknown> | null;
  extra: Record<string, unknown> | null;
  tiene_cambios: boolean;
  tipo_objeto: TipoObjeto | null;
}

export interface PaginatedLogsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LogAuditoria[];
}

export interface LogAuditoriaFilters {
  modulo?: string;
  accion?: string;
  nivel?: string;
  exitoso?: boolean;
  usuario?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  search?: string;
  ordering?: string;
}
