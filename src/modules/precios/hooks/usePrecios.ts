import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { preciosAPI } from "../api/precios.api";
import type {
  PrecioFilters,
  PrecioCreateInput,
  PrecioUpdateInput,
} from "../types/precio.types";

export const PRECIOS_QUERY_KEY = ["precios"] as const;

export function usePreciosList(filters: PrecioFilters = {}) {
  return useQuery({
    queryKey: [...PRECIOS_QUERY_KEY, filters],
    queryFn: () => preciosAPI.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function usePrecioDetail(id: number) {
  return useQuery({
    queryKey: [...PRECIOS_QUERY_KEY, id],
    queryFn: () => preciosAPI.getById(id),
    enabled: !!id,
  });
}

export function usePrecioVigente(productoId?: number, proveedorId?: number) {
  return useQuery({
    queryKey: [...PRECIOS_QUERY_KEY, "vigente", productoId, proveedorId],
    queryFn: () =>
      productoId && proveedorId
        ? preciosAPI.getPrecioVigente(productoId, proveedorId)
        : null,
    enabled: !!productoId && !!proveedorId,
  });
}

export function useCreatePrecio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PrecioCreateInput) => preciosAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRECIOS_QUERY_KEY });
    },
  });
}

export function useUpdatePrecio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PrecioUpdateInput }) =>
      preciosAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRECIOS_QUERY_KEY });
    },
  });
}

export function useDeletePrecio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => preciosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRECIOS_QUERY_KEY });
    },
  });
}

// Deprecated/Adapter para no romper componentes aún no migrados si los hay.
// Recomiendo usar directamente los hooks individuales.
export function usePrecios(initialFilters: PrecioFilters = {}) {
  const query = usePreciosList(initialFilters);
  const deleteMutation = useDeletePrecio();
  const createMutation = useCreatePrecio();
  const updateMutation = useUpdatePrecio();

  return {
    precios: query.data?.results || [],
    loading: query.isLoading,
    error: query.isError ? "Error al cargar los precios" : null,
    fetchPrecios: query.refetch,
    createPrecio: createMutation.mutateAsync,
    updatePrecio: updateMutation.mutateAsync,
    deletePrecio: deleteMutation.mutateAsync,
  };
}
