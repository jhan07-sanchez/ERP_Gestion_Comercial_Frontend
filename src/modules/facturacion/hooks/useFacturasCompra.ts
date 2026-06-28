/**
 * 📦 Hook: useFacturasCompra
 *
 * Hook para lista paginada de facturas de compra.
 * Usa el hook genérico usePaginatedList, igual que useFacturasVenta.
 */

import { usePaginatedList } from "@/shared/hooks";
import { facturasCompraAPI } from "../api/facturas-compra.api";
import type {
  FacturaCompraList,
  FacturaCompraFilters,
} from "../types/facturaCompra.types";

export function useFacturasCompra() {
  const list = usePaginatedList<FacturaCompraList, FacturaCompraFilters>({
    fetchFn: (filters, page) =>
      facturasCompraAPI.getFacturasCompra(filters, page),
    entityName: "facturas de compra",
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
