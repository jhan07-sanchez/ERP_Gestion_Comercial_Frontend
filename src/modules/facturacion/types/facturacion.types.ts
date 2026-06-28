/**
 * Tipos de Dominio y DTOs para el módulo de Facturación
 */

// ===============================
// ENUMS Y TIPOS BASE
// ===============================

export type EstadoFactura = "BORRADOR" | "EMITIDA" | "PARCIAL" | "PAGADA" | "VENCIDA" | "ANULADA";

export interface UsuarioSimple {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface ClienteSimple {
  id: number;
  cliente_nombre: string;
  numero_documento?: string;
}

export interface VendedorSimple {
  id: number;
  first_name: string;
  last_name: string;
}

export interface ProductoSimple {
  id: number;
  nombre: string;
  codigo?: string;
}

export interface MetodoPagoSimple {
  id: number;
  nombre: string;
}

export interface ImpuestoSimple {
  id: number;
  nombre: string;
  porcentaje: number;
}

// ===============================
// DTOS DE RESPUESTA (BACKEND -> FRONTEND)
// ===============================

export interface FacturaDetalleBackend {
  id: number;
  producto: number;
  producto_nombre: string;
  producto_codigo: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  subtotal: number;
  impuestos_linea: number;
  total_linea: number;
  stock_disponible: number;
}

export interface FacturaImpuesto {
  id?: number;
  impuesto_id: number;
  impuesto?: ImpuestoSimple;
  base_imponible: number;
  monto: number;
}

export interface PagoFactura {
  id: number;
  metodo_pago: MetodoPagoSimple;
  monto: number;
  referencia: string | null;
  observaciones: string | null;
  fecha: string;
  registrado_por?: UsuarioSimple | null;
}

export interface Factura {
  id: number;
  cliente: ClienteSimple;
  vendedor: VendedorSimple | null;
  creado_por: UsuarioSimple | null;
  numero: string | null;
  estado: EstadoFactura;
  fecha_emision: string | null;
  fecha_vencimiento: string | null;
  subtotal: number;
  descuento_total: number;
  impuestos_total: number;
  total: number;
  saldo_pendiente: number;
  observaciones: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface FacturaList extends Factura {
  cliente_nombre: string;
}

export interface FacturaDetail {
  id: number;
  numero: string | null;
  cliente: number;
  cliente_nombre: string;
  cliente_documento: string;
  estado: EstadoFactura;
  fecha_emision: string | null;
  fecha_vencimiento: string | null;
  subtotal: number;
  descuento_total: number;
  impuestos_total: number;
  total: number;
  saldo_pendiente: number;
  observaciones: string | null;
  vendedor: number | null;
  vendedor_nombre: string | null;
  creado_por: number;
  creado_por_nombre: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  detalles: FacturaDetalleBackend[];
  desglose_impuestos: FacturaImpuesto[];
  pagos: PagoFactura[];
}

// ===============================
// DTOS DE PETICIÓN (FRONTEND -> BACKEND)
// ===============================

export interface FacturaDetalleCreateInput {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  descuento?: number;
}

export interface FacturaCreateInput {
  cliente_id: number;
  condicion_pago_id?: number;
  vendedor_id?: number;
  observaciones?: string;
  fecha_emision?: string;
  fecha_vencimiento?: string;
  detalles: FacturaDetalleCreateInput[];
  subtotal?: number;
  descuento_total?: number;
  impuestos_total?: number;
  total?: number;
}

export interface FacturaUpdateInput {
  cliente_id?: number;
  condicion_pago_id?: number;
  vendedor_id?: number;
  observaciones?: string;
  fecha_emision?: string;
  fecha_vencimiento?: string;
  detalles?: FacturaDetalleCreateInput[];
  subtotal?: number;
  descuento_total?: number;
  impuestos_total?: number;
  total?: number;
}

export interface AnularFacturaInput {
  motivo: string;
}

export interface RegistrarPagoInput {
  metodo_pago: string;
  monto: number;
  referencia?: string;
  observaciones?: string;
}

export interface FacturaFilters {
  search?: string;
  estado?: EstadoFactura | "";
  cliente?: number | "";
  fecha_emision_after?: string;
  fecha_emision_before?: string;
  ordering?: string;
}

// ===============================
// DASHBOARD
// ===============================

export interface KpisMesActual {
  mes: string;
  total_facturado: number;
  total_cobrado: number;
  saldo_pendiente: number;
}

export interface DashboardResumen {
  kpis_mes_actual: KpisMesActual;
  facturas_por_estado: Record<EstadoFactura, number>;
}

export interface VentaMensual {
  mes: string;
  total_facturado: number;
  cantidad_facturas: number;
}

export interface TopCliente {
  cliente_id: number;
  cliente_nombre: string;
  total_comprado: number;
}

export interface TopProducto {
  producto_id: number;
  producto_nombre: string;
  cantidad_vendida: number;
  monto_generado: number;
}

export interface CuentaPorCobrar {
  factura_id: number;
  numero: string;
  cliente_nombre: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  estado: EstadoFactura;
  total: number;
  saldo_pendiente: number;
}

// ===============================
// MODELOS DE ESTADO (UI FRONTEND)
// ===============================

export interface ClienteParaFactura {
  id: number;
  nombre: string;
  numero_documento: string;
  telefono?: string;
  email?: string;
}

export interface ProductoParaFactura {
  id: number;
  codigo: string;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
}

export interface FacturaDetalleFormState {
  id?: string; // id local para renderizado de listas
  producto_id: number;
  producto_codigo?: string;
  producto_nombre?: string;
  stock_disponible?: number;
  cantidad: number | "";
  precio_unitario: number | "";
  descuento: number | "";
  subtotal: number;
}

export interface FacturaFormState {
  id?: number;
  numero?: string | null;
  cliente_id: number;
  condicion_pago_id?: number;
  vendedor_id?: number;
  estado?: EstadoFactura;
  fecha_vencimiento?: string;
  observaciones?: string;
  detalles: FacturaDetalleFormState[];
  subtotal: number;
  descuento_total: number;
  impuestos_total: number;
  total: number;
}
