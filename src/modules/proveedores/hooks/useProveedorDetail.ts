import { useState } from "react";
import { proveedoresAPI } from "../api/proveedores.api";
import type { ProveedorDetail } from "../types/proveedor.types";

export function useProveedorDetail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProveedor = async (id: number): Promise<ProveedorDetail> => {
    setLoading(true);
    setError(null);

    try {
      return await proveedoresAPI.getProveedor(id);
    } catch (err) {
      setError("Error al cargar el proveedor");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getProveedor, loading, error };
}
