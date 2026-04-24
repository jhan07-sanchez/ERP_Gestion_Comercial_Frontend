// src/modules/precios/hooks/usePrecioActions.ts
import { preciosAPI } from "../api/precios.api";
import type { PrecioCreateInput, PrecioUpdateInput } from "../types/precio.types";

export function usePrecioActions(refresh: () => Promise<void>) {
  const createPrecio = async (data: PrecioCreateInput) => {
    try {
      await preciosAPI.create(data);
      await refresh();
    } catch (error) {
      console.error("Error creando precio:", error);
    }
  };

  const updatePrecio = async (id: number, data: PrecioUpdateInput) => {
    try {
      await preciosAPI.update(id, data);
      await refresh();
    } catch (error) {
      console.error("Error actualizando precio:", error);
    }
  };

  const deletePrecio = async (id: number) => {
    try {
      await preciosAPI.delete(id);
      await refresh();
    } catch (error) {
      console.error("Error eliminando precio:", error);
    }
  };

  return {
    createPrecio,
    updatePrecio,
    deletePrecio,
  };
}
