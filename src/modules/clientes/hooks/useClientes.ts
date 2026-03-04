import { useClientesList } from "./useClientesList";
import { useClienteActions } from "./useClienteActions";
import { useClienteDetail } from "./useClienteDetail";

export function useClientes() {
  const list = useClientesList();

  const actions = useClienteActions(async (clienteActualizado) => {
    if (clienteActualizado) {
      list.setClientes((prev) =>
        prev.map((c) =>
          c.id === clienteActualizado.id ? { ...c, ...clienteActualizado } : c,
        ),
      );
    }
  });

  const detail = useClienteDetail();

  return {
    ...list,
    ...actions,
    ...detail,
  };
}
