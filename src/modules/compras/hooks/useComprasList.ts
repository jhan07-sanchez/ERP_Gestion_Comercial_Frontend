/**
 * Hook para lista paginada de compras.
 * Usa el hook genérico usePaginatedList.
 */

import { usePaginatedList } from "@shared/hooks";
import { comprasAPI } from "../api";
import type { CompraList, CompraFilters } from "../types";

export function useComprasList() {
  const list = usePaginatedList<CompraList, CompraFilters>({
    fetchFn: (filters, page) => comprasAPI.getCompras(filters, page),
    entityName: "compras",
  });

  return {
    compras: list.items,
    isLoading: list.isLoading,
    error: list.error,
    currentPage: list.currentPage,
    totalCount: list.totalCount,
    filters: list.filters,
    fetchCompras: list.fetchItems,
    applyFilters: list.applyFilters,
    changePage: list.changePage,
    setCompras: list.setItems,
  };
}
