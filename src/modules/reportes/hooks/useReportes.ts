import { useState, useCallback } from 'react';
import { reportesAPI } from '../api/reportes.api';
import type { 
  ReportFilterOptions
} from '../types/reportes.types';

export function useReportes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBalanceGeneral = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await reportesAPI.getBalanceGeneral();
    } catch (err) {
      console.error('BalanceGeneral Error:', err);
      setError('Error al cargar el Balance General');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEstadoResultados = useCallback(async (filtros?: ReportFilterOptions) => {
    setLoading(true);
    setError(null);
    try {
      return await reportesAPI.getEstadoResultados(filtros);
    } catch (err) {
      console.error('EstadoResultados Error:', err);
      setError('Error al cargar el Estado de Resultados');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFlujoCaja = useCallback(async (filtros?: ReportFilterOptions) => {
    setLoading(true);
    setError(null);
    try {
      return await reportesAPI.getFlujoCaja(filtros);
    } catch (err) {
      console.error('FlujoCaja Error:', err);
      setError('Error al cargar el Flujo de Caja');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductividad = useCallback(async (filtros?: ReportFilterOptions) => {
    setLoading(true);
    setError(null);
    try {
      return await reportesAPI.getProductividad(filtros);
    } catch (err) {
      console.error('Productividad Error:', err);
      setError('Error al cargar los datos de productividad');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProyecciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await reportesAPI.getProyecciones();
    } catch (err) {
      console.error('Proyecciones Error:', err);
      setError('Error al cargar las proyecciones');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getBalanceGeneral,
    getEstadoResultados,
    getFlujoCaja,
    getProductividad,
    getProyecciones
  };
}
