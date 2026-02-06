import { useComprasList } from "./useComprasList";
import { useCompraActions } from "./useCompraActions";
import { useCompraDetail } from "./useCompraDetail";

export function useCompras() {
  const list = useComprasList();
  const actions = useCompraActions(async () => {
    await list.fetchCompras(list.currentPage, list.filters);
  });
  const detail = useCompraDetail();

  return {
    ...list,
    ...actions,
    ...detail,
  };
}
