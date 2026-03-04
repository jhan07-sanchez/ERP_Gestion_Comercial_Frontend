/**
 * 🪝 useVentaActions
 * Acciones CRUD para ventas. Mismo patrón que useCompraActions.ts
 */

import { useState } from "react";
import { ventasAPI } from "../api/ventas.api";
import type {
  VentaList,
  VentaDetail,
  VentaCreateInput,
  VentaUpdateInput,
  PagoVentaCreateInput,
} from "../types/venta.types";
import { getApiErrorMessage } from "@/shared/utils/apiError";


export function useVentaActions(
  onSuccess?: (venta?: VentaList) => Promise<void> | void,
) {
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingCompletar, setLoadingCompletar] = useState(false);
  const [loadingCancelar, setLoadingCancelar] = useState(false);
  const [loadingPago, setLoadingPago] = useState(false);

  const [error, setError] = useState<string | null>(null);


  // ─── Crear venta ─────────────────────────────────────────────────────────
  const createVenta = async (
    data: VentaCreateInput,
  ): Promise<VentaList | null> => {
    try {
      setLoadingCreate(true);
      setError(null);

      const response = await ventasAPI.createVenta(data);

      await onSuccess?.(response.venta);

      return response.venta; // ✅ FIX REAL
    } catch (err) {
      setError(getApiErrorMessage(err, "Error al crear la venta"));
      return null;
    } finally {
      setLoadingCreate(false);
    }
  };

  // ─── Actualizar venta ─────────────────────────────────────────────────────
  const updateVenta = async (
    id: number,
    data: VentaUpdateInput,
  ): Promise<VentaList | null> => {
    try {
      setLoadingUpdate(true);
      setError(null);

      const updated = await ventasAPI.updateVenta(id, data);
      await onSuccess?.();
      return updated;
    } catch (err) {
      setError(getApiErrorMessage(err, "Error al actualizar la venta"));
      return null;
    } finally {
      setLoadingUpdate(false);
    }
  };

  // ─── Eliminar venta ───────────────────────────────────────────────────────
  const deleteVenta = async (id: number): Promise<boolean> => {
    try {
      setLoadingDelete(true);
      setError(null);

      await ventasAPI.deleteVenta(id);
      await onSuccess?.();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, "Error al eliminar la venta"));
      return false;
    } finally {
      setLoadingDelete(false);
    }
  };

  // ─── Completar venta ──────────────────────────────────────────────────────
  const completarVenta = async (id: number): Promise<VentaList | null> => {
    try {
      setLoadingCompletar(true);
      setError(null);

      const response = await ventasAPI.completarVenta(id);
      await onSuccess?.(response.venta ?? response);
      return response.venta ?? response;
    } catch (err) {
      setError(getApiErrorMessage(err, "Error al completar la venta"));
      return null;
    } finally {
      setLoadingCompletar(false);
    }
  };

  // ─── Cancelar venta ───────────────────────────────────────────────────────
  const cancelarVenta = async (
    id: number,
    motivo: string,
  ): Promise<VentaList | null> => {
    try {
      setLoadingCancelar(true);
      setError(null);

      const response = await ventasAPI.cancelarVenta(id, motivo);
      await onSuccess?.(response.venta ?? response);
      return response.venta ?? response;
    } catch (err) {
      setError(getApiErrorMessage(err, "Error al cancelar la venta"));
      return null;
    } finally {
      setLoadingCancelar(false);
    }
  };

  // ─── Registrar Pago ───────────────────────────────────────────────────────
  const registrarPago = async (
    id: number,
    data: PagoVentaCreateInput,
  ): Promise<VentaDetail | null> => {
    try {
      setLoadingPago(true);
      setError(null);

      const response = await ventasAPI.registrarPago(id, data);
      await onSuccess?.(response.venta as unknown as VentaList);
      return response.venta;
    } catch (err) {
      setError(getApiErrorMessage(err, "Error al registrar el pago"));
      return null;
    } finally {
      setLoadingPago(false);
    }
  };

  // Loading consolidado
  const loading =
    loadingCreate ||
    loadingUpdate ||
    loadingDelete ||
    loadingCompletar ||
    loadingCancelar ||
    loadingPago;

  return {
    createVenta,
    updateVenta,
    deleteVenta,
    completarVenta,
    cancelarVenta,
    registrarPago,
    loading,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    loadingCompletar,
    loadingCancelar,
    loadingPago,
    error,
  };
}
