/**
 * Hook para lista paginada de clientes.
 * Usa el hook genérico usePaginatedList.
 */

import { usePaginatedList } from "@shared/hooks";
import { clientesAPI } from "../api/clientes.api";
import type { ClienteList, ClienteFilters } from "../types/cliente.types";

export function useClientesList() {
  const list = usePaginatedList<ClienteList, ClienteFilters>({
    fetchFn: (filters, page) => clientesAPI.getClientes(filters, page),
    entityName: "clientes",
  });

  return {
    clientes: list.items,
    setClientes: list.setItems,
    isLoading: list.isLoading,
    error: list.error,
    currentPage: list.currentPage,
    totalCount: list.totalCount,
    filters: list.filters,
    fetchClientes: list.fetchItems,
    applyFilters: list.applyFilters,
    changePage: list.changePage,
  };
}
