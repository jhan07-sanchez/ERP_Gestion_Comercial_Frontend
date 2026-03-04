// src/modules/auditoria/types/index.ts

export type AuditAction = 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'LOGIN_FALLIDO' 
  | 'CREAR' 
  | 'LEER' 
  | 'ACTUALIZAR' 
  | 'ELIMINAR' 
  | 'COMPLETAR' 
  | 'CANCELAR' 
  | 'ANULAR' 
  | 'APROBAR' 
  | 'RECHAZAR' 
  | 'AJUSTAR_STOCK' 
  | 'EXPORTAR' 
  | 'IMPRIMIR' 
  | 'ERROR' 
  | 'ACCESO_DENEGADO' 
  | 'CAMBIO_CLAVE';

export type AuditModule = 
  | 'USUARIOS' 
  | 'CLIENTES' 
  | 'PROVEEDORES' 
  | 'INVENTARIO' 
  | 'VENTAS' 
  | 'COMPRAS' 
  | 'CAJA' 
  | 'DOCUMENTOS' 
  | 'CONFIGURACION' 
  | 'DASHBOARD' 
  | 'SISTEMA';

export type AuditLevel = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface AuditDiffValue {
  antes: any;
  despues: any;
}

export interface AuditDiff {
  [key: string]: AuditDiffValue;
}

export interface UserInfo {
  id: number;
  username: string;
  nombre: string;
  email?: string;
}

export interface AuditLog {
  id: number;
  fecha_hora: string;
  usuario: number | null;
  usuario_nombre: string;
  usuario_info: UserInfo | null;
  accion: AuditAction;
  accion_display: string;
  modulo: AuditModule;
  modulo_display: string;
  nivel: AuditLevel;
  nivel_display: string;
  descripcion: string;
  content_type: number | null;
  object_id: string | null;
  objeto_repr: string;
  ip_address: string | null;
  user_agent: string;
  endpoint: string;
  metodo_http: string;
  datos_antes: Record<string, any> | null;
  datos_despues: Record<string, any> | null;
  extra: {
    diff?: AuditDiff;
    [key: string]: any;
  } | null;
  diff?: AuditDiff | null; // From SerializerMethodField
  exitoso: boolean;
  duracion_ms: number | null;
  icono: string;
}

export interface AuditStats {
  total_logs: number;
  logs_hoy: number;
  logs_semana: number;
  errores_hoy: number;
  accesos_denegados: number;
  logins_fallidos: number;
  usuarios_activos: number;
  por_modulo: Record<AuditModule, number>;
  por_accion: Record<AuditAction, number>;
  por_nivel: Record<AuditLevel, number>;
  actividad_reciente: AuditLog[];
}

export interface AuditFilters {
  modulo?: AuditModule;
  accion?: AuditAction;
  nivel?: AuditLevel;
  exitoso?: boolean;
  usuario?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}
