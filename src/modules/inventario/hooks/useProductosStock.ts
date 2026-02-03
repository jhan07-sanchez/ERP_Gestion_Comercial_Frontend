import { useState, useCallback } from "react";
import { inventariosAPI } from "../api";
import type { ProductoList } from "../types";

export function useProductosStock() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProductosStockBajo = useCallback(async (): Promise<
    ProductoList[]
  > => {
    setIsLoading(true);
    setError(null);

    try {
      return await inventariosAPI.getProductosStockBajo();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al obtener productos con stock bajo";
      setError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getProductosStockBajo,
  };
}
