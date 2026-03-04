import axiosInstance from "@/shared/api/axios";
import type {
  Producto,
  ProductoList,
  ProductoCreateInput,
  ProductoUpdateInput,
  ProductoFilters,
  PaginatedResponse,
} from "../types";

const API_BASE = "productos/productos"; // ✅ Cambiado de /inventario/productos a /productos

export const productosAPI = {
  getProductos: async (
    filters?: ProductoFilters,
    page: number = 1,
  ): Promise<PaginatedResponse<ProductoList>> => {
    const params = new URLSearchParams();
    params.append("page", String(page));

    if (filters?.search) params.append("search", filters.search);
    if (filters?.categoria_id)
      params.append("categoria_id", String(filters.categoria_id));
    if (filters?.estado !== undefined)
      params.append("estado", String(filters.estado));
    if (filters?.precio_min)
      params.append("precio_min", String(filters.precio_min));
    if (filters?.precio_max)
      params.append("precio_max", String(filters.precio_max));

    const { data } = await axiosInstance.get<PaginatedResponse<ProductoList>>(
      `${API_BASE}/?${params.toString()}`,
    );
    return data;
  },

  getProducto: async (id: number): Promise<Producto> => {
    const { data } = await axiosInstance.get<Producto>(`${API_BASE}/${id}/`);
    return data;
  },

  createProducto: async (producto: ProductoCreateInput): Promise<Producto> => {
    const formData = new FormData();

    Object.entries(producto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const { data } = await axiosInstance.post<Producto>(
      `${API_BASE}/`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    console.log("Producto creado backend:", data);

    return data; // ✅ DIRECTO, SIN .data
  },

  updateProducto: async (
    id: number,
    producto: ProductoUpdateInput,
  ): Promise<Producto> => {
    const { data } = await axiosInstance.patch<Producto>(
      `${API_BASE}/${id}/`,
      producto,
    );
    return data;
  },

  deleteProducto: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE}/${id}/`);
  },

  getSiguienteCodigo: async (): Promise<{ codigo: string }> => {
    const { data } = await axiosInstance.get<{ codigo: string }>(
      `${API_BASE}/siguiente_codigo/`,
    );
    return data;
  },

  activarProducto: async (id: number): Promise<void> => {
    await axiosInstance.post(`${API_BASE}/${id}/activar/`);
  },

  desactivarProducto: async (id: number): Promise<void> => {
    await axiosInstance.post(`${API_BASE}/${id}/desactivar/`);
  },

  getStockBajo: async (): Promise<ProductoList[]> => {
    const { data } = await axiosInstance.get<ProductoList[]>(
      `${API_BASE}/stock_bajo/`,
    );
    return data;
  },
};
