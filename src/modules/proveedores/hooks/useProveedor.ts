// proveedores/hooks/useProveedor.ts

import { useState, useEffect } from "react";
import type { Proveedor } from "../types/proveedor.types";
import { proveedoresApi } from "../api";

export const useProveedor = (id?: number) => {
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los proveedores
  const fetchProveedores = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await proveedoresApi.getAll();
      setProveedores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Cargar un proveedor específico por ID
  const fetchProveedor = async (proveedorId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await proveedoresApi.getById(proveedorId);
      setProveedor(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Cargar automáticamente al montar el componente
  useEffect(() => {
    if (id) {
      fetchProveedor(id);
    } else {
      fetchProveedores();
    }
  }, [id]);

  // Recargar datos manualmente
  const refresh = () => {
    if (id) {
      fetchProveedor(id);
    } else {
      fetchProveedores();
    }
  };

  return {
    proveedor,
    proveedores,
    loading,
    error,
    refresh,
    fetchProveedor,
    fetchProveedores,
  };
};
