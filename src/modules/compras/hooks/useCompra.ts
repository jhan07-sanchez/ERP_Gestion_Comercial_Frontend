// src/modules/compras/hooks/useCompras.ts
import { useState, useEffect } from 'react';
import { 
  getCompras, 
  getCompra, 
  createCompra, 
  updateCompra,
  deleteCompra 
} from '../api/compras.api';
import { Compra, CompraCreateInput, CompraUpdateInput } from '../types';

export const useCompras = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [count, setCount] useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompras = async (params = {}) => {
    try {
      setLoading(true);
      const { results, count } = await getCompras(params);
      setCompras(results);
      setCount(count);
      setError(null);
    } catch (err) {
      setError('Error al cargar las compras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompra = async (id: number) => {
    try {
      setLoading(true);
      const compra = await getCompra(id);
      return compra;
    } catch (err) {
      setError('Error al cargar la compra');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: CompraCreateInput) => {
    try {
      setLoading(true);
      const nuevaCompra = await createCompra(data);
      setCompras(prev => [nuevaCompra, ...prev]);
      setCount(prev => prev + 1);
      return nuevaCompra;
    } catch (err) {
      setError('Error al crear la compra');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, data: CompraUpdateInput) => {
    try {
      setLoading(true);
      const compraActualizada = await updateCompra(id, data);
      setCompras(prev => 
        prev.map(c => c.id === id ? compraActualizada : c)
      );
      return compraActualizada;
    } catch (err) {
      setError('Error al actualizar la compra');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    try {
      setLoading(true);
      await deleteCompra(id);
      setCompras(prev => prev.filter(c => c.id !== id));
      setCount(prev => prev - 1);
    } catch (err) {
      setError('Error al eliminar la compra');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    compras,
    count,
    loading,
    error,
    fetchCompras,
    fetchCompra,
    create,
    update,
    remove
  };
};