import { useState, useCallback } from "react";
import { ventasAPI } from "../api/ventas.api";
import type { VentaList, VentaFilters, PaginatedResponse } from "../types/venta.types";

export function useVentasList() {
  const [ventas, setVentas] = useState<VentaList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<VentaFilters>({});

  const fetchVentas = useCallback(
    async (page = 1, currentFilters: VentaFilters = filters) => {
      setIsLoading(true);
      setError(null);

      try {
        const response: PaginatedResponse<VentaList> =
          await ventasAPI.getVentas(currentFilters, page);

        setVentas(response.results ?? []);
        setCurrentPage(page);
        setTotalCount(response.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar ventas");
      } finally {
        setIsLoading(false);
      }
    },
    [filters],
  );

  const applyFilters = useCallback(
    async (newFilters: VentaFilters) => {
      setFilters(newFilters);
      await fetchVentas(1, newFilters);
    },
    [fetchVentas],
  );

  const changePage = useCallback(
    (page: number) => {
      fetchVentas(page, filters);
    },
    [fetchVentas, filters],
  );

  return {
    ventas,
    setVentas,
    isLoading,
    error,
    currentPage,
    totalCount,
    filters,
    fetchVentas,
    applyFilters,
    changePage,
  };
}
