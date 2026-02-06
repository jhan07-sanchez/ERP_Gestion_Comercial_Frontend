import { useState } from "react";
import { comprasAPI } from "../api/compras.api";
import type { AxiosError } from "axios";
import type { CompraCreateInput, CompraUpdateInput } from "../types";

interface ApiError {
  detail?: string;
}

export function useCompraActions(onSuccess?: () => Promise<void>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCompra = async (data: CompraCreateInput): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await comprasAPI.createCompra(data);
      await onSuccess?.();

      return true;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError.response?.data?.detail ?? "Error al crear la compra");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCompra = async (
    id: number,
    data: CompraUpdateInput,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await comprasAPI.updateCompra(id, data);
      await onSuccess?.();

      return true;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.detail ?? "Error al actualizar la compra",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCompra = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await comprasAPI.deleteCompra(id);
      await onSuccess?.();

      return true;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.detail ?? "Error al eliminar la compra",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCompra,
    updateCompra,
    deleteCompra,
    loading,
    error,
  };
}
