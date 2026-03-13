/**
 * 📦 BARREL EXPORT: Módulo de Caja
 *
 * Centraliza las exportaciones del módulo para un import limpio:
 * import { CajaService, useCaja, sesionCajaAPI } from '@/modules/caja'
 *
 * 🎓 PATRÓN DE ORGANIZACIÓN:
 * - Types (tipos TypeScript)
 * - API (llamadas HTTP)
 * - Services (lógica de negocio)
 * - Store (estado global Zustand)
 * - Hooks (lógica React)
 * - Utils (funciones puras)
 * - Components (componentes React)
 * - Pages (páginas/vistas)
 */

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type {
  Caja,
  SesionCaja,
  MetodoPago,
  MovimientoCaja,
  ArqueoCaja,
  EstadoSesion,
  TipoMovimiento,
  CategoriaMovimiento,
  TipoArqueo,
  CrearCajaInput,
  AbrirSesionInput,
  CerrarSesionInput,
  RegistrarMovimientoInput,
  RegistrarArqueoInput,
  CajaFormData,
  CierreSesionFormData,
  MovimientoFormData,
  ArqueoFormData,
  FiltrosCaja,
  FiltrosSesion,
  FiltrosMovimiento,
  PaginatedResponse,
  RespuestaMiSesion,
  RespuestaBackend,
} from "./types/Caja.types";

export {
  TIPOS_MOVIMIENTO_INGRESO,
  TIPOS_MOVIMIENTO_EGRESO,
  TIPOS_MOVIMIENTO_MANUALES,
  estadoSesionVariantMap,
  tipoMovimientoVariantMap,
  getEstadoSesionLabel,
  getTipoMovimientoLabel,
  getCategoriaMovimiento,
  getTipoArqueoLabel,
} from "./types/Caja.types";

// ═══════════════════════════════════════════════════════════════
// API
// ═══════════════════════════════════════════════════════════════

export { cajaAPI, sesionCajaAPI, movimientosAPI, metodosPagoAPI } from "./api/Caja.api";

// ═══════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════

export { CajaService } from "./services/cajaService";

// ═══════════════════════════════════════════════════════════════
// STORE (Estado global de caja)
// ═══════════════════════════════════════════════════════════════

export { useCajaStore } from "./store/caja.store";

// ═══════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════

export { useCaja } from "./hooks/Usecaja";
export { useCajaActions } from "./hooks/useCajaActions";

// ═══════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════

export {
  convertirCajaFormDataAInput,
  convertirArqueoFormDataAInput,
  puedeRecibirMovimientos,
  puedeCerrarse,
  esSoloLectura,
  getEstadoSesionEmoji,
  resumirSesion,
} from "./utils/Caja.utils";

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

export { CajaForm } from "./components/CajaForm";

// ═══════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════

export { default as CajaListPage } from "./pages/CajaList";
export { default as CajaCreatePage } from "./pages/CajaCreate";
export { default as CajaDetailPage } from "./pages/CajaDetail";

