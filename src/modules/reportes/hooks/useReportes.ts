import { useQuery } from '@tanstack/react-query';
import { reportesAPI } from '../api/reportes.api';
import type { ReportFilterOptions } from '../types/reportes.types';

export function useEstadoResultados(filtros?: ReportFilterOptions) {
  return useQuery({
    queryKey: ['reportes', 'estado-resultados', filtros],
    queryFn: () => reportesAPI.getEstadoResultados(filtros),
    staleTime: 60000,
  });
}

export function useBalanceGeneral(filtros?: ReportFilterOptions) {
  return useQuery({
    queryKey: ['reportes', 'balance-general', filtros],
    queryFn: () => reportesAPI.getBalanceGeneral(filtros),
    staleTime: 60000,
  });
}
