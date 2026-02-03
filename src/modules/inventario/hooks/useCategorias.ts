/**
 * Hook para gestionar categorías de productos
 * Centraliza carga, estado y errores
 */

import { useEffect, useState } from "react";
import { categoriasAPI } from "../api";
import type { Categoria } from "../types";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCategorias = async () => {
      try {
        const data = await categoriasAPI.getCategorias();
        if (isMounted) {
          setCategorias(data ?? []);
        }
      } catch (err) {
        console.error("Error cargando categorías:", err);
        if (isMounted) {
          setError("No se pudieron cargar las categorías");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCategorias();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    categorias,
    isLoading,
    error,
  };
}
