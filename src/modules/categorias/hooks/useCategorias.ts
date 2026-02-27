import { useState, useCallback } from "react";
import { categoriasAPI } from "../api/categorias.api";
import type { Categoria, CategoriaCreateInput } from "../types";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      return err.message;
    }
    return "Error inesperado";
  };

  const fetchCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoriasAPI.getCategorias();
      setCategorias(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategoria = useCallback(
    async (data: CategoriaCreateInput) => {
      setIsLoading(true);
      setError(null);
      try {
        await categoriasAPI.createCategoria(data);
        await fetchCategorias();
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCategorias],
  );

  const deleteCategoria = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await categoriasAPI.deleteCategoria(id);
        await fetchCategorias();
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCategorias],
  );

  return {
    categorias,
    isLoading,
    error,
    fetchCategorias,
    createCategoria,
    deleteCategoria,
  };
}
