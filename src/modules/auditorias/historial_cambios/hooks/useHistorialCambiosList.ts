/**
 * Hook para listado de historial de cambios.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { historialCambiosAPI } from '../api';
import type { LogAuditoria, LogAuditoriaFilters } from '../types';

const DEFAULT_PAGE_SIZE = 20;

export function useHistorialCambiosList() {
  const [logs, setLogs] = useState<LogAuditoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [filters, setFilters] = useState<LogAuditoriaFilters>({});
  const [hasFetched, setHasFetched] = useState(false);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const fetchLogs = useCallback(
    async (
      page = 1,
      size = pageSize,
      newFilters: LogAuditoriaFilters = filters
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await historialCambiosAPI.getLogs(newFilters, page, size);
        setLogs(response.results ?? []);
        setCurrentPage(page);
        setTotalCount(response.count ?? 0);
        setPageSize(size);
        setFilters(newFilters);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar logs');
        setLogs([]);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    },
    [pageSize, filters]
  );

  const applyFilters = useCallback(
    async (newFilters: LogAuditoriaFilters) => {
      setFilters(newFilters);
      await fetchLogs(1, pageSize, newFilters);
    },
    [fetchLogs, pageSize]
  );

  const changePage = useCallback(
    (page: number) => fetchLogs(page, pageSize, filters),
    [fetchLogs, pageSize, filters]
  );

  const changePageSize = useCallback(
    (size: number) => fetchLogs(1, size, filters),
    [fetchLogs, filters]
  );

  const retry = useCallback(
    () => fetchLogs(currentPage, pageSize, filters),
    [fetchLogs, currentPage, pageSize, filters]
  );

  const hasInitialFetched = useRef(false);
  useEffect(() => {
    if (!hasInitialFetched.current) {
      hasInitialFetched.current = true;
      fetchLogs(1);
    }
  }, [fetchLogs]);

  return {
    logs,
    isLoading,
    error,
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    filters,
    hasFetched,
    applyFilters,
    changePage,
    changePageSize,
    retry,
  };
}
