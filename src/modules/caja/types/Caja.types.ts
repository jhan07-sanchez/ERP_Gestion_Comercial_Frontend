/**
 * 📦 TIPOS DEL MÓDULO CAJA
 *
 * Sincronizados exactamente con el backend Django en:
 * F:\Sistema_Gestion_Comercial_Backend\apps\caja\
 *
 * ESTRUCTURA:
 * - Caja: Definición de la caja física
 * - SesionCaja: Apertura/cierre con usuario y estado
 * - MovimientoCaja: Ingresos/egresos en una sesión
 * - ArqueoCaja: Conteo físico vs teórico
 * - MetodoPago: Métodos de pago/dinero
 */

// ═══════════════════════════════════════════════════════════════
// 1. ENUMS Y TYPE UNIONS
// ═══════════════════════════════════════════════════════════════

/** Estado de una sesión de caja */
export type EstadoSesion = "ABIERTA" | "CERRADA";

/** Tipos de movimiento que se pueden registrar */
export type TipoMovimiento =
  | "APERTURA"
  | "INGRESO_VENTA"
  | "INGRESO_MANUAL"
  | "EGRESO_COMPRA"
  | "EGRESO_GASTO"
  | "EGRESO_RETIRO";

/** Categoría del movimiento (agrupación) */
export type CategoriaMovimiento = "INGRESO" | "EGRESO";

/** Tipos de arqueo */
export type TipoArqueo = "PARCIAL" | "CIERRE";

// ═══════════════════════════════════════════════════════════════
// 2. MODELOS PRINCIPALES (Backend)
// ═══════════════════════════════════════════════════════════════

/**
 * 📦 Caja - Define una caja física/POS
 * Solo datos estáticos, el estado está en SesionCaja
 */
export interface Caja {
  id: number;
  nombre: string; // Ej: "Caja Principal", "Caja 1"
  descripcion?: string | null;
  activa: boolean;
  esta_abierta?: boolean; // Calculado: ¿tiene sesión ABIERTA?
  sesion_activa_id?: number | null;
  usuario_activo?: string | null; // Username del usuario con sesión abierta
  total_sesiones?: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

/**
 * 📋 SesionCaja - Representa una apertura/cierre de caja
 * Este es el modelo principal que usa el ERP
 */
export interface SesionCaja {
  cajaDetalle(cajaDetalle: unknown): unknown;
  id: number;
  caja: number; // FK→Caja
  caja_nombre?: string;
  usuario: number; // FK→User (quien abrió)
  usuario_nombre?: string;
  estado: EstadoSesion; // ABIERTA o CERRADA
  estado_display?: string; // Label: "Abierta" o "Cerrada"
  monto_inicial: string; // Decimal como string desde Django
  monto_final?: string | null; // Saldo teórico al cerrar
  monto_contado?: string | null; // Dinero contado físicamente
  total_ingresos?: string; // Sum(INGRESO_*)
  total_egresos?: string; // Sum(EGRESO_*)
  saldo_esperado?: string; // monto_inicial + ingresos - egresos
  diferencia?: string | null; // monto_contado - monto_final (null si abierta)
  fecha_apertura: string; // ISO timestamp
  fecha_cierre?: string | null;
  observaciones_apertura?: string | null;
  observaciones_cierre?: string | null;
  movimientos?: MovimientoCaja[];
  arqueos?: ArqueoCaja[];
}

/**
 * 💵 MetodoPago - Métodos de pago disponibles
 */
export interface MetodoPago {
  id: number;
  nombre: string; // Ej: "Efectivo", "Tarjeta Débito"
  activo: boolean;
  es_efectivo: boolean; // ¿Dinero físico en caja?
  fecha_creacion?: string;
}

/**
 * 💰 MovimientoCaja - Cada transacción (entra/sale dinero)
 */
export interface MovimientoCaja {
  id: number;
  sesion: number; // FK→SesionCaja
  metodo_pago: number; // FK→MetodoPago
  metodo_pago_nombre?: string; // Para mostrar
  metodo_pago_info?: MetodoPago;
  usuario: number; // FK→User (quien regist disró)
  usuario_nombre?: string;
  tipo: TipoMovimiento;
  tipo_display?: string; // Label legible
  es_ingreso?: boolean; // ¿Es un ingreso?
  monto: string; // Siempre positivo
  descripcion: string;
  venta_id?: number | null; // FK→Venta (si aplica)
  compra_id?: number | null; // FK→Compra (si aplica)
  fecha: string; // ISO timestamp
}

/**
 * 📊 ArqueoCaja - Conteo físico vs teórico
 */
export interface ArqueoCaja {
  id: number;
  sesion: number; // FK→SesionCaja
  usuario: number; // FK→User (quien hizo el arqueo)
  usuario_nombre?: string;
  tipo: TipoArqueo; // PARCIAL o CIERRE
  tipo_display?: string;
  monto_contado: string; // Dinero contado físicamente
  monto_esperado: string; // Snapshot del saldo_esperado
  detalle_billetes?: Record<string, number>; // {"100000": 1, "50000": 2}
  diferencia?: string; // Auto-calculado: contado - esperado
  tiene_diferencia?: boolean;
  observaciones?: string | null;
  fecha: string;
}

// ═══════════════════════════════════════════════════════════════
// 3. INPUTS (Payloads para POST/PATCH)
// ═══════════════════════════════════════════════════════════════

/**
 * Para: POST /api/caja/cajas/
 */
export interface CrearCajaInput {
  nombre: string;
  descripcion?: string;
}

/**
 * Para: POST /api/caja/sesiones/abrir/
 */
export interface AbrirSesionInput {
  caja_id: number;
  monto_inicial: string | number;
  observaciones?: string;
}

/**
 * Para: POST /api/caja/sesiones/{id}/cerrar/
 */
export interface CerrarSesionInput {
  monto_contado: string | number;
  detalle_billetes?: Record<string, number>;
  observaciones?: string;
}

/**
 * Para: POST /api/caja/sesiones/{id}/movimiento/
 */
export interface RegistrarMovimientoInput {
  tipo: TipoMovimiento;
  monto: string | number;
  descripcion: string;
  metodo_pago_id: number;
}

/**
 * Para: POST /api/caja/sesiones/{id}/arqueo/
 */
export interface RegistrarArqueoInput {
  monto_contado: string | number;
  detalle_billetes?: Record<string, number>;
  observaciones?: string;
}

// ═══════════════════════════════════════════════════════════════
// 4. FORM DATA (Estado de formularios en UI)
// ═══════════════════════════════════════════════════════════════

/**
 * Estado del formulario para abrir caja
 * Los inputs HTML devuelven strings, los convertimos antes de enviar
 */
export interface CajaFormData {
  nombre: string;
  monto_inicial: string; // "50000.00"
  observaciones: string;
}

/**
 * Estado del formulario para cerrar caja
 */
export interface CierreSesionFormData {
  monto_contado: string;
  detalle_billetes: Record<string, { cantidad: string }>;
  observaciones: string;
}

/**
 * Estado del formulario para registrar movimiento
 */
export interface MovimientoFormData {
  tipo: TipoMovimiento;
  monto: string;
  descripcion: string;
  metodo_pago_id: string; // ID como string en el form
}

/**
 * Estado del formulario para arqueo
 */
export interface ArqueoFormData {
  monto_contado: string;
  detalle_billetes: Record<string, string>; // "{"100000": "1", "50000": "2"}"
  observaciones: string;
}

// ═══════════════════════════════════════════════════════════════
// 5. FILTROS Y PAGINACIÓN
// ═══════════════════════════════════════════════════════════════

/**
 * Filtros para GET /api/caja/sesiones/
 */
export interface FiltrosSesion {
  estado?: EstadoSesion;
  caja?: number;
  usuario?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  page?: number;
  page_size?: number;
}

/**
 * Filtros para GET /api/caja/movimientos/
 */
export interface FiltrosMovimiento {
  tipo?: TipoMovimiento;
  sesion?: number;
  metodo_pago?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

/**
 * Filtros para GET /api/caja/cajas/
 */
export interface FiltrosCaja {
  search?: string;
  activa?: boolean;
  page?: number;
  page_size?: number;
}

/**
 * Respuesta paginada genérica de Django REST Framework
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ═══════════════════════════════════════════════════════════════
// 6. RESPUESTAS ESPECIALES
// ═══════════════════════════════════════════════════════════════

/**
 * Respuesta de GET /api/caja/sesiones/mi-sesion/
 */
export interface RespuestaMiSesion {
  sesion_activa: boolean;
  data: SesionCaja | null;
}

/**
 * Respuesta genérica del backend
 */
export interface RespuestaBackend<T = unknown> {
  success?: boolean;
  message?: string;
  data: T;
}

// ═══════════════════════════════════════════════════════════════
// 7. HELPERS Y MAPEOS
// ═══════════════════════════════════════════════════════════════

export const TIPOS_MOVIMIENTO_INGRESO: TipoMovimiento[] = [
  "APERTURA",
  "INGRESO_VENTA",
  "INGRESO_MANUAL",
];

export const TIPOS_MOVIMIENTO_EGRESO: TipoMovimiento[] = [
  "EGRESO_COMPRA",
  "EGRESO_GASTO",
  "EGRESO_RETIRO",
];

export const TIPOS_MOVIMIENTO_MANUALES: TipoMovimiento[] = [
  "INGRESO_MANUAL",
  "EGRESO_GASTO",
  "EGRESO_RETIRO",
];

export const estadoSesionVariantMap: Record<EstadoSesion, "success" | "danger"> = {
  ABIERTA: "success",
  CERRADA: "danger",
};

export const tipoMovimientoVariantMap: Record<
  TipoMovimiento,
  "success" | "danger" | "info"
> = {
  APERTURA: "info",
  INGRESO_VENTA: "success",
  INGRESO_MANUAL: "success",
  EGRESO_COMPRA: "danger",
  EGRESO_GASTO: "danger",
  EGRESO_RETIRO: "danger",
};

export function getEstadoSesionLabel(estado: EstadoSesion): string {
  const labels: Record<EstadoSesion, string> = {
    ABIERTA: "Abierta",
    CERRADA: "Cerrada",
  };
  return labels[estado] ?? estado;
}

export function getTipoMovimientoLabel(tipo: TipoMovimiento): string {
  const labels: Record<TipoMovimiento, string> = {
    APERTURA: "Apertura de caja",
    INGRESO_VENTA: "Ingreso por venta",
    INGRESO_MANUAL: "Ingreso manual",
    EGRESO_COMPRA: "Egreso por compra",
    EGRESO_GASTO: "Egreso por gasto",
    EGRESO_RETIRO: "Retiro de dinero",
  };
  return labels[tipo] ?? tipo;
}

export function getCategoriaMovimiento(tipo: TipoMovimiento): CategoriaMovimiento {
  return TIPOS_MOVIMIENTO_INGRESO.includes(tipo) ? "INGRESO" : "EGRESO";
}

export function getTipoArqueoLabel(tipo: TipoArqueo): string {
  const labels: Record<TipoArqueo, string> = {
    PARCIAL: "Arqueo parcial",
    CIERRE: "Arqueo de cierre",
  };
  return labels[tipo] ?? tipo;
}
