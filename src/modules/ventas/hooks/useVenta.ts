import { useVentasList } from "./useVentasList";
import { useVentaActions } from "./useVentaActions";
import { useVentaDetail } from "./useVentaDetail";


export function useVentas() {
  const list = useVentasList();

  const actions = useVentaActions(async (ventaActualizada) => {
    if (ventaActualizada) {
      list.setVentas((prev) =>
        prev.map((v) =>
          v.id === ventaActualizada.id ? { ...v, ...ventaActualizada } : v,
        ),
      );
    }
  });

  const detail = useVentaDetail();

  return {
    ...list,
    ...actions,
    ...detail,
  };
}
