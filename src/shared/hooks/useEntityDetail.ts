/**
 * 📦 HOOK GENÉRICO: useEntityDetail<T>
 *
 * Hook reutilizable para obtener el detalle de una entidad por ID.
 * Elimina la duplicación de useVentaDetail, useCompraDetail, useClienteDetail, etc.
 *
 * @example
 * const { entity, isLoading, fetchEntity } = useEntityDetail<VentaDetail>({
 *   fetchFn: (id) => ventasAPI.getVenta(id),
 *   entityName: "venta",
 * });
 */

import { useState, useCallback } from "react";

interface UseEntityDetailOptions<T> {
  /** Función que ejecuta la llamada API para obtener el detalle */
  fetchFn: (id: number) => Promise<T>;
  /** Nombre de la entidad para mensajes de error */
  entityName: string;
}

interface UseEntityDetailReturn<T> {
  entity: T | null;
  isLoading: boolean;
  error: string | null;
  fetchEntity: (id: number) => Promise<T | null>;
}

export function useEntityDetail<T>({
  fetchFn,
  entityName,
}: UseEntityDetailOptions<T>): UseEntityDetailReturn<T> {
  const [entity, setEntity] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntity = useCallback(
    async (id: number): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchFn(id);
        setEntity(data);
        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : `Error al cargar ${entityName}`;
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFn, entityName],
  );

  return {
    entity,
    isLoading,
    error,
    fetchEntity,
  };
}
