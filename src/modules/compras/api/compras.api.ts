import axiosInstance from "@/api/axios";
import type { Compra } from "../types/compra.types";

const API_URL = "/api/compras";

/**
 * 📦 Obtener lista de compras
 */
export const getCompras = async (): Promise<Compra[]> => {
  const response = await axiosInstance.get<Compra[]>(API_URL);
  return response.data;
};

/**
 * 📄 Obtener una compra por ID
 */
export const getCompraById = async (id: number): Promise<Compra> => {
  const response = await axiosInstance.get<Compra>(`${API_URL}/${id}/`);
  return response.data;
};

/**
 * ➕ Crear compra
 */
export const createCompra = async (data: Compra): Promise<Compra> => {
  const response = await axiosInstance.post<Compra>(API_URL, data);
  return response.data;
};

/**
 * ✏️ Actualizar compra
 */
export const updateCompra = async (
  id: number,
  data: Compra,
): Promise<Compra> => {
  const response = await axiosInstance.put<Compra>(`${API_URL}/${id}/`, data);
  return response.data;
};

/**
 * 🗑️ Eliminar compra
 */
export const deleteCompra = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/${id}/`);
};
