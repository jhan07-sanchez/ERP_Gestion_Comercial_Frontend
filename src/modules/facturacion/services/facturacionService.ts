import type { FacturaDetalleFormState } from "../types";

/**
 * Servicio puro para cálculos financieros de facturación.
 * Centraliza la lógica matemática para asegurar consistencia en todo el módulo.
 */
export const FacturacionService = {
  /**
   * Calcula el subtotal de una línea de detalle.
   * Fórmula: (cantidad * precio_unitario) - descuento
   */
  calcularSubtotalLinea(cantidad: number | "", precioUnitario: number | "", descuento: number | ""): number {
    const qty = Number(cantidad) || 0;
    const price = Number(precioUnitario) || 0;
    const discount = Number(descuento) || 0;
    return Math.max(0, (qty * price) - discount);
  },

  /**
   * Calcula los totales generales de una factura basados en sus detalles.
   */
  calcularTotales(detalles: FacturaDetalleFormState[], porcentajeImpuesto: number) {
    const subtotal = detalles.reduce((sum, d) => sum + ((Number(d.cantidad) || 0) * (Number(d.precio_unitario) || 0)), 0);
    const descuento_total = detalles.reduce((sum, d) => sum + (Number(d.descuento) || 0), 0);
    
    const base_imponible = Math.max(0, subtotal - descuento_total);
    const impuestos_total = Math.round(base_imponible * (porcentajeImpuesto / 100) * 100) / 100;
    const total = Math.round((base_imponible + impuestos_total) * 100) / 100;

    return {
      subtotal,
      descuento_total,
      base_imponible,
      impuestos_total,
      total,
    };
  },

  /** IVA de una línea: (cant × precio − descuento) × % */
  calcularImpuestoLinea(
    cantidad: number | "",
    precioUnitario: number | "",
    descuento: number | "",
    porcentajeImpuesto: number,
  ): number {
    const base = Math.max(
      0,
      (Number(cantidad) || 0) * (Number(precioUnitario) || 0) - (Number(descuento) || 0),
    );
    return Math.round(base * (porcentajeImpuesto / 100) * 100) / 100;
  },

  /**
   * Calcula el vuelto en un pago en efectivo.
   */
  calcularVuelto(montoPagar: number, montoRecibido: number): number {
    if (montoRecibido > montoPagar) {
      return montoRecibido - montoPagar;
    }
    return 0;
  }
};
