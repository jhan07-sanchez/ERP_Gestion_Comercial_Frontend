import { usePaginatedList } from "@/shared/hooks";
import { facturasVentaAPI } from "../api/facturas-venta.api";
import type { FacturaList, FacturaFilters } from "../types";

export function useFacturasVenta() {
  const list = usePaginatedList<FacturaList, FacturaFilters>({
    fetchFn: (filters, page) => facturasVentaAPI.getFacturas({ ...filters, page }),
    entityName: "facturas",
  });

  return {
    facturas: list.items,
    setFacturas: list.setItems,
    isLoading: list.isLoading,
    error: list.error,
    currentPage: list.currentPage,
    totalCount: list.totalCount,
    filters: list.filters,
    fetchFacturas: list.fetchItems,
    applyFilters: list.applyFilters,
    changePage: list.changePage,
  };
}
