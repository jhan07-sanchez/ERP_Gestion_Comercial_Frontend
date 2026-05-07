import type { EstadoResultadosData, MovimientoFinanciero } from '../types/reportes.types';

/**
 * CAPA DE DOMINIO - REPORTES
 * Aquí reside la lógica de negocio pura. Sin dependencias de React ni UI.
 */

export const reportesDomain = {
  /**
   * Calcula la Utilidad Bruta
   * Utilidad Bruta = Ingresos Operativos - Costo de Ventas
   */
  calcularUtilidadBruta: (ingresos: number, costoVentas: number): number => {
    return ingresos - costoVentas;
  },

  /**
   * Calcula la Utilidad Operativa
   * Utilidad Operativa = Utilidad Bruta - Gastos Operativos
   */
  calcularUtilidadOperativa: (utilidadBruta: number, gastosOperativos: number): number => {
    return utilidadBruta - gastosOperativos;
  },

  /**
   * Calcula la Utilidad Neta
   * Utilidad Neta = Utilidad Operativa - Impuestos
   */
  calcularUtilidadNeta: (utilidadOperativa: number, impuestos: number): number => {
    return utilidadOperativa - impuestos;
  },

  /**
   * Procesa una lista de movimientos y genera un Estado de Resultados estructurado
   */
  procesarEstadoResultados: (movimientos: MovimientoFinanciero[]): EstadoResultadosData => {
    let ingresosOperativos = 0;
    let costoVentas = 0;
    let gastosOperativos = 0;
    let impuestos = 0;

    movimientos.forEach((mov) => {
      if (mov.tipo === 'ingreso') {
        ingresosOperativos += mov.monto;
      } else if (mov.tipo === 'egreso') {
        if (mov.categoria === 'COSTO_VENTA') {
          costoVentas += mov.monto;
        } else if (mov.categoria === 'IMPUESTO') {
          impuestos += mov.monto;
        } else {
          gastosOperativos += mov.monto;
        }
      }
    });

    return {
      ingresosOperativos,
      costoVentas,
      gastosOperativos,
      impuestos,
      detalles: movimientos,
    };
  },

  /**
   * Calcula el Margen Operativo (%)
   */
  calcularMargenOperativo: (utilidadOperativa: number, ingresos: number): number => {
    if (ingresos === 0) return 0;
    return (utilidadOperativa / ingresos) * 100;
  }
};
