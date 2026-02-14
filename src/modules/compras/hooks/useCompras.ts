import { useComprasList } from "./useComprasList";
import { useCompraActions } from "./useCompraActions";
import { useCompraDetail } from "./useCompraDetail";
import type { Compra } from "../types";


export function useCompras() {
  const list = useComprasList();
  const actions = useCompraActions(async (compraActualizada) => {
    if (compraActualizada) {
      list.setCompras((prev: Compra[]) =>
        prev.map((c: Compra) =>
          c.id === compraActualizada.id ? compraActualizada : c,
        ),
      );

    }
  });

  const detail = useCompraDetail();

  return {
    ...list,
    ...actions,
    ...detail,
  };
}
