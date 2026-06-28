import { z } from "zod";

// Validator para un solo detalle de factura
export const FacturaDetalleSchema = z.object({
  producto_id: z.coerce.number().min(1, "Debe seleccionar un producto"),
  cantidad: z.coerce.number().min(1, "La cantidad debe ser mayor a 0"),
  precio_unitario: z.coerce.number().min(0, "El precio no puede ser negativo"),
  descuento: z.coerce.number().min(0).optional().default(0),
});

// Validator principal para la factura de venta
export const FacturaVentaSchema = z.object({
  cliente_id: z.number().min(1, "Debe seleccionar un cliente válido"),
  vendedor_id: z.number().optional(),
  fecha_vencimiento: z.string().optional(),
  observaciones: z.string().max(500, "Las observaciones no pueden exceder 500 caracteres").optional(),
  detalles: z.array(FacturaDetalleSchema)
    .min(1, "Debe agregar al menos un producto a la factura"),
});

export type FacturaVentaValidType = z.infer<typeof FacturaVentaSchema>;

// Validator para registrar un pago
export const RegistrarPagoSchema = z.object({
  metodo_pago: z.string().min(1, "Debe seleccionar un método de pago"),
  monto: z.number().min(0.01, "El monto debe ser mayor a 0"),
});

export type RegistrarPagoValidType = z.infer<typeof RegistrarPagoSchema>;
