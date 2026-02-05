// proveedores/hooks/useProveedorActions.ts

import { useState } from "react";
import type { Proveedor, ProveedorFormData } from "../types/proveedor.types";
import { proveedoresApi } from "../api";

export const useProveedorActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Crear nuevo proveedor
  const createProveedor = async (
    data: ProveedorFormData,
  ): Promise<Proveedor | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const newProveedor = await proveedoresApi.create(data);
      setSuccess(true);
      return newProveedor;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear proveedor");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar proveedor existente
  const updateProveedor = async (
    id: number,
    data: ProveedorFormData,
  ): Promise<Proveedor | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const updatedProveedor = await proveedoresApi.update(id, data);
      setSuccess(true);
      return updatedProveedor;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar proveedor",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar proveedor
  const deleteProveedor = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await proveedoresApi.delete(id);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar proveedor",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Activar o desactivar proveedor
  const toggleActivoProveedor = async (
    id: number,
    activo: boolean,
  ): Promise<Proveedor | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const updatedProveedor = await proveedoresApi.toggleActivo(id, activo);
      setSuccess(true);
      return updatedProveedor;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cambiar estado del proveedor",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar mensajes de error y éxito
  const clearMessages = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    createProveedor,
    updateProveedor,
    deleteProveedor,
    toggleActivoProveedor,
    clearMessages,
  };
};
