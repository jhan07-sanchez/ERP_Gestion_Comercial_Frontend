/**
 * API del módulo Inventario/Productos
 * Centraliza todas las llamadas al backend relacionadas con productos e inventario
 */

import axiosInstance from '@/api/axios';
import type {
  Producto,
  ProductoList,
  ProductoCreateInput,
  ProductoUpdateInput,
  MovimientoInventario,
  MovimientoInventarioCreateInput,
  AjusteInventario,
  Categoria,
  Inventario,
  ProductoFilters,
  PaginatedResponse,
} from '../types';

const API_BASE = '/inventario';

export const productosAPI = {
  /**
   * PRODUCTOS - Endpoints principales
   */

  /**
   * Obtiene el listado de productos con filtros opcionales
   * GET /api/inventario/productos/
   */
  getProductos: async (filters?: ProductoFilters, page = 1): Promise<PaginatedResponse<ProductoList>> => {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.categoria_id) params.append('categoria_id', String(filters.categoria_id));
      if (filters.categoria) params.append('categoria', filters.categoria);
      if (filters.estado !== undefined) params.append('estado', String(filters.estado));
      if (filters.precio_min) params.append('precio_min', String(filters.precio_min));
      if (filters.precio_max) params.append('precio_max', String(filters.precio_max));
    }

    params.append('page', String(page));

    const response = await axiosInstance.get(`${API_BASE}/productos/`, { params });
    return response.data;
  },

  /**
   * Obtiene los detalles de un producto específico
   * GET /api/inventario/productos/{id}/
   */
  getProducto: async (id: number): Promise<Producto> => {
    const response = await axiosInstance.get(`${API_BASE}/productos/${id}/`);
    return response.data;
  },

  /**
   * Crea un nuevo producto
   * POST /api/inventario/productos/
   */
  createProducto: async (data: ProductoCreateInput): Promise<Producto> => {
    console.log('📤 Enviando datos a crear producto:', data);
    const response = await axiosInstance.post(`${API_BASE}/productos/`, data);
    return response.data;
  },

  /**
   * Actualiza un producto (actualización parcial)
   * PATCH /api/inventario/productos/{id}/
   */
  updateProducto: async (id: number, data: ProductoUpdateInput): Promise<Producto> => {
    const response = await axiosInstance.patch(`${API_BASE}/productos/${id}/`, data);
    return response.data;
  },

  /**
   * Elimina un producto
   * DELETE /api/inventario/productos/{id}/
   */
  deleteProducto: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE}/productos/${id}/`);
  },

  /**
   * PRODUCTOS - Acciones especiales
   */

  /**
   * Obtiene productos con stock bajo
   * GET /api/inventario/productos/stock_bajo/
   */
  getProductosStockBajo: async (): Promise<{ count: number; productos: ProductoList[] }> => {
    const response = await axiosInstance.get(`${API_BASE}/productos/stock_bajo/`);
    return response.data;
  },

  /**
   * Activa un producto
   * POST /api/inventario/productos/{id}/activar/
   */
  activarProducto: async (id: number): Promise<{ detail: string; producto: Producto }> => {
    const response = await axiosInstance.post(`${API_BASE}/productos/${id}/activar/`);
    return response.data;
  },

  /**
   * Desactiva un producto
   * POST /api/inventario/productos/{id}/desactivar/
   */
  desactivarProducto: async (id: number): Promise<{ detail: string; producto: Producto }> => {
    const response = await axiosInstance.post(`${API_BASE}/productos/${id}/desactivar/`);
    return response.data;
  },

  /**
   * Obtiene el historial de movimientos de un producto
   * GET /api/inventario/productos/{id}/movimientos/
   */
  getMovimientosProducto: async (
    id: number,
    filters?: { tipo?: string; fecha_inicio?: string; fecha_fin?: string }
  ): Promise<{ producto: string; total_movimientos: number; movimientos: MovimientoInventario[] }> => {
    const params = new URLSearchParams();
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
    if (filters?.fecha_fin) params.append('fecha_fin', filters.fecha_fin);

    const response = await axiosInstance.get(`${API_BASE}/productos/${id}/movimientos/`, { params });
    return response.data;
  },

  /**
   * Obtiene estadísticas del producto
   * GET /api/inventario/productos/{id}/estadisticas/
   */
  getEstadisticasProducto: async (id: number): Promise<Record<string, unknown>> => {
    const response = await axiosInstance.get(`${API_BASE}/productos/${id}/estadisticas/`);
    return response.data;
  },

  /**
   * Ajusta el stock manualmente
   * POST /api/inventario/productos/{id}/ajustar_stock/
   */
  ajustarStock: async (
    id: number,
    data: AjusteInventario
  ): Promise<{
    detail: string;
    stock_anterior: number;
    stock_nuevo: number;
    movimiento: MovimientoInventario;
  }> => {
    const response = await axiosInstance.post(`${API_BASE}/productos/${id}/ajustar_stock/`, data);
    return response.data;
  },

  /**
   * CATEGORÍAS
   */

  /**
   * Obtiene el listado de categorías
   * GET /api/inventario/categorias/
   */
  getCategorias: async (): Promise<Categoria[]> => {
    const response = await axiosInstance.get(`${API_BASE}/categorias/`);
    // Si la respuesta es un objeto con propiedad 'results' (paginado), usa eso
    // Si es un array directo, usa el array
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  /**
   * Obtiene una categoría específica
   * GET /api/inventario/categorias/{id}/
   */
  getCategoria: async (id: number): Promise<Categoria> => {
    const response = await axiosInstance.get(`${API_BASE}/categorias/${id}/`);
    return response.data;
  },

  /**
   * INVENTARIO - Solo lectura
   */

  /**
   * Obtiene el listado de inventarios
   * GET /api/inventario/inventarios/
   */
  getInventarios: async (filters?: {
    stock_bajo?: boolean;
    categoria?: string;
    solo_activos?: boolean;
  }): Promise<Inventario[]> => {
    const params = new URLSearchParams();
    if (filters?.stock_bajo) params.append('stock_bajo', 'true');
    if (filters?.categoria) params.append('categoria', filters.categoria);
    if (filters?.solo_activos) params.append('solo_activos', 'true');

    const response = await axiosInstance.get(`${API_BASE}/inventarios/`, { params });
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  /**
   * Obtiene las estadísticas generales del inventario
   * GET /api/inventario/inventarios/estadisticas/
   */
  getEstadisticasInventario: async (): Promise<Record<string, unknown>> => {
    const response = await axiosInstance.get(`${API_BASE}/inventarios/estadisticas/`);
    return response.data;
  },

  /**
   * MOVIMIENTOS DE INVENTARIO
   */

  /**
   * Obtiene el listado de movimientos
   * GET /api/inventario/movimientos/
   */
  getMovimientos: async (filters?: {
    producto_id?: number;
    tipo?: string;
    referencia?: string;
    usuario_id?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
  }): Promise<PaginatedResponse<MovimientoInventario>> => {
    const params = new URLSearchParams();
    if (filters?.producto_id) params.append('producto_id', String(filters.producto_id));
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.referencia) params.append('referencia', filters.referencia);
    if (filters?.usuario_id) params.append('usuario_id', String(filters.usuario_id));
    if (filters?.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
    if (filters?.fecha_fin) params.append('fecha_fin', filters.fecha_fin);

    const response = await axiosInstance.get(`${API_BASE}/movimientos/`, { params });
    return response.data;
  },

  /**
   * Registra un nuevo movimiento de inventario
   * POST /api/inventario/movimientos/
   */
  createMovimiento: async (
    data: MovimientoInventarioCreateInput
  ): Promise<{
    detail: string;
    movimiento: MovimientoInventario;
    stock_actual: number;
  }> => {
    const response = await axiosInstance.post(`${API_BASE}/movimientos/`, data);
    return response.data;
  },

  /**
   * Obtiene el resumen de movimientos
   * GET /api/inventario/movimientos/resumen/
   */
  getResumenMovimientos: async (filters?: {
    fecha_inicio?: string;
    fecha_fin?: string;
  }): Promise<Record<string, unknown>> => {
    const params = new URLSearchParams();
    if (filters?.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
    if (filters?.fecha_fin) params.append('fecha_fin', filters.fecha_fin);

    const response = await axiosInstance.get(`${API_BASE}/movimientos/resumen/`, { params });
    return response.data;
  },
};
