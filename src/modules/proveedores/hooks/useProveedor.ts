import { useProveedorList } from "./useProveedorList";
import { useProveedorActions } from "./useProveedorActions";
import { useProveedorDetail } from "./useProveedorDetail";

export function useProveedor() {
  const list = useProveedorList();

  const actions = useProveedorActions(async () => {
    await list.fetchProveedores(list.currentPage, list.filters);
  });

  const detail = useProveedorDetail();

  return {
    ...list,
    ...actions,
    ...detail,
  };
}
