import { useState, useCallback } from "react";
import { categoriasAPI } from "../api/categorias.api";
import type { Categoria, CategoriaCreateInput, CategoriaUpdateInput } from "../types";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 🛠️ Convierte errores a mensajes legibles
   */
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      return err.message;
    }
    return "Error inesperado al procesar la solicitud";
  };

  /**
   * 📋 Obtener todas las categorías
   */
  const fetchCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoriasAPI.getCategorias();
      setCategorias(data);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      console.error("Error al cargar categorías:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * ➕ Crear nueva categoría
   */
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

  /**
   * ✏️ Actualizar categoría
   */
  const updateCategoria = useCallback(
    async (id: number, data: CategoriaUpdateInput) => {
      setIsLoading(true);
      setError(null);
      try {
        await categoriasAPI.updateCategoria(id, data);
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

  /**
   * 🗑️ Eliminar categoría
   */
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

  /**
   * 🔄 Activar categoría
   */
  const activateCategoria = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await categoriasAPI.createCategoria(id as unknown as CategoriaCreateInput);
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

  /**
   * ⏸️ Desactivar categoría
   */
  const deactivateCategoria = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await categoriasAPI.deactivateCategoria(id);
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
    // Estados
    categorias,
    isLoading,
    error,
    // Métodos
    fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    activateCategoria,
    deactivateCategoria,
  };
}
