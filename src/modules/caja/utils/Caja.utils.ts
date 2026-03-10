/**
 * 🛠️ UTILIDADES DEL MÓDULO CAJA
 *
 * Funciones específicas del módulo caja.
 * NO incluye utilidades globales como:
 * - formateo de moneda
 * - formateo de fechas
 * - parseos genéricos
 *
 * Esas deben vivir en utils globales del sistema.
 */

import type {
  CajaFormData,
  ArqueoFormData,
  CrearCajaInput,
  RegistrarArqueoInput,
  SesionCaja,
  EstadoSesion,
} from "../types/Caja.types";

// ═══════════════════════════════════════════════════════════════
// CONVERSIONES: FormData → API Input
// ═══════════════════════════════════════════════════════════════

/**
 * Convierte CajaFormData (formulario) a CrearCajaInput (API)
 */
export function convertirCajaFormDataAInput(
  formData: CajaFormData,
): CrearCajaInput {
  return {
    nombre: formData.nombre.trim(),
    descripcion: formData.observaciones?.trim() || "",
  };
}

/**
 * Convierte ArqueoFormData a RegistrarArqueoInput
 */
export function convertirArqueoFormDataAInput(
  formData: ArqueoFormData,
): RegistrarArqueoInput {
  const montoContado = parseFloat(formData.monto_contado);

  let detalle_billetes: Record<string, number> = {};

  if (formData.detalle_billetes) {
    if (typeof formData.detalle_billetes === "string") {
      try {
        detalle_billetes = JSON.parse(formData.detalle_billetes);
      } catch {
        detalle_billetes = {};
      }
    } else {
      detalle_billetes = formData.detalle_billetes as unknown as Record<
        string,
        number
      >;
    }
  }

  return {
    monto_contado: montoContado,
    detalle_billetes,
    observaciones: formData.observaciones?.trim() || "",
  };
}

// ═══════════════════════════════════════════════════════════════
// HELPERS DE SESIÓN DE CAJA
// ═══════════════════════════════════════════════════════════════

/**
 * Determina si una sesión acepta movimientos
 */
export function puedeRecibirMovimientos(sesion: SesionCaja): boolean {
  return sesion.estado === "ABIERTA";
}

/**
 * Determina si una sesión puede cerrarse
 */
export function puedeCerrarse(sesion: SesionCaja): boolean {
  return sesion.estado === "ABIERTA";
}

/**
 * Determina si una sesión es solo lectura
 */
export function esSoloLectura(sesion: SesionCaja): boolean {
  return sesion.estado === "CERRADA";
}

/**
 * Obtiene el emoji del estado de sesión
 */
export function getEstadoSesionEmoji(estado: EstadoSesion): string {
  return estado === "ABIERTA" ? "🟢" : "🔴";
}

// ═══════════════════════════════════════════════════════════════
// RESUMEN DE SESIÓN
// ═══════════════════════════════════════════════════════════════

/**
 * Genera un resumen corto de la sesión de caja
 */
export function resumirSesion(sesion: SesionCaja): string {
  const estado = getEstadoSesionEmoji(sesion.estado);
  const caja = sesion.caja_nombre || `Caja #${sesion.caja}`;
  const usuario = sesion.usuario_nombre || "Sistema";

  return `${estado} ${caja} (${usuario})`;
}
