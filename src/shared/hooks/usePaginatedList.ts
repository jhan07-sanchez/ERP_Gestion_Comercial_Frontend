/**
 * 📦 HOOK GENÉRICO: usePaginatedList<T>
 *
 * Hook reutilizable para listas paginadas con filtros.
 * Elimina la duplicación de useVentasList, useComprasList, useClientesList, etc.
 *
 * @example
 * const ventas = usePaginatedList<VentaList, VentaFilters>({
 *   fetchFn: (filters, page) => ventasAPI.getVentas(filters, page),
 *   entityName: "ventas",
 * });
 */

import { useState, useCallback, useRef, useEffect } from "react";
import type { PaginatedResponse } from "@shared/types";

interface UsePaginatedListOptions<T, F extends object> {
  /** Función que ejecuta la llamada API paginada */
  fetchFn: (filters: F, page: number) => Promise<PaginatedResponse<T>>;
  /** Nombre de la entidad para mensajes de error (ej: "ventas") */
  entityName: string;
  /** Tamaño de página por defecto */
  defaultPageSize?: number;
}

interface UsePaginatedListReturn<T, F extends object> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  filters: F;
  fetchItems: (page?: number, currentFilters?: F) => Promise<void>;
  applyFilters: (newFilters: F) => Promise<void>;
  changePage: (page: number) => void;
}

export function usePaginatedList<T, F extends object = object>({
  fetchFn,
  entityName,
}: UsePaginatedListOptions<T, F>): UsePaginatedListReturn<T, F> {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<F>({} as F);

  const fetchFnRef = useRef(fetchFn);
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchItems = useCallback(
    async (page = 1, currentFilters?: F) => {
      const activeFilters = currentFilters !== undefined ? currentFilters : filtersRef.current;
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchFnRef.current(activeFilters, page);
        setItems(response.results ?? []);
        setCurrentPage(page);
        setTotalCount(response.count);
      } catch (err) {
        setItems([]);
        setTotalCount(0);
        setError(
          err instanceof Error
            ? err.message
            : `Error al cargar ${entityName}`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [entityName],
  );

  const applyFilters = useCallback(
    async (newFilters: F) => {
      setFilters(newFilters);
      await fetchItems(1, newFilters);
    },
    [fetchItems],
  );

  const changePage = useCallback(
    (page: number) => {
      fetchItems(page, filters);
    },
    [fetchItems, filters],
  );

  return {
    items,
    setItems,
    isLoading,
    error,
    currentPage,
    totalCount,
    filters,
    fetchItems,
    applyFilters,
    changePage,
  };
}
