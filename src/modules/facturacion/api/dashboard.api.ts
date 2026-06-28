import axiosInstance from "@/shared/api/axios";

import type {
  DashboardResumen,
  VentaMensual,
  TopCliente,
  TopProducto,
  CuentaPorCobrar,
} from "../types";


const API_BASE = "/facturacion/dashboard";

export const dashboardFacturacionAPI = {
  getResumen: async (): Promise<DashboardResumen> => {
    const response = await axiosInstance.get(`${API_BASE}/resumen/`);

    return response.data;
  },

  getVentasMensuales: async (): Promise<VentaMensual[]> => {
    const response = await axiosInstance.get(`${API_BASE}/ventas-mensuales/`);

    return response.data;
  },

  getTopClientes: async (): Promise<TopCliente[]> => {
    const response = await axiosInstance.get(`${API_BASE}/top-clientes/`);

    return response.data;
  },

  getTopProductos: async (): Promise<TopProducto[]> => {
    const response = await axiosInstance.get(`${API_BASE}/top-productos/`);

    return response.data;
  },

  getCuentasPorCobrar: async (): Promise<CuentaPorCobrar[]> => {
    const response = await axiosInstance.get(`${API_BASE}/cuentas-por-cobrar/`);

    return response.data;
  },
};
