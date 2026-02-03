import { useState, useCallback } from "react";
import { productosAPI } from "../api";
import type {
  Producto,
  ProductoCreateInput,
  ProductoUpdateInput,
} from "../types";

export function useProductoActions(onRefresh?: () => Promise<void>) {
  const [error, setError] = useState<string | null>(null);

  const getProducto = useCallback(async (id: number): Promise<Producto> => {
    try {
      return await productosAPI.getProducto(id);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al obtener producto";
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const createProducto = useCallback(
    async (data: ProductoCreateInput): Promise<Producto> => {
      try {
        const producto = await productosAPI.createProducto(data);
        await onRefresh?.();
        return producto;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error al crear producto";
        setError(msg);
        throw new Error(msg);
      }
    },
    [onRefresh],
  );

  const updateProducto = useCallback(
    async (id: number, data: ProductoUpdateInput): Promise<Producto> => {
      try {
        const producto = await productosAPI.updateProducto(id, data);
        await onRefresh?.();
        return producto;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error al actualizar producto";
        setError(msg);
        throw new Error(msg);
      }
    },
    [onRefresh],
  );

  const deleteProducto = useCallback(
    async (id: number) => {
      try {
        await productosAPI.deleteProducto(id);
        await onRefresh?.();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error al eliminar producto";
        setError(msg);
        throw new Error(msg);
      }
    },
    [onRefresh],
  );

  const activarProducto = useCallback(
    async (id: number) => {
      const { producto } = await productosAPI.activarProducto(id);
      await onRefresh?.();
      return producto;
    },
    [onRefresh],
  );

  const desactivarProducto = useCallback(
    async (id: number) => {
      const { producto } = await productosAPI.desactivarProducto(id);
      await onRefresh?.();
      return producto;
    },
    [onRefresh],
  );

  return {
    error,
    getProducto,
    createProducto,
    updateProducto,
    deleteProducto,
    activarProducto,
    desactivarProducto,
  };
}
