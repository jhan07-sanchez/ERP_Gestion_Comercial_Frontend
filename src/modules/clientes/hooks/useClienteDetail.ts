import { useState, useCallback } from "react";
import { clientesAPI } from "../api/clientes.api";
import type { ClienteDetail } from "../types";

export function useClienteDetail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCliente = useCallback(async (id: number): Promise<ClienteDetail> => {
    setLoading(true);
    setError(null);

    try {
      return await clientesAPI.getCliente(id);
    } catch (err) {
      setError("Error al cargar el cliente");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getCliente, loading, error };
}
