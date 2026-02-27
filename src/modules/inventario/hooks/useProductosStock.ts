import { useState, useCallback } from "react";
import { productosAPI } from "../../productos/api";
import type { ProductoList } from "../../productos/types";

export function useProductosStock() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProductosStockBajo = useCallback(async (): Promise<ProductoList[]> => {
    setIsLoading(true);
    setError(null);

    try {
      return await productosAPI.getStockBajo();
    } catch (err: unknown) {
      const msg = (err as Error).message || "Error al obtener productos con stock bajo";
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
