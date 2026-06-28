import { useQuery } from "@tanstack/react-query";
import { dashboardFacturacionAPI } from "../api/dashboard.api";
import type {
  DashboardResumen,
  CuentaPorCobrar,
} from "../types";

export function useDashboardFacturacion() {
  const {
    data: resumen,
    isLoading: loadingResumen,
    refetch: refreshResumen,
  } = useQuery<DashboardResumen>({
    queryKey: ["dashboardFacturacionResumen"],
    queryFn: dashboardFacturacionAPI.getResumen,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const {
    data: cuentas = [],
    isLoading: loadingCuentas,
    refetch: refreshCuentas,
  } = useQuery<CuentaPorCobrar[]>({
    queryKey: ["dashboardFacturacionCuentas"],
    queryFn: dashboardFacturacionAPI.getCuentasPorCobrar,
    staleTime: 5 * 60 * 1000,
  });

  const loading = loadingResumen || loadingCuentas;

  const refresh = () => {
    refreshResumen();
    refreshCuentas();
  };

  return {
    resumen: resumen ?? null,
    cuentas,
    loading,
    refresh,
  };
}
