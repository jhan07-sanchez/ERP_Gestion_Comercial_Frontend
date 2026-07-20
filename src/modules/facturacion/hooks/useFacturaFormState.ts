import { useState, useCallback } from 'react';
import type { FacturaFormState, FacturaDetalleFormState, ProductoParaFactura, ClienteParaFactura } from '../types';
import { FacturacionService } from '../services/facturacionService';
import { FacturaVentaSchema } from '../validators/facturacion.validator';
import { z } from 'zod';

interface UseFacturaFormProps {
  initialData?: Partial<FacturaFormState>;
  porcentajeImpuesto: number;
}

export function useFacturaFormState({ initialData, porcentajeImpuesto }: UseFacturaFormProps) {
  const [formData, setFormData] = useState<FacturaFormState>({
    cliente_id: initialData?.cliente_id || 0,
    vendedor_id: initialData?.vendedor_id,
    fecha_vencimiento: initialData?.fecha_vencimiento || new Date().toISOString().split("T")[0],
    observaciones: initialData?.observaciones || "",
    detalles: initialData?.detalles || [],
    subtotal: initialData?.subtotal || 0,
    descuento_total: initialData?.descuento_total || 0,
    impuestos_total: initialData?.impuestos_total || 0,
    total: initialData?.total || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const agregarProducto = useCallback((producto: ProductoParaFactura) => {
    setFormData(prev => {
      const indexExistente = prev.detalles.findIndex(d => d.producto_id === producto.id);
      const nuevosDetalles = [...prev.detalles];

      if (indexExistente >= 0) {
        const detalle = nuevosDetalles[indexExistente];
        const nuevaCantidad = Number(detalle.cantidad) + 1;
        nuevosDetalles[indexExistente] = {
          ...detalle,
          cantidad: nuevaCantidad,
          subtotal: FacturacionService.calcularSubtotalLinea(nuevaCantidad, detalle.precio_unitario, detalle.descuento)
        };
      } else {
        nuevosDetalles.push({
          id: crypto.randomUUID(),
          producto_id: producto.id,
          producto_codigo: producto.codigo,
          producto_nombre: producto.nombre,
          stock_disponible: producto.stock_actual,
          cantidad: 1,
          precio_unitario: Number(producto.precio_venta),
          descuento: 0,
          subtotal: FacturacionService.calcularSubtotalLinea(1, producto.precio_venta, 0),
        });
      }
      
      const totales = FacturacionService.calcularTotales(nuevosDetalles, porcentajeImpuesto);
      return {
        ...prev,
        detalles: nuevosDetalles,
        ...totales
      };
    });
  }, [porcentajeImpuesto]);

  const updateDetalle = useCallback((index: number, field: keyof FacturaDetalleFormState, value: string | number) => {
    setFormData(prev => {
      const nuevosDetalles = [...prev.detalles];
      const detalle = { ...nuevosDetalles[index], [field]: value };
      
      detalle.subtotal = FacturacionService.calcularSubtotalLinea(detalle.cantidad, detalle.precio_unitario, detalle.descuento);
      
      nuevosDetalles[index] = detalle;
      const totales = FacturacionService.calcularTotales(nuevosDetalles, porcentajeImpuesto);
      return {
        ...prev,
        detalles: nuevosDetalles,
        ...totales
      };
    });
  }, [porcentajeImpuesto]);

  const removeDetalle = useCallback((index: number) => {
    setFormData(prev => {
      const nuevosDetalles = prev.detalles.filter((_, i) => i !== index);
      const totales = FacturacionService.calcularTotales(nuevosDetalles, porcentajeImpuesto);
      return {
        ...prev,
        detalles: nuevosDetalles,
        ...totales
      };
    });
  }, [porcentajeImpuesto]);

  const setCliente = useCallback((cliente: ClienteParaFactura | null) => {
    setFormData(prev => ({ ...prev, cliente_id: cliente ? cliente.id : 0 }));
  }, []);

  const updateCampo = useCallback(<K extends keyof FacturaFormState>(campo: K, valor: FacturaFormState[K]) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  }, []);

  const validarFormulario = useCallback((): boolean => {
    try {
      FacturaVentaSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const nuevosErrores: Record<string, string> = {};
        error.issues.forEach((e) => {
          if (e.path.length > 0) {
            nuevosErrores[e.path.join(".")] = e.message;
          } else {
            nuevosErrores.root = e.message;
          }
        });
        setErrors(nuevosErrores);
      }
      return false;
    }
  }, [formData]);

  return {
    formData,
    errors,
    agregarProducto,
    updateDetalle,
    removeDetalle,
    setCliente,
    updateCampo,
    validarFormulario,
    setFormData
  };
}

