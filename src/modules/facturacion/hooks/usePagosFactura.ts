import { usePaginatedList } from "@/shared/hooks";
import { pagosFacturacionAPI } from "../api/pagos.api";
import type { PagoFacturaDetail, PagosFilters } from "../api/pagos.api";

export function usePagosFactura() {
  const list = usePaginatedList<PagoFacturaDetail, PagosFilters>({
    fetchFn: (filters, page) => pagosFacturacionAPI.getPagos({ ...filters, page }),
    entityName: "pagos",
  });

  return {
    pagos: list.items,
    isLoading: list.isLoading,
    error: list.error,
    currentPage: list.currentPage,
    totalCount: list.totalCount,
    filters: list.filters,
    fetchPagos: list.fetchItems,
    applyFilters: list.applyFilters,
    changePage: list.changePage,
  };
}
