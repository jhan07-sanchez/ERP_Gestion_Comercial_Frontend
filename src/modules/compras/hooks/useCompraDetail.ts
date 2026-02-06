import { useState } from "react";
import { comprasAPI } from "../api/compras.api";
import type { CompraDetail } from "../types";

export function useCompraDetail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCompra = async (id: number): Promise<CompraDetail> => {
    setLoading(true);
    setError(null);

    try {
      return await comprasAPI.getCompra(id);
    } catch (err) {
      setError("Error al cargar la compra");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getCompra, loading, error };
}
