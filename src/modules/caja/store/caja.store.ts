/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              STORE GLOBAL DE CAJA (Zustand)                                ║
 * ║                                                                              ║
 * ║  Fuente única de verdad para el estado de la caja en el frontend.           ║
 * ║                                                                              ║
 * ║  REGLA FUNDAMENTAL:                                                          ║
 * ║  SI NO HAY CAJA ABIERTA → el ERP debe bloquear operaciones financieras.     ║
 * ║                                                                              ║
 * ║  Patrón idéntico a config.store.ts — se hidrata al login del usuario.       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { create } from "zustand";
import { sesionCajaAPI } from "../api/Caja.api";
import type { SesionCaja } from "../types/Caja.types";

// ═══════════════════════════════════════════════════════════════
// INTERFACE DEL STORE
// ═══════════════════════════════════════════════════════════════

interface CajaState {
    /** Sesión de caja activa del usuario actual, null si no hay */
    sesionActiva: SesionCaja | null;

    /** ¿El usuario tiene caja abierta? (derivado de sesionActiva) */
    isCajaAbierta: boolean;

    /** ¿Se está cargando el estado de caja? */
    isLoading: boolean;

    /** ¿Ya se intentó hidratar al menos una vez? */
    isHydrated: boolean;

    /** Mensaje de error si la hidratación falló */
    error: string | null;

    // ── Acciones ──────────────────────────────────────────────

    /**
     * Hidratar el estado de caja desde el backend.
     * Se llama al login y cuando se necesita refrescar.
     */
    hydrateCaja: () => Promise<void>;

    /**
     * Actualizar la sesión activa manualmente.
     * Se usa después de abrir/cerrar caja desde la UI.
     */
    setSesionActiva: (sesion: SesionCaja | null) => void;

    /**
     * Limpiar el estado de caja (al cerrar caja o logout).
     */
    clearSesion: () => void;

    /**
     * Verificar si se puede operar.
     * Retorna true/false sin lanzar excepción.
     * Ideal para habilitar/deshabilitar botones.
     */
    puedeOperar: () => boolean;
}

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

export const useCajaStore = create<CajaState>((set, get) => ({
    // ── Estado inicial ───────────────────────────────────────
    sesionActiva: null,
    isCajaAbierta: false,
    isLoading: false,
    isHydrated: false,
    error: null,

    // ── Hidratar desde backend ───────────────────────────────

    hydrateCaja: async () => {
        // Evitar llamadas duplicadas
        if (get().isLoading) return;

        set({ isLoading: true, error: null });

        try {
            const response = await sesionCajaAPI.getMiSesion();

            const sesion = response.sesion_activa ? response.data : null;

            set({
                sesionActiva: sesion,
                isCajaAbierta: !!sesion,
                isLoading: false,
                isHydrated: true,
            });
        } catch (error: unknown) {
            console.error("[CajaStore] Error al hidratar estado de caja:", error);
            set({
                sesionActiva: null,
                isCajaAbierta: false,
                isLoading: false,
                isHydrated: true,
                error: "Error al verificar el estado de la caja",
            });
        }
    },

    // ── Actualizar sesión manualmente ────────────────────────

    setSesionActiva: (sesion) => {
        set({
            sesionActiva: sesion,
            isCajaAbierta: !!sesion,
            isHydrated: true,
            error: null,
        });
    },

    // ── Limpiar sesión ───────────────────────────────────────

    clearSesion: () => {
        set({
            sesionActiva: null,
            isCajaAbierta: false,
            error: null,
        });
    },

    // ── Verificar operabilidad ───────────────────────────────

    puedeOperar: () => {
        return get().isCajaAbierta;
    },
}));
