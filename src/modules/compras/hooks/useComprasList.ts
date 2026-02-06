import { useState, useCallback } from "react";
import { comprasAPI } from "../api";
import type { CompraList, CompraFilters, PaginatedResponse } from "../types";

export function useComprasList() {
  const [compras, setCompras] = useState<CompraList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<CompraFilters>({});

  const fetchCompras = useCallback(
    async (page = 1, currentFilters: CompraFilters = filters) => {
      setIsLoading(true);
      setError(null);

      try {
        const response: PaginatedResponse<CompraList> =
          await comprasAPI.getCompras(currentFilters, page);

        setCompras(response.results ?? []);
        setCurrentPage(page);
        setTotalCount(response.count);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar compras",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [filters],
  );

  const applyFilters = useCallback(
    async (newFilters: CompraFilters) => {
      setFilters(newFilters);
      await fetchCompras(1, newFilters);
    },
    [fetchCompras],
  );

  const changePage = useCallback(
    (page: number) => {
      fetchCompras(page, filters);
    },
    [fetchCompras, filters],
  );

  return {
    compras,
    isLoading,
    error,
    currentPage,
    totalCount,
    filters,
    fetchCompras,
    applyFilters,
    changePage,
  };
}
