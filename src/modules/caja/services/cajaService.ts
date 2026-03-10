/**
 * 🏢 SERVICE LAYER: Lógica de negocio de Caja
 *
 * Contiene toda la lógica pura:
 * - Validaciones
 * - Cálculos financieros
 * - Análisis de diferencias
 * - Resúmenes
 * - Permisos de operación
 */

import type { SesionCaja, TipoMovimiento } from "../types/Caja.types";

export class CajaService {
  // ═══════════════════════════════════════════════════════════════
  // VALIDACIONES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Validar apertura de caja
   */
  static validarApertura(nombre: string, montoInicial: number): boolean {
    if (!nombre || nombre.trim().length < 3) {
      throw new Error("Nombre debe ser válido (mínimo 3 caracteres)");
    }

    if (montoInicial < 0) {
      throw new Error("Monto inicial no puede ser negativo");
    }

    if (montoInicial > 999_999_999) {
      throw new Error("Monto inicial demasiado grande");
    }

    return true;
  }

  /**
   * Validar cierre de sesión
   */
  static validarCierre(
    sesion: SesionCaja,
    montoContado: number,
  ): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    if (!sesion) {
      errores.push("Sesión no encontrada");
    }

    if (sesion.estado !== "ABIERTA") {
      errores.push("La sesión no está abierta");
    }

    if (montoContado < 0) {
      errores.push("Monto contado no puede ser negativo");
    }

    if (sesion.saldo_esperado === undefined || sesion.saldo_esperado === null) {
      errores.push("No hay saldo esperado calculado");
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }

  /**
   * Validar registro de movimiento
   */
  static validarMovimiento(
    sesion: SesionCaja,
    tipo: TipoMovimiento,
    monto: number,
  ): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    if (!sesion) {
      errores.push("Sesión no encontrada");
    }

    if (sesion.estado !== "ABIERTA") {
      errores.push("La sesión no está abierta para recibir movimientos");
    }

    const tiposPermitidos: TipoMovimiento[] = [
      "INGRESO_MANUAL",
      "EGRESO_GASTO",
      "EGRESO_RETIRO",
    ];

    if (!tiposPermitidos.includes(tipo)) {
      errores.push(`Tipo de movimiento '${tipo}' no permitido manualmente`);
    }

    if (monto <= 0) {
      errores.push("Monto debe ser mayor a 0");
    }

    if (monto > 999_999_999) {
      errores.push("Monto demasiado grande");
    }

    // Validar saldo para egresos
    if (tipo === "EGRESO_GASTO" || tipo === "EGRESO_RETIRO") {
      const saldoActual = parseFloat(sesion.saldo_esperado || "0");

      if (monto > saldoActual) {
        errores.push("No hay saldo suficiente en caja");
      }
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }

  /**
   * Validar arqueo de caja
   */
  static validarArqueo(
    sesion: SesionCaja,
    montoContado: number,
  ): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    if (!sesion) {
      errores.push("Sesión no encontrada");
    }

    if (montoContado < 0) {
      errores.push("Monto contado no puede ser negativo");
    }

    if (sesion.saldo_esperado === undefined || sesion.saldo_esperado === null) {
      errores.push("No hay saldo esperado para comparar");
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // CÁLCULOS FINANCIEROS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Calcular saldo esperado
   */
  static calcularSaldoEsperado(
    montoInicial: number,
    totalIngresos: number,
    totalEgresos: number,
  ): number {
    return montoInicial + totalIngresos - totalEgresos;
  }

  /**
   * Calcular diferencia de arqueo
   */
  static calcularDiferencia(
    montoContado: number,
    montoEsperado: number,
  ): number {
    return montoContado - montoEsperado;
  }

  /**
   * Determinar si hay diferencia relevante
   */
  static tieneDiferencia(diferencia: number, tolerancia = 1000): boolean {
    return Math.abs(diferencia) > tolerancia;
  }

  /**
   * Clasificar diferencia
   */
  static clasificarDiferencia(
    diferencia: number,
  ): "SOBRANTE" | "FALTANTE" | "EXACTO" {
    if (diferencia > 0) return "SOBRANTE";
    if (diferencia < 0) return "FALTANTE";
    return "EXACTO";
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILIDADES FINANCIERAS
  // ═══════════════════════════════════════════════════════════════

  static obtenerTotales(sesion: SesionCaja) {
    return {
      montoInicial: parseFloat(sesion.monto_inicial || "0"),
      totalIngresos: parseFloat(sesion.total_ingresos || "0"),
      totalEgresos: parseFloat(sesion.total_egresos || "0"),
      saldoEsperado: parseFloat(sesion.saldo_esperado || "0"),
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // RESUMEN DE SESIÓN
  // ═══════════════════════════════════════════════════════════════

  static generarResumen(sesion: SesionCaja) {
    const totales = this.obtenerTotales(sesion);

    const montoContado = sesion.monto_contado
      ? parseFloat(sesion.monto_contado)
      : null;

    const diferencia =
      montoContado !== null
        ? this.calcularDiferencia(montoContado, totales.saldoEsperado)
        : null;

    return {
      ...totales,
      montoContado,
      diferencia,
      clasificacion:
        diferencia !== null ? this.clasificarDiferencia(diferencia) : null,
      tipoSesion: sesion.estado,
      abiertaPor: sesion.usuario_nombre,
      abiertaEn: sesion.fecha_apertura,
      cerradaEn: sesion.fecha_cierre,
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // ANÁLISIS DE DISCREPANCIAS
  // ═══════════════════════════════════════════════════════════════

  static analizarDiscrepancia(diferencia: number, montoEsperado: number) {
    const porcentajeError =
      montoEsperado === 0 ? 0 : (Math.abs(diferencia) / montoEsperado) * 100;

    const clasificacion = this.clasificarDiferencia(diferencia);

    let causasProbables: string[] = [];
    let accionesRecomendadas: string[] = [];
    let severidad: "baja" | "media" | "alta" = "baja";

    if (clasificacion === "EXACTO") {
      causasProbables = ["Conteo exacto"];
      accionesRecomendadas = ["Cerrar sesión normalmente"];
    } else if (porcentajeError < 0.5) {
      causasProbables = ["Error de redondeo", "Diferencia decimal"];

      accionesRecomendadas = ["Revisar monedas", "Contar nuevamente"];
    } else if (porcentajeError < 5) {
      severidad = "media";

      if (clasificacion === "SOBRANTE") {
        causasProbables = [
          "Cliente pagó de más",
          "Cambio incorrecto",
          "Ingreso no registrado",
        ];
      } else {
        causasProbables = [
          "Cambio dado de más",
          "Egreso no registrado",
          "Error humano",
        ];
      }

      accionesRecomendadas = [
        "Revisar últimas transacciones",
        "Contar nuevamente",
      ];
    } else {
      severidad = "alta";

      causasProbables = [
        "Discrepancia significativa",
        "Errores acumulados",
        "Error administrativo",
      ];

      accionesRecomendadas = [
        "Contar nuevamente",
        "Revisar registros",
        "Contactar supervisor",
      ];
    }

    return {
      monto: diferencia,
      porcentaje: porcentajeError.toFixed(2),
      clasificacion,
      causasProbables,
      accionesRecomendadas,
      severidad,
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // PERMISOS DE OPERACIÓN
  // ═══════════════════════════════════════════════════════════════

  static obtenerPermisosOperacion(sesion: SesionCaja) {
    const abierta = sesion.estado === "ABIERTA";

    return {
      puedeRegistrarMovimiento: abierta,
      puedeRegistrarArqueo: true,
      puedeCerrar: abierta,
      puedeEditar: false,
      puedeEliminar: false,
      soloLectura: sesion.estado === "CERRADA",
    };
  }

  static esOperacionPermitida(
    sesion: SesionCaja,
    operacion: keyof ReturnType<typeof this.obtenerPermisosOperacion>,
  ): boolean {
    const permisos = this.obtenerPermisosOperacion(sesion);

    return permisos[operacion] ?? false;
  }
}
