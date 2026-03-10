/**
 * 🪝 useCajaActions (ESTRUCTURA IGUAL A useCompraActions)
 *
 * Acciones del módulo caja:
 * - Abrir caja
 * - Cerrar caja
 * - Registrar movimientos
 * - Registrar arqueo
 * - Obtener caja activa
 * - Obtener detalle
 */

import { useState } from "react";
import type { AxiosError } from "axios";
import { sesionCajaAPI } from "../api/Caja.api";

import type {
  SesionCaja,
  MovimientoCaja,
  AbrirSesionInput,
  CerrarSesionInput,
  RegistrarMovimientoInput,
  RegistrarArqueoInput,
} from "../types/Caja.types";

interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

export function useCajaActions(
  onSuccess?: (sesion?: SesionCaja) => Promise<void> | void,
) {
  // Estados loading por operación

  const [loadingAbrir, setLoadingAbrir] = useState(false);
  const [loadingCerrar, setLoadingCerrar] = useState(false);
  const [loadingMovimiento, setLoadingMovimiento] = useState(false);
  const [loadingArqueo, setLoadingArqueo] = useState(false);
  const [loadingCajaActiva, setLoadingCajaActiva] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Estados de datos

  const [cajaActiva, setCajaActiva] = useState<SesionCaja | null>(null);
  const [cajaDetalle, setCajaDetalle] = useState<SesionCaja | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);

  // ===============================
  // ABRIR CAJA
  // ===============================

  const abrirCaja = async (
    data: AbrirSesionInput,
  ): Promise<SesionCaja | null> => {
    try {
      setLoadingAbrir(true);
      setError(null);

      const sesion = await sesionCajaAPI.abrirSesion(data);

      setCajaActiva(sesion);

      if (onSuccess) {
        await onSuccess(sesion);
      }

      return sesion;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;

      let errorMessage = "Error al abrir la caja";

      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      setError(errorMessage);

      return null;
    } finally {
      setLoadingAbrir(false);
    }
  };

  // ===============================
  // CERRAR CAJA
  // ===============================

  const cerrarCaja = async (
    sesionId: number,
    data: CerrarSesionInput,
  ): Promise<boolean> => {
    try {
      setLoadingCerrar(true);
      setError(null);

      await sesionCajaAPI.cerrarSesion(sesionId, data);

      setCajaActiva(null);

      if (onSuccess) {
        await onSuccess();
      }

      return true;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;

      let errorMessage = "Error al cerrar la caja";

      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      setError(errorMessage);

      return false;
    } finally {
      setLoadingCerrar(false);
    }
  };

  // ===============================
  // REGISTRAR MOVIMIENTO
  // ===============================

  const registrarMovimiento = async (
    sesionId: number,
    data: RegistrarMovimientoInput,
  ): Promise<MovimientoCaja | null> => {
    try {
      setLoadingMovimiento(true);
      setError(null);

      const movimiento = await sesionCajaAPI.registrarMovimiento(
        sesionId,
        data,
      );

      setMovimientos((prev) => [movimiento, ...prev]);

      if (onSuccess) {
        await onSuccess();
      }

      return movimiento;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;

      let errorMessage = "Error al registrar el movimiento";

      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      setError(errorMessage);

      return null;
    } finally {
      setLoadingMovimiento(false);
    }
  };

  // ===============================
  // REGISTRAR ARQUEO
  // ===============================

  const registrarArqueo = async (
    sesionId: number,
    data: RegistrarArqueoInput,
  ): Promise<boolean> => {
    try {
      setLoadingArqueo(true);
      setError(null);

      await sesionCajaAPI.registrarArqueo(sesionId, data);

      if (onSuccess) {
        await onSuccess();
      }

      return true;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;

      let errorMessage = "Error al registrar el arqueo";

      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      setError(errorMessage);

      return false;
    } finally {
      setLoadingArqueo(false);
    }
  };

  // ===============================
  // OBTENER CAJA ACTIVA
  // ===============================

  const fetchCajaActiva = async (): Promise<SesionCaja | null> => {
    try {
      setLoadingCajaActiva(true);

      const resp = await sesionCajaAPI.getMiSesion();

      if (resp.sesion_activa && resp.data) {
        setCajaActiva(resp.data);
        return resp.data;
      }

      setCajaActiva(null);

      return null;
    } catch {
      setCajaActiva(null);
      return null;
    } finally {
      setLoadingCajaActiva(false);
    }
  };

  // ===============================
  // DETALLE DE SESIÓN
  // ===============================

  const fetchDetalleCompleto = async (
    sesionId: number,
  ): Promise<SesionCaja | null> => {
    try {
      setLoadingDetalle(true);
      setError(null);

      const sesion = await sesionCajaAPI.getSesion(sesionId);

      setCajaDetalle(sesion);
      setMovimientos(sesion.movimientos || []);

      return sesion;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;

      let errorMessage = "Error al cargar el detalle de caja";

      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      setError(errorMessage);

      return null;
    } finally {
      setLoadingDetalle(false);
    }
  };

  // ===============================
  // LOADING CONSOLIDADO
  // ===============================

  const loading =
    loadingAbrir ||
    loadingCerrar ||
    loadingMovimiento ||
    loadingArqueo ||
    loadingCajaActiva ||
    loadingDetalle;

  // ===============================
  // RETURN
  // ===============================

  return {
    abrirCaja,
    cerrarCaja,
    registrarMovimiento,
    registrarArqueo,
    fetchCajaActiva,
    fetchDetalleCompleto,

    cajaActiva,
    cajaDetalle,
    movimientos,

    loading,
    loadingAbrir,
    loadingCerrar,
    loadingMovimiento,
    loadingArqueo,
    loadingCajaActiva,
    loadingDetalle,

    error,
  };
}
