import { useState } from "react";
import { facturasVentaAPI } from "../api/facturas-venta.api";
import type {
  FacturaList,
  FacturaDetail,
  FacturaCreateInput,
  FacturaUpdateInput,
  AnularFacturaInput,
  RegistrarPagoInput,
} from "../types";
import { getApiErrorMessage } from "@/shared/utils/apiError";

export function useFacturaActions(
  onSuccess?: (factura?: FacturaList | FacturaDetail) => Promise<void> | void,
) {
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEmitir, setLoadingEmitir] = useState(false);
  const [loadingAnular, setLoadingAnular] = useState(false);
  const [loadingPago, setLoadingPago] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const createFactura = async (data: FacturaCreateInput): Promise<FacturaDetail | null> => {
    try {
      setLoadingCreate(true);
      setError(null);
      const response = await facturasVentaAPI.createFactura(data);
      await onSuccess?.(response);
      return response;
    } catch (err) {
      setError(getApiErrorMessage(err, "Error al crear la factura"));
      return null;
    } finally {
      setLoadingCreate(false);
    }
  };

  const updateFactura = async (id: number, data: FacturaUpdateInput): Promise<FacturaDetail | null> => {
    try {
      setLoadingUpdate(true);
      setError(null);
      const updated = await facturasVentaAPI.updateFactura(id, data);
      await onSuccess?.(updated);
      return updated;
    } catch (err) {
      setError(getApiErrorMessage(err, "Error al actualizar la factura"));
      return null;
    } finally {
      setLoadingUpdate(false);
    }
  };

  const deleteFactura = async (id: number): Promise<boolean> => {
    try {
      setLoadingDelete(true);
      setError(null);
      await facturasVentaAPI.deleteFactura(id);
      await onSuccess?.();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, "Error al eliminar la factura"));
      return false;
    } finally {
      setLoadingDelete(false);
    }
  };

  const emitirFactura = async (id: number): Promise<boolean> => {
    try {
      setLoadingEmitir(true);
      setError(null);
      await facturasVentaAPI.emitirFactura(id);
      await onSuccess?.();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, "Error al emitir la factura"));
      return false;
    } finally {
      setLoadingEmitir(false);
    }
  };

  const anularFactura = async (id: number, data: AnularFacturaInput): Promise<boolean> => {
    try {
      setLoadingAnular(true);
      setError(null);
      await facturasVentaAPI.anularFactura(id, data);
      await onSuccess?.();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, "Error al anular la factura"));
      return false;
    } finally {
      setLoadingAnular(false);
    }
  };

  const registrarPago = async (id: number, data: RegistrarPagoInput): Promise<boolean> => {
    try {
      setLoadingPago(true);
      setError(null);
      await facturasVentaAPI.registrarPago(id, data);
      await onSuccess?.();
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, "Error al registrar el pago"));
      return false;
    } finally {
      setLoadingPago(false);
    }
  };

  const loading =
    loadingCreate ||
    loadingUpdate ||
    loadingDelete ||
    loadingEmitir ||
    loadingAnular ||
    loadingPago;

  return {
    createFactura,
    updateFactura,
    deleteFactura,
    emitirFactura,
    anularFactura,
    registrarPago,
    loading,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    loadingEmitir,
    loadingAnular,
    loadingPago,
    error,
  };
}
