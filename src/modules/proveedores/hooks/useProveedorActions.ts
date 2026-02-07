import { useState } from "react";
import { proveedoresAPI } from "../api/proveedores.api";
import type { AxiosError } from "axios";
import type { ProveedorCreateInput, ProveedorUpdateInput } from "../types/proveedor.types";

interface ApiError {
  detail?: string;
}

export function useProveedorActions(onSuccess?: () => Promise<void>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProveedor = async (
    data: ProveedorCreateInput,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await proveedoresAPI.createProveedor(data);
      await onSuccess?.();

      return true;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.detail ?? "Error al crear el proveedor",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProveedor = async (
    id: number,
    data: ProveedorUpdateInput,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await proveedoresAPI.updateProveedor(id, data);
      await onSuccess?.();

      return true;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.detail ?? "Error al actualizar el proveedor",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProveedor = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await proveedoresAPI.deleteProveedor(id);
      await onSuccess?.();

      return true;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.detail ?? "Error al eliminar el proveedor",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProveedor,
    updateProveedor,
    deleteProveedor,
    loading,
    error,
  };
}
