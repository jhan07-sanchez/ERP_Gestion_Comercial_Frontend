import { useState, useCallback } from "react";
import { productosAPI } from "../api/productos.api";
import type {
  Producto,
  ProductoCreateInput,
  ProductoUpdateInput,
} from "../types";

export function useProductoActions(onRefresh?: () => Promise<void>) {
  const [error, setError] = useState<string | null>(null);

  // helper seguro
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    return "Error inesperado";
  };

  const getProducto = useCallback(async (id: number): Promise<Producto> => {
    try {
      return await productosAPI.getProducto(id);
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const createProducto = useCallback(
    async (data: ProductoCreateInput): Promise<Producto> => {
      try {
        const producto = await productosAPI.createProducto(data);

        console.log("Producto creado correctamente:", producto);

        await onRefresh?.();

        return producto; // ✅ CORRECTO
      } catch (err: unknown) {
        const msg = getErrorMessage(err);
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
      } catch (err: unknown) {
        const msg = getErrorMessage(err);
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
      } catch (err: unknown) {
        const msg = getErrorMessage(err);
        setError(msg);
        throw new Error(msg);
      }
    },
    [onRefresh],
  );

  const activarProducto = useCallback(
    async (id: number) => {
      try {
        await productosAPI.activarProducto(id);
        await onRefresh?.();
      } catch (err: unknown) {
        const msg = getErrorMessage(err);
        setError(msg);
        throw new Error(msg);
      }
    },
    [onRefresh],
  );

  const desactivarProducto = useCallback(
    async (id: number) => {
      try {
        await productosAPI.desactivarProducto(id);
        await onRefresh?.();
      } catch (err: unknown) {
        const msg = getErrorMessage(err);
        setError(msg);
        throw new Error(msg);
      }
    },
    [onRefresh],
  );

  const getSiguienteCodigo = useCallback(async (): Promise<string> => {
    try {
      const response = await productosAPI.getSiguienteCodigo();
      return response.codigo;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  return {
    error,
    getProducto,
    createProducto,
    updateProducto,
    deleteProducto,
    activarProducto,
    desactivarProducto,
    getSiguienteCodigo,
  };
}
