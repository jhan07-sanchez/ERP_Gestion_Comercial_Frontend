import { useState, useCallback } from "react";
import { cajaAPI } from "../api/Caja.api";
import type { Caja, FiltrosCaja, PaginatedResponse } from "../types/Caja.types";

export function useCajaList() {
  const [cajas, setCajas] = useState<Caja[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<FiltrosCaja>({});

  const fetchCajas = useCallback(
    async (page = 1, currentFilters: FiltrosCaja = filters) => {
      setIsLoading(true);
      setError(null);

      try {
        const response: PaginatedResponse<Caja> = await cajaAPI.getCajas(
          currentFilters,
          page,
        );

        setCajas(response.results ?? []);
        setCurrentPage(page);
        setTotalCount(response.count);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar las cajas",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [filters],
  );

  const applyFilters = useCallback(
    async (newFilters: FiltrosCaja) => {
      setFilters(newFilters);
      await fetchCajas(1, newFilters);
    },
    [fetchCajas],
  );

  const changePage = useCallback(
    (page: number) => {
      fetchCajas(page, filters);
    },
    [fetchCajas, filters],
  );

  return {
    cajas,
    setCajas,
    isLoading,
    error,
    currentPage,
    totalCount,
    filters,
    fetchCajas,
    applyFilters,
    changePage,
  };
}
