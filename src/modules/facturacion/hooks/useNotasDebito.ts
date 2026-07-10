import { useState, useCallback } from 'react';
import { notasDebitoAPI } from '../api';
import type { NotaDebito, NotasDebitoFilters } from '../types/notaDebito.types';
import { useAlert } from '@/shared/components/alerts';
import { isAxiosError } from 'axios';

export function useNotasDebito() {
  const [notas, setNotas] = useState<NotaDebito[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();

  const fetchNotas = useCallback(async (filters?: NotasDebitoFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notasDebitoAPI.getNotas(filters);
      setNotas(data.results || (data as unknown as NotaDebito[]));
    } catch (err: unknown) {
      const msg = isAxiosError(err)
        ? err.response?.data?.detail || 'Error al cargar notas de débito'
        : err instanceof Error ? err.message : 'Error al cargar notas de débito';
      setError(msg);
      showAlert('Error', 'error', { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  const applyFilters = useCallback((filters: NotasDebitoFilters) => {
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
