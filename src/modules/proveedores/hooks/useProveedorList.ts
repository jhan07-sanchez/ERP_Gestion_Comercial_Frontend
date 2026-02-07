import { useState, useCallback } from "react";
import { proveedoresAPI} from "../api";
import type {
  ProveedorList,
  ProveedorFilters,
  PaginatedResponse,
} from "../types";

export function useProveedorList() {
  const [proveedores, setProveedores] = useState<ProveedorList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<ProveedorFilters>({});

  const fetchProveedores = useCallback(
    async (page = 1, currentFilters: ProveedorFilters = filters) => {
      setIsLoading(true);
      setError(null);

      try {
        const response: PaginatedResponse<ProveedorList> =
          await proveedoresAPI.getProveedores(currentFilters, page);

        setProveedores(response.results ?? []);
        setCurrentPage(page);
        setTotalCount(response.count);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar proveedores",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [filters],
  );

  const applyFilters = useCallback(
    async (newFilters: ProveedorFilters) => {
      setFilters(newFilters);
      await fetchProveedores(1, newFilters);
    },
    [fetchProveedores],
  );

  const changePage = useCallback(
    (page: number) => {
      fetchProveedores(page, filters);
    },
    [fetchProveedores, filters],
  );

  return {
    proveedores,
    isLoading,
    error,
    currentPage,
    totalCount,
    filters,
    fetchProveedores,
    applyFilters,
    changePage,
  };
}
