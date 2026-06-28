import { useState } from 'react';
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

  const recalcularTotales = (nuevosDetalles: FacturaDetalleFormState[]) => {
    const totales = FacturacionService.calcularTotales(nuevosDetalles, porcentajeImpuesto);
    setFormData(prev => ({
      ...prev,
      detalles: nuevosDetalles,
      ...totales
    }));
  };

  const agregarProducto = (producto: ProductoParaFactura) => {
    const indexExistente = formData.detalles.findIndex(d => d.producto_id === producto.id);
    const nuevosDetalles = [...formData.detalles];

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
        id: crypto.randomUUID(), // Utilizado para React key rendering
        producto_id: producto.id,
        producto_codigo: producto.codigo,
        producto_nombre: producto.nombre,
        stock_disponible: producto.stock_actual,
        cantidad: 1,
        precio_unitario: Number(producto.precio_venta),
        descuento: 0,
        subtotal: FacturacionService.calcularSubtotalLinea(
          1,
          producto.precio_venta,
          0,
        ),
      });
    }

    recalcularTotales(nuevosDetalles);
  };

  const updateDetalle = (index: number, field: keyof FacturaDetalleFormState, value: string | number) => {
    console.log("FIELD:", field, "VALUE:", value, "TYPE:", typeof value);
    const nuevosDetalles = [...formData.detalles];
    const detalle = { ...nuevosDetalles[index], [field]: value };
    
    detalle.subtotal = FacturacionService.calcularSubtotalLinea(detalle.cantidad, detalle.precio_unitario, detalle.descuento);
    
    nuevosDetalles[index] = detalle;
    recalcularTotales(nuevosDetalles);
  };

  const removeDetalle = (index: number) => {
    const nuevosDetalles = formData.detalles.filter((_, i) => i !== index);
    recalcularTotales(nuevosDetalles);
  };

  const setCliente = (cliente: ClienteParaFactura | null) => {
    setFormData(prev => ({ ...prev, cliente_id: cliente ? cliente.id : 0 }));
  };

  const updateCampo = <K extends keyof FacturaFormState>(campo: K, valor: FacturaFormState[K]) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const validarFormulario = (): boolean => {
    try {
      FacturaVentaSchema.parse(formData);

      console.log("✅ VALIDACIÓN CORRECTA");
      console.log(formData);

      setErrors({});
      return true;
    } catch (error) {
      console.error("❌ ERROR DE VALIDACIÓN");

      if (error instanceof z.ZodError) {
        console.table(
          error.issues.map((issue) => ({
            campo: issue.path.join("."),
            error: issue.message,
            valor: issue.path,
          })),
        );

        console.log("FORM DATA:");
        console.log(formData);

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
  };

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
