import type {
  MovimientoFinanciero,
  ReportFilterOptions,
  BalanceGeneralData,
} from "../types/reportes.types";
import type { AnalyticsData } from "../types/analytics.types";
import axiosInstance from "@/shared/api/axios";

export interface AnalyticsFilters {
  rango: "7d" | "30d" | "90d" | "ytd";
  sucursal?: number;
  caja?: number;
  vendedor?: number;
}

export const reportesAPI = {
  getAnalyticsData: async (filtros: AnalyticsFilters): Promise<AnalyticsData> => {
    const response = await axiosInstance.get("/dashboard/analytics/", {
      params: filtros,
    });
    return response.data.data;
  },

  getEstadoResultados: async (
    filtros?: ReportFilterOptions,
  ): Promise<MovimientoFinanciero[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    let data: MovimientoFinanciero[] = [
      {
        id: "1",
        fecha: "2023-10-01",
        concepto: "Venta de mercadería A",
        tipo: "ingreso",
        monto: 50000,
        categoria: "VENTA",
      },
      {
        id: "2",
        fecha: "2023-10-02",
        concepto: "Venta de mercadería B",
        tipo: "ingreso",
        monto: 35000,
        categoria: "VENTA",
      },
      {
        id: "3",
        fecha: "2023-10-05",
        concepto: "Compra a Proveedor X",
        tipo: "egreso",
        monto: 30000,
        categoria: "COSTO_VENTA",
      },
      {
        id: "4",
        fecha: "2023-10-15",
        concepto: "Pago de alquiler",
        tipo: "egreso",
        monto: 5000,
        categoria: "GASTO_ADMIN",
      },
      {
        id: "5",
        fecha: "2023-10-20",
        concepto: "Pago de nómina",
        tipo: "egreso",
        monto: 12000,
        categoria: "GASTO_ADMIN",
      },
      {
        id: "6",
        fecha: "2023-10-28",
        concepto: "Impuesto mensual",
        tipo: "egreso",
        monto: 4500,
        categoria: "IMPUESTO",
      },
    ];

    // 🔍 FILTRO POR TIPO (ingreso / egreso)
    if (filtros?.tipo) {
      data = data.filter((item) => item.tipo === filtros.tipo);
    }

    // 🔍 FILTRO POR CATEGORÍA
    if (filtros?.categoria) {
      data = data.filter((item) => item.categoria === filtros.categoria);
    }

    // 🔍 FILTRO POR FECHA DESDE
    if (filtros?.fechaDesde) {
      data = data.filter((item) => item.fecha >= filtros.fechaDesde!);
    }

    // 🔍 FILTRO POR FECHA HASTA
    if (filtros?.fechaHasta) {
      data = data.filter((item) => item.fecha <= filtros.fechaHasta!);
    }

    return data;
  },

  getBalanceGeneral: async (
    filtros?: ReportFilterOptions,
  ): Promise<BalanceGeneralData> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Uso de filtros para evitar warning (mock API)
    void filtros;

    return {
      activos: { corrientes: 120000, noCorrientes: 350000 },
      pasivos: { corrientes: 45000, noCorrientes: 120000 },
      patrimonio: 305000,
    };
  },
};
