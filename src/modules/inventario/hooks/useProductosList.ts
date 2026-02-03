import { useState, useCallback } from "react";
import { productosAPI } from "../api";
import type {
  ProductoList,
  ProductoFilters,
  PaginatedResponse,
} from "../types";

export function useProductosList() {
  const [productos, setProductos] = useState<ProductoList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<ProductoFilters>({});

  const fetchProductos = useCallback(
    async (page = 1, currentFilters: ProductoFilters = filters) => {
      setIsLoading(true);
      setError(null);

      try {
        const response: PaginatedResponse<ProductoList> =
          await productosAPI.getProductos(currentFilters, page);

        setProductos(response.results);
        setCurrentPage(page);
        setTotalCount(response.count);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar productos",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [filters],
  );

  const applyFilters = useCallback(
    async (newFilters: ProductoFilters) => {
      setFilters(newFilters);
      await fetchProductos(1, newFilters);
    },
    [fetchProductos],
  );

  const changePage = useCallback(
    (page: number) => {
      fetchProductos(page, filters);
    },
    [fetchProductos, filters],
  );

  return {
    productos,
    isLoading,
    error,
    currentPage,
    totalCount,
    filters,
    fetchProductos,
    applyFilters,
    changePage,
  };
}
