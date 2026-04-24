import { usePreciosList } from "./usePreciosList";
import { usePrecioActions } from "./usePrecioActions";
import { useEffect } from "react";

export function usePrecios() {
  const {
    precios,
    loading,
    filters,
    setFilters,
    fetchPrecios, // 👈 ESTO faltaba o está mal
  } = usePreciosList();

  const actions = usePrecioActions(async () => {
    await fetchPrecios(filters);
  });

  useEffect(() => {
    fetchPrecios();
  }, [fetchPrecios]);

  return {
    precios,
    loading,
    filters,
    setFilters,
    fetchPrecios,
    ...actions,
  };
}
