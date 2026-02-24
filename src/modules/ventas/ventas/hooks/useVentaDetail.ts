import { useState, useCallback } from "react";
import { ventasAPI } from "../api/ventas.api";
import type { VentaDetail } from "../types/venta.types";

export function useVentaDetail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getVenta = useCallback(async (id: number): Promise<VentaDetail> => {
    setLoading(true);
    setError(null);

    try {
      return await ventasAPI.getVenta(id);
    } catch (err) {
      setError("Error al cargar la venta");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getVenta, loading, error };
}
