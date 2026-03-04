/**
 * 🪝 useClienteActions
 * Acciones CRUD para clientes.
 * Mismo patrón que useVentaActions.ts
 */

import { useState } from "react";
import { clientesAPI } from "../api/clientes.api";
import type { AxiosError } from "axios";
import type {
  ClienteDetail,
  ClienteCreateInput,
  ClienteUpdateInput,
} from "../types";

interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

export function useClienteActions(
  onSuccess?: (cliente?: ClienteDetail) => Promise<void> | void,
) {
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingActivar, setLoadingActivar] = useState(false);
  const [loadingDesactivar, setLoadingDesactivar] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ─── Helper para extraer mensaje de error ────────────────────────────────
  const extractError = (err: unknown, fallback: string): string => {
    const axiosError = err as AxiosError<ApiError>;
    return axiosError.response?.data?.detail ?? axiosError.message ?? fallback;
  };

  // ─── Crear cliente ───────────────────────────────────────────────────────
  const createCliente = async (
    data: ClienteCreateInput,
  ): Promise<ClienteDetail | null> => {
    try {
      setLoadingCreate(true);
      setError(null);

      const response = await clientesAPI.createCliente(data);

      await onSuccess?.(response.cliente);

      return response.cliente;
    } catch (err) {
      setError(extractError(err, "Error al crear el cliente"));
      return null;
    } finally {
      setLoadingCreate(false);
    }
  };

  // ─── Actualizar cliente ──────────────────────────────────────────────────
  const updateCliente = async (
    id: number,
    data: ClienteUpdateInput,
  ): Promise<ClienteDetail | null> => {
    try {
      setLoadingUpdate(true);
      setError(null);

      const updated = await clientesAPI.updateCliente(id, data);

      await onSuccess?.(updated);

      return updated;
    } catch (err) {
      setError(extractError(err, "Error al actualizar el cliente"));
      return null;
    } finally {
      setLoadingUpdate(false);
    }
  };

  // ─── Eliminar cliente ────────────────────────────────────────────────────
  const deleteCliente = async (id: number): Promise<boolean> => {
    try {
      setLoadingDelete(true);
      setError(null);

      await clientesAPI.deleteCliente(id);

      await onSuccess?.();

      return true;
    } catch (err) {
      setError(extractError(err, "Error al eliminar el cliente"));
      return false;
    } finally {
      setLoadingDelete(false);
    }
  };

  // ─── Activar cliente ─────────────────────────────────────────────────────
  const activarCliente = async (id: number): Promise<ClienteDetail | null> => {
    try {
      setLoadingActivar(true);
      setError(null);

      const response = await clientesAPI.activarCliente(id);

      await onSuccess?.(response.cliente ?? response);

      return response.cliente ?? response;
    } catch (err) {
      setError(extractError(err, "Error al activar el cliente"));
      return null;
    } finally {
      setLoadingActivar(false);
    }
  };

  // ─── Desactivar cliente ──────────────────────────────────────────────────
  const desactivarCliente = async (
    id: number,
  ): Promise<ClienteDetail | null> => {
    try {
      setLoadingDesactivar(true);
      setError(null);

      const response = await clientesAPI.desactivarCliente(id);

      await onSuccess?.(response.cliente ?? response);

      return response.cliente ?? response;
    } catch (err) {
      setError(extractError(err, "Error al desactivar el cliente"));
      return null;
    } finally {
      setLoadingDesactivar(false);
    }
  };

  // Loading consolidado
  const loading =
    loadingCreate ||
    loadingUpdate ||
    loadingDelete ||
    loadingActivar ||
    loadingDesactivar;

  return {
    createCliente,
    updateCliente,
    deleteCliente,
    activarCliente,
    desactivarCliente,
    loading,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    loadingActivar,
    loadingDesactivar,
    error,
  };
}
