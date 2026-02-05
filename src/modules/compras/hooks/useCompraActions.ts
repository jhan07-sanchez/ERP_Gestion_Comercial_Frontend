import { useState } from "react";
import { deleteCompra as deleteCompraApi } from "../api/compras.api";
import type { AxiosError } from "axios";

interface ApiError {
  detail?: string;
}

export function useCompraActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 🗑️ Eliminar compra
   */
  const deleteCompra = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteCompraApi(id);

      return true;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;

      console.error("❌ Error al eliminar compra:", axiosError);

      setError(
        axiosError.response?.data?.detail ?? "Error al eliminar la compra",
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteCompra,
    loading,
    error,
  };
}
