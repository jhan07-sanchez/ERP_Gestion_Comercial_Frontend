import { useState, useCallback } from "react";
import { clientesAPI } from "../api/clientes.api";
import type { ClienteList, ClienteFilters, PaginatedResponse } from "../types/cliente.types";

export function useClientesList() {
  const [clientes, setClientes] = useState<ClienteList[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState<ClienteFilters>({});

  // ─────────────────────────────
  // Fetch clientes
  // ─────────────────────────────
  const fetchClientes = useCallback(
    async (page = 1, currentFilters: ClienteFilters = filters) => {
      setIsLoading(true);

      setError(null);

      try {
        const response: PaginatedResponse<ClienteList> =
          await clientesAPI.getClientes(currentFilters, page);

        setClientes(response.results ?? []);

        setCurrentPage(page);

        setTotalCount(response.count);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar clientes",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [filters],
  );

  // ─────────────────────────────
  // Aplicar filtros
  // ─────────────────────────────
  const applyFilters = useCallback(
    async (newFilters: ClienteFilters) => {
      setFilters(newFilters);

      await fetchClientes(1, newFilters);
    },
    [fetchClientes],
  );

  // ─────────────────────────────
  // Cambiar página
  // ─────────────────────────────
  const changePage = useCallback(
    (page: number) => {
      fetchClientes(page, filters);
    },
    [fetchClientes, filters],
  );

  return {
    clientes,

    setClientes,

    isLoading,

    error,

    currentPage,

    totalCount,

    filters,

    fetchClientes,

    applyFilters,

    changePage,
  };
}
