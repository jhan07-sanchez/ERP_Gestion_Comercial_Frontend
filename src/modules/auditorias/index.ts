/**
 * Módulo de Auditorías.
 * Reexporta submódulos: actividad_reciente, historial_cambios, accesos, reportes, usuarios, ventas.
 */

export { ActivityPage } from './actividad_reciente';
export { HistorialCambiosList, historialCambiosAPI, useHistorialCambiosList } from './historial_cambios';
export { AccesosPage } from './accesos';
export { ReportesAuditoriaPage } from './reportes';
export { UsuariosAuditoriaPage } from './usuarios';
export { VentasAuditoriaPage } from './ventas';
