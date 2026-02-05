// src/modules/compras/hooks/useCompra.ts
import { useState, useEffect } from "react";
import type { Compra, CompraCreateInput, CompraUpdateInput } from "../types";


export const useCompras = () => {
  const [compras, setCompra] = useState<Compra[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);


  // ✅ DATOS DE EJEMPLO 100% COMPATIBLES CON TUS TIPOS
  useEffect(() => {
    if (compras.length === 0 && !loading) {
      setCompra([
        {
          id: 1,
          numero_factura: "FAC-2024-001",
          fecha: new Date().toISOString().split("T")[0],
          proveedor_id: 1,
          proveedor_nombre: "Distribuidora Alimentos S.A.",
          estado: "RECIBIDO",
          total: 250000,
          observaciones: "Compra de insumos básicos",
          items: [
            {
              id: 1,
              producto_id: 101,
              producto_nombre: "Arroz 5kg",
              cantidad: 10,
              precio_unitario: 25000,
              subtotal: 250000,
            },
          ],
        },
        {
          id: 2,
          numero_factura: "FAC-2024-002",
          fecha: new Date(Date.now() - 86400000).toISOString().split("T")[0],
          proveedor_id: 2,
          proveedor_nombre: "Bebidas del Valle Ltda.",
          estado: "PENDIENTE",
          total: 180000,
          observaciones: null,
          items: [
            {
              id: 2,
              producto_id: 102,
              producto_nombre: "Refresco 2L",
              cantidad: 12,
              precio_unitario: 15000,
              subtotal: 180000,
            },
          ],
        },
      ]);
      setCount(2);
    }
  }, [compras, loading]);

  // ✅ FUNCIONES TIPADAS CON TUS INTERFACES EXISTENTES
  const fetchCompras = async (params?: {
    page?: number;
    page_size?: number;
  }) => {
    console.log("fetchCompras", params);
  };

  const refresh = async () => {
    await fetchCompras();
  };

  const fetchCompra = async (id: number): Promise<Compra | null> => {
    setLoading(true);
    try {
      // TODO: Implementar llamada real al backend
      console.log("fetchCompra called with id:", id);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: CompraCreateInput): Promise<Compra | null> => {
    setLoading(true);
    try {
      // TODO: Implementar llamada real al backend
      console.log("create called with data:", data);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    id: number,
    data: CompraUpdateInput,
  ): Promise<Compra | null> => {
    setLoading(true);
    try {
      // TODO: Implementar llamada real al backend
      console.log("update called with id:", id, "and data:", data);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    setLoading(true);
    try {
      // TODO: Implementar llamada real al backend
      console.log("remove called with id:", id);
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
    remove,
    refresh,
  };
};
