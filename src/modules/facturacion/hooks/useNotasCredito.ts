import { useState, useCallback } from 'react';
import { notasCreditoAPI } from '../api';
import type { NotaCredito, NotasCreditoFilters } from '../types/notaCredito.types';
import { useAlert } from '@/shared/components/alerts';
import { isAxiosError } from 'axios';

export function useNotasCredito() {
  const [notas, setNotas] = useState<NotaCredito[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();

  const fetchNotas = useCallback(async (filters?: NotasCreditoFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notasCreditoAPI.getNotas(filters);
      setNotas(data.results || (data as unknown as NotaCredito[]));
    } catch (err: unknown) {
      const msg = isAxiosError(err)
        ? err.response?.data?.detail || 'Error al cargar notas de crédito'
        : err instanceof Error ? err.message : 'Error al cargar notas de crédito';
      setError(msg);
      showAlert('Error', 'error', { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  const applyFilters = useCallback((filters: NotasCreditoFilters) => {
    fetchNotas(filters);
  }, [fetchNotas]);

  return {
    notas,
    isLoading,
    error,
    fetchNotas,
    applyFilters,
  };
}
