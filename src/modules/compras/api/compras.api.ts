// src/modules/compras/api/compras.api.ts
import axios from "axios";

const API_URL = "/api/compras";

export const createCompra = async (data: any) => {
  const response = await axios.post<Compra>(API_URL, data);
  return response.data;
};

export const getCompras = async (params: {
  page?: number;
  pageSize?: number;
  estado?: string;
}) => {
  const response = await axios.get<{
    results: Compra[];
    count: number;
  }>(API_URL, { params });
  return response.data;
};

export const getCompra = async (id: number) => {
  const response = await axios.get<Compra>(`${API_URL}/${id}`);
  return response.data;
};

export const updateCompra = async (id: number, data: any) => {
  const response = await axios.patch<Compra>(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteCompra = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
