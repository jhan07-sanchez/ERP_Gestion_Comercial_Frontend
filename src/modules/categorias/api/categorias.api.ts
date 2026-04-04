import axiosInstance from "@/shared/api/axios";
import type { Categoria, CategoriaCreateInput, CategoriaUpdateInput } from "../types";

const API_BASE = "/categorias/categorias";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const categoriasAPI = {
  /**
   * 📋 Obtener todas las categorías con paginación
   * @returns Array de categorías
   */
  getCategorias: async (): Promise<Categoria[]> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Categoria>>(
      `${API_BASE}/`,
    );
    return data.results;
  },

  /**
   * 🔍 Obtener una categoría por ID
   * @param id - ID de la categoría
   * @returns Categoría específica
   */
  getCategoria: async (id: number): Promise<Categoria> => {
    const { data } = await axiosInstance.get<Categoria>(`${API_BASE}/${id}/`);
    return data;
  },

  /**
   * ➕ Crear nueva categoría
   * @param categoria - Datos de la categoría a crear
   * @returns Categoría creada con ID
   */
  createCategoria: async (
    categoria: CategoriaCreateInput,
  ): Promise<Categoria> => {
    const { data } = await axiosInstance.post<Categoria>(
      `${API_BASE}/`,
      categoria,
    );
    return data;
  },

  /**
   * ✏️ Actualizar categoría existente
   * @param id - ID de la categoría
   * @param categoria - Datos a actualizar (parcial)
   * @returns Categoría actualizada
   */
  updateCategoria: async (
    id: number,
    categoria: CategoriaUpdateInput,
  ): Promise<Categoria> => {
    const { data } = await axiosInstance.put<Categoria>(
      `${API_BASE}/${id}/`,
      categoria,
    );
    return data;
  },

  /**
   * 🗑️ Eliminar categoría
   * @param id - ID de la categoría a eliminar
   */
  deleteCategoria: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE}/${id}/`);
  },

  /**
   * 🔄 Activar categoría
   * @param id - ID de la categoría
   * @returns Categoría activada
   */
  activateCategoria: async (id: number): Promise<Categoria> => {
    return categoriasAPI.updateCategoria(id, { estado: true });
  },

  /**
   * ⏸️ Desactivar categoría
   * @param id - ID de la categoría
   * @returns Categoría desactivada
   */
  deactivateCategoria: async (id: number): Promise<Categoria> => {
    return categoriasAPI.updateCategoria(id, { estado: false });
  },
};
