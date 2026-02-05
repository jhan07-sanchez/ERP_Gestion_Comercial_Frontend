// proveedores/api/proveedores.api.ts

import type { Proveedor, ProveedorFormData } from "../types/proveedor.types";

// En Vite, las variables de entorno se acceden con import.meta.env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const proveedoresApi = {
  // Obtener todos los proveedores
  getAll: async (): Promise<Proveedor[]> => {
    const response = await fetch(`${API_URL}/proveedores/`);
    if (!response.ok) throw new Error("Error al obtener proveedores");
    return response.json();
  },

  // Obtener un proveedor por ID
  getById: async (id: number): Promise<Proveedor> => {
    const response = await fetch(`${API_URL}/proveedores/${id}/`);
    if (!response.ok) throw new Error("Error al obtener proveedor");
    return response.json();
  },

  // Crear nuevo proveedor
  create: async (data: ProveedorFormData): Promise<Proveedor> => {
    const response = await fetch(`${API_URL}/proveedores/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear proveedor");
    return response.json();
  },

  // Actualizar proveedor
  update: async (id: number, data: ProveedorFormData): Promise<Proveedor> => {
    const response = await fetch(`${API_URL}/proveedores/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar proveedor");
    return response.json();
  },

  // Eliminar proveedor
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/proveedores/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar proveedor");
  },

  // Activar/Desactivar proveedor
  toggleActivo: async (id: number, activo: boolean): Promise<Proveedor> => {
    const response = await fetch(`${API_URL}/proveedores/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ activo }),
    });
    if (!response.ok) throw new Error("Error al cambiar estado del proveedor");
    return response.json();
  },
};
