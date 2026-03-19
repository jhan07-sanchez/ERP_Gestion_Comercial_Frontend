/**
 * 🌐 API DEL MÓDULO CAJA
 * Patrón estandarizado igual que ventas.api.ts
 */

import axiosInstance from "@/shared/api/axios";
import type {
  Caja,
  SesionCaja,
  MetodoPago,
  MovimientoCaja,
  ArqueoCaja,
  CrearCajaInput,
  AbrirSesionInput,
  CerrarSesionInput,
  RegistrarMovimientoInput,
  RegistrarArqueoInput,
  FiltrosCaja,
  FiltrosSesion,
  FiltrosMovimiento,
  RespuestaMiSesion,
  PaginatedResponse,
} from "../types/Caja.types";

const CAJAS_API = "/caja/cajas";
const SESIONES_API = "/caja/sesiones";
const MOVIMIENTOS_API = "/caja/movimientos";
const METODOS_PAGO_API = "/caja/metodos-pago";

// ═══════════════════════════════════════════════════════════════
// CAJAS
// ═══════════════════════════════════════════════════════════════

export const cajaAPI = {
  getCajas: async (
    filters?: FiltrosCaja,
    page = 1,
  ): Promise<PaginatedResponse<Caja>> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.activa !== undefined)
      params.append("activa", String(filters.activa));

    params.append("page", String(page));

    const response = await axiosInstance.get(`${CAJAS_API}/`, { params });

    return response.data;
  },

  getCaja: async (id: number): Promise<Caja> => {
    const response = await axiosInstance.get(`${CAJAS_API}/${id}/`);

    return response.data;
  },

  crearCaja: async (input: CrearCajaInput): Promise<Caja> => {
    const response = await axiosInstance.post(`${CAJAS_API}/`, input);

    return response.data;
  },

  actualizarCaja: async (
    id: number,
    input: Partial<CrearCajaInput>,
  ): Promise<Caja> => {
    const response = await axiosInstance.patch(`${CAJAS_API}/${id}/`, input);

    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════
// SESIONES DE CAJA
// ═══════════════════════════════════════════════════════════════

export const sesionCajaAPI = {
  getSesiones: async (
    filters?: FiltrosSesion,
  ): Promise<PaginatedResponse<SesionCaja>> => {
    const params = new URLSearchParams();

    if (filters?.estado) params.append("estado", filters.estado);
    if (filters?.caja) params.append("caja", String(filters.caja));
    if (filters?.usuario) params.append("usuario", String(filters.usuario));
    if (filters?.fecha_inicio)
      params.append("fecha_inicio", filters.fecha_inicio);
    if (filters?.fecha_fin) params.append("fecha_fin", filters.fecha_fin);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size)
      params.append("page_size", String(filters.page_size));

    const response = await axiosInstance.get(`${SESIONES_API}/`, { params });

    return response.data;
  },

  getSesion: async (id: number): Promise<SesionCaja> => {
    const response = await axiosInstance.get(`${SESIONES_API}/${id}/`);

    return response.data;
  },

  getMiSesion: async (): Promise<RespuestaMiSesion> => {
    try {
      const response = await axiosInstance.get(`${SESIONES_API}/mi-sesion/`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };

      if (axiosError?.response?.status === 404) {
        return {
          sesion_activa: false,
          data: null,
        };
      }

      throw error;
    }
  },

  abrirSesion: async (input: AbrirSesionInput): Promise<SesionCaja> => {
    const montoInicial = typeof input.monto_inicial === 'string'
      ? parseFloat(input.monto_inicial)
      : input.monto_inicial;

    const response = await axiosInstance.post(`${SESIONES_API}/abrir/`, {
      caja_id: input.caja_id,
      monto_inicial: montoInicial,
      observaciones: input.observaciones || "",
    });

    return response.data;
  },

  cerrarSesion: async (
    id: number,
    input: CerrarSesionInput,
  ): Promise<SesionCaja> => {
    const response = await axiosInstance.post(`${SESIONES_API}/${id}/cerrar/`, {
      monto_contado: String(input.monto_contado),
      detalle_billetes: input.detalle_billetes || {},
      observaciones: input.observaciones || "",
    });

    return response.data;
  },

  getResumenSesion: async (id: number): Promise<Record<string, unknown>> => {
    const response = await axiosInstance.get(`${SESIONES_API}/${id}/resumen/`);

    return response.data;
  },

  registrarMovimiento: async (
    sesionId: number,
    input: RegistrarMovimientoInput,
  ): Promise<MovimientoCaja> => {
    const response = await axiosInstance.post(
      `${SESIONES_API}/${sesionId}/movimiento/`,
      {
        tipo: input.tipo,
        monto: String(input.monto),
        descripcion: input.descripcion,
        metodo_pago_id: input.metodo_pago_id,
      },
    );

    return response.data;
  },

  registrarArqueo: async (
    sesionId: number,
    input: RegistrarArqueoInput,
  ): Promise<ArqueoCaja> => {
    const response = await axiosInstance.post(
      `${SESIONES_API}/${sesionId}/arqueo/`,
      {
        monto_contado: String(input.monto_contado),
        detalle_billetes: input.detalle_billetes || {},
        observaciones: input.observaciones || "",
      },
    );

    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════
// MOVIMIENTOS
// ═══════════════════════════════════════════════════════════════

export const movimientosAPI = {
  getMovimientos: async (
    filters?: FiltrosMovimiento,
  ): Promise<PaginatedResponse<MovimientoCaja>> => {
    const params = new URLSearchParams();

    if (filters?.tipo) params.append("tipo", filters.tipo);
    if (filters?.sesion) params.append("sesion", String(filters.sesion));
    if (filters?.metodo_pago)
      params.append("metodo_pago", String(filters.metodo_pago));
    if (filters?.fecha_inicio)
      params.append("fecha_inicio", filters.fecha_inicio);
    if (filters?.fecha_fin) params.append("fecha_fin", filters.fecha_fin);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size)
      params.append("page_size", String(filters.page_size));

    const response = await axiosInstance.get(`${MOVIMIENTOS_API}/`, { params });

    return response.data;
  },

  getMovimiento: async (id: number): Promise<MovimientoCaja> => {
    const response = await axiosInstance.get(`${MOVIMIENTOS_API}/${id}/`);

    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════
// MÉTODOS DE PAGO
// ═══════════════════════════════════════════════════════════════

export const metodosPagoAPI = {
  getMetodosPago: async (): Promise<MetodoPago[]> => {
    const response = await axiosInstance.get(`${METODOS_PAGO_API}/`, {
      params: { activo: true },
    });

    return response.data;
  },

  getMetodoPago: async (id: number): Promise<MetodoPago> => {
    const response = await axiosInstance.get(`${METODOS_PAGO_API}/${id}/`);

    return response.data;
  },
};
