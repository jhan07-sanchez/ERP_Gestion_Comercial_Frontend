/**
 * Hook para lista paginada de ventas.
 * Usa el hook genérico usePaginatedList.
 */

import { usePaginatedList } from "@shared/hooks";
import { ventasAPI } from "../api/ventas.api";
import type { VentaList, VentaFilters } from "../types/venta.types";

export function useVentasList() {
  const list = usePaginatedList<VentaList, VentaFilters>({
    fetchFn: (filters, page) => ventasAPI.getVentas(filters, page),
    entityName: "ventas",
  });

  return {
    ventas: list.items,
    setVentas: list.setItems,
    isLoading: list.isLoading,
    error: list.error,
    currentPage: list.currentPage,
    totalCount: list.totalCount,
    filters: list.filters,
    fetchVentas: list.fetchItems,
    applyFilters: list.applyFilters,
    changePage: list.changePage,
  };
}
