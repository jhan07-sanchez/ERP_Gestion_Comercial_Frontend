/**
 * 🪝 useCompraActions (VERSIÓN MEJORADA)
 *
 * Hook para acciones CRUD de compras
 *
 * MEJORAS IMPLEMENTADAS:
 * ✅ Retorna la compra creada/actualizada
 * ✅ Invalidación de cache automática
 * ✅ Mejor manejo de errores con tipos
 * ✅ Loading state por operación
 * ✅ Mensajes de error descriptivos
 */

import { useState } from "react";
import { comprasAPI } from "../api/compras.api";
import type { AxiosError } from "axios";
import type { Compra, CompraCreateInput, CompraUpdateInput } from "../types";



interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

export function useCompraActions(onSuccess?: () => Promise<void>) {
  // Estados separados para cada operación
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /**
   * Crear nueva compra
   *
   * @param data - Datos de la compra
   * @returns Compra creada o null si hay error
   */
  const createCompra = async (
    data: CompraCreateInput,
  ): Promise<Compra | null> => {
    try {
      setLoadingCreate(true);
      setError(null);
      console.log(JSON.stringify(data, null, 2));

      // Enviar directamente al API
      const newCompra = await comprasAPI.createCompra(data);

        console.log("✅ [useCompraActions] Compra creada:", newCompra);

      if (onSuccess) {
        await onSuccess();
      }

      return newCompra;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;

      let errorMessage = "Error al crear la compra";

      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      setError(errorMessage);
      return null;
    } finally {
      setLoadingCreate(false);
    }
  };


  /**
   * Actualizar compra existente
   *
   * @param id - ID de la compra
   * @param data - Datos a actualizar
   * @returns Compra actualizada o null si hay error
   */
  const updateCompra = async (
    id: number,
    data: CompraUpdateInput,
  ): Promise<Compra | null> => {
    try {
      setLoadingUpdate(true);
      setError(null);

      console.log(`📡 [useCompraActions] Actualizando compra ${id}...`, data);

      // Llamar al API
      const updatedCompra = await comprasAPI.updateCompra(id, data);

      console.log("✅ [useCompraActions] Compra actualizada:", updatedCompra);

      // Invalidar cache - recargar lista
      if (onSuccess) {
        console.log("🔄 [useCompraActions] Invalidando cache...");
        await onSuccess();
      }

      return updatedCompra;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;

      let errorMessage = "Error al actualizar la compra";

      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      setError(errorMessage);
      console.error("❌ [useCompraActions] Error actualizando compra:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: errorMessage,
      });

      return null;
    } finally {
      setLoadingUpdate(false);
    }
  };

  /**
   * Eliminar compra
   *
   * @param id - ID de la compra a eliminar
   * @returns true si fue exitoso
   */
  const deleteCompra = async (id: number): Promise<boolean> => {
    try {
      setLoadingDelete(true);
      setError(null);

      console.log(`📡 [useCompraActions] Eliminando compra ${id}...`);

      // Llamar al API
      await comprasAPI.deleteCompra(id);

      console.log("✅ [useCompraActions] Compra eliminada");

      // Invalidar cache - recargar lista
      if (onSuccess) {
        console.log("🔄 [useCompraActions] Invalidando cache...");
        await onSuccess();
      }

      return true;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;

      let errorMessage = "Error al eliminar la compra";

      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      setError(errorMessage);
      console.error("❌ [useCompraActions] Error eliminando compra:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: errorMessage,
      });

      return false;
    } finally {
      setLoadingDelete(false);
    }
  };

  // Estado de loading consolidado (cualquier operación en curso)
  const loading = loadingCreate || loadingUpdate || loadingDelete;

  return {
    createCompra,
    updateCompra,
    deleteCompra,
    loading,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    error,
  };
}
