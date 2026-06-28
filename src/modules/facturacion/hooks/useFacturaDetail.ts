import { useState, useCallback } from "react";
import { facturasVentaAPI } from "../api/facturas-venta.api";
import type { FacturaDetail } from "../types";

export function useFacturaDetail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFactura = useCallback(async (id: number): Promise<FacturaDetail> => {
    setLoading(true);
    setError(null);

    try {
      return await facturasVentaAPI.getFacturaById(id);
    } catch (err) {
      setError("Error al cargar la factura");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getFactura, loading, error };
}
