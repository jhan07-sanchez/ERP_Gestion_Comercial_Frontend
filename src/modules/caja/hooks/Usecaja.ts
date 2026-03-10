import { useCajaList } from "./useCajaList";
import { useCajaActions } from "./useCajaActions";
import { useCajaDetail } from "./useCajaDetail";
import type { Caja } from "../types/Caja.types";

export function useCaja() {
  const list = useCajaList();

  const actions = useCajaActions(async (cajaActualizada) => {
    if (cajaActualizada) {
      list.setCajas((prev: Caja[]) =>
        prev.map((c: Caja) =>
          c.id === cajaActualizada.id ? (cajaActualizada as unknown as Caja) : c,
        ),
      );
    }
  });

  const detail = useCajaDetail();

  return {
    ...list,
    ...actions,
    ...detail,
  };
}
