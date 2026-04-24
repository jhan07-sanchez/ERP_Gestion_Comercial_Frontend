// src/modules/precios/hooks/usePreciosList.ts
import { useState } from "react";
import { preciosAPI } from "../api/precios.api";
import { useCallback } from "react";
import type { PrecioList } from "../types/precio.types";
import type { PrecioFilters } from "../types/precio.types";

export function usePreciosList() {
  const [precios, setPrecios] = useState<PrecioList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    producto: undefined,
    proveedor: undefined,
    vigente: undefined,
    search: "",
  });

  const fetchPrecios = useCallback(
  async (filtersParam?: PrecioFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await preciosAPI.getAll(filtersParam || {});
      setPrecios(data?.results ?? []);
    } catch (error) {
      console.error("Error cargando precios:", error);
      setError("Error al cargar precios. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  },
  []

  );

  return {
    precios,
    loading,
    filters,
    setFilters,
    fetchPrecios,
    error,
  };
}
