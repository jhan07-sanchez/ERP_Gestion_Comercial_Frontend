import { useProductosList } from "./useProductosList";
import { useProductoActions } from "./useProductoActions";
import { useProductosStock } from "./useProductosStock";

export function useProductos() {
  const list = useProductosList();

  const actions = useProductoActions(async () => {
    await list.fetchProductos(list.currentPage, list.filters);
  });

  const stock = useProductosStock();

  return {
    ...list,
    ...actions,
    ...stock,
  };
}
