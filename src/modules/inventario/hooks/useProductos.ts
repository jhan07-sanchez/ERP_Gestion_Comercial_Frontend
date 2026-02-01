/**
 * Hook personalizado para gestionar productos
 * Maneja carga, errores, paginación y acciones CRUD
 */

import { useState, useCallback } from 'react';
import { productosAPI } from '../api/productos.api';
import type { Producto, ProductoList, ProductoCreateInput, ProductoUpdateInput, ProductoFilters, PaginatedResponse } from '../types';

export function useProductos() {
  const [productos, setProductos] = useState<ProductoList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<ProductoFilters>({});

  /**
   * Cargar listado de productos
   */
  const fetchProductos = useCallback(async (page = 1, currentFilters: ProductoFilters = filters) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse<ProductoList> = await productosAPI.getProductos(currentFilters, page);
      setProductos(response.results);
      setCurrentPage(page);
      setTotalCount(response.count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos';
      setError(errorMessage);
      console.error('Productos error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  /**
   * Obtener detalles de un producto
   */
  const getProducto = useCallback(async (id: number): Promise<Producto | null> => {
    try {
      return await productosAPI.getProducto(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener producto';
      console.error('Get producto error:', err);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Crear un nuevo producto
   */
  const createProducto = useCallback(async (data: ProductoCreateInput): Promise<Producto | null> => {
    setError(null);

    try {
      const newProducto = await productosAPI.createProducto(data);
      // Recargar lista
      await fetchProductos(1, filters);
      return newProducto;
    } catch (err) {
      let errorMessage = 'Error al crear producto';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      // Si es un error de axios con datos del servidor
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: unknown } };
        if (axiosErr.response?.data) {
          const errData = axiosErr.response.data;
          // Intenta extraer mensajes de validación
          if (typeof errData === 'object') {
            const messages = Object.entries(errData)
              .map(([key, value]) => `${key}: ${value}`)
              .join('; ');
            if (messages) errorMessage = messages;
          } else if (typeof errData === 'string') {
            errorMessage = errData;
          }
        }
      }
      
      setError(errorMessage);
      console.error('Create producto error:', err);
      throw new Error(errorMessage);
    }
  }, [fetchProductos, filters]);

  /**
   * Actualizar un producto
   */
  const updateProducto = useCallback(
    async (id: number, data: ProductoUpdateInput): Promise<Producto | null> => {
      setError(null);

      try {
        const updatedProducto = await productosAPI.updateProducto(id, data);
        // Recargar lista
        await fetchProductos(currentPage, filters);
        return updatedProducto;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al actualizar producto';
        setError(errorMessage);
        console.error('Update producto error:', err);
        throw new Error(errorMessage);
      }
    },
    [fetchProductos, currentPage, filters]
  );

  /**
   * Eliminar un producto
   */
  const deleteProducto = useCallback(
    async (id: number): Promise<void> => {
      setError(null);

      try {
        await productosAPI.deleteProducto(id);
        // Recargar lista
        await fetchProductos(currentPage, filters);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al eliminar producto';
        setError(errorMessage);
        console.error('Delete producto error:', err);
        throw new Error(errorMessage);
      }
    },
    [fetchProductos, currentPage, filters]
  );

  /**
   * Obtener productos con stock bajo
   */
  const getProductosStockBajo = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await productosAPI.getProductosStockBajo();
      return response.productos;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener productos con stock bajo';
      setError(errorMessage);
      console.error('Stock bajo error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Activar un producto
   */
  const activarProducto = useCallback(
    async (id: number): Promise<Producto | null> => {
      setError(null);

      try {
        const response = await productosAPI.activarProducto(id);
        await fetchProductos(currentPage, filters);
        return response.producto;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al activar producto';
        setError(errorMessage);
        console.error('Activar error:', err);
        throw new Error(errorMessage);
      }
    },
    [fetchProductos, currentPage, filters]
  );

  /**
   * Desactivar un producto
   */
  const desactivarProducto = useCallback(
    async (id: number): Promise<Producto | null> => {
      setError(null);

      try {
        const response = await productosAPI.desactivarProducto(id);
        await fetchProductos(currentPage, filters);
        return response.producto;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al desactivar producto';
        setError(errorMessage);
        console.error('Desactivar error:', err);
        throw new Error(errorMessage);
      }
    },
    [fetchProductos, currentPage, filters]
  );

  /**
   * Aplicar filtros y recargar
   */
  const applyFilters = useCallback(async (newFilters: ProductoFilters) => {
    setFilters(newFilters);
    await fetchProductos(1, newFilters);
  }, [fetchProductos]);

  /**
   * Cambiar página
   */
  const changePage = useCallback(
    (page: number) => {
      fetchProductos(page, filters);
    },
    [fetchProductos, filters]
  );

  return {
    // Estado
    productos,
    isLoading,
    error,
    currentPage,
    totalCount,
    filters,
    // Acciones
    fetchProductos,
    getProducto,
    createProducto,
    updateProducto,
    deleteProducto,
    getProductosStockBajo,
    activarProducto,
    desactivarProducto,
    applyFilters,
    changePage,
  };
}
