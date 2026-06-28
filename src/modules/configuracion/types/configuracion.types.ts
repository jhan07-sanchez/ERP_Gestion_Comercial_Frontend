/**
 * 🛠️ TIPOS PARA EL MÓDULO DE CONFIGURACIÓN
 * Basados en el backend apps/configuracion/
 */

export type RegimenFiscal = 'SIMPLIFICADO' | 'COMUN' | 'ESPECIAL' | 'NO_RESPONSABLE';

export type Moneda = 'COP' | 'USD' | 'EUR' | 'MXN' | 'PEN' | 'CLP' | 'ARS';

export interface Configuracion {
    // Identificación
    id: number;

    // Datos empresa
    nombre_empresa: string;
    razon_social: string;
    nit: string;
    telefono: string;
    telefono_secundario: string;
    email: string;
    sitio_web: string;
    direccion: string;
    ciudad: string;
    departamento: string;
    pais: string;
    logo: string | null; // Ruta relativa
    logo_url: string | null; // URL completa

    // Fiscal
    regimen_fiscal: RegimenFiscal;
    regimen_fiscal_display: string;
    impuesto_porcentaje: string | number;
    aplicar_impuesto_por_defecto: boolean;
    moneda: Moneda;
    moneda_display: string;
    simbolo_moneda: string;
    decimales_precio: number;

    // Numeración
    prefijo_factura: string;
    consecutivo_factura: number;
    prefijo_compra: string;
    consecutivo_compra: number;
    prefijo_recibo: string;
    consecutivo_recibo: number;
    digitos_consecutivo: number;
    numero_factura_preview: string;
    numero_compra_preview: string;
    numero_recibo_preview: string;

    // Inventario
    stock_minimo_global: number;
    alertar_stock_bajo: boolean;

    // Ventas
    permitir_descuentos: boolean;
    descuento_maximo: string | number;
    permitir_venta_sin_stock: boolean;
    terminos_condiciones: string;
    tasa_cambio: string | number;

    // Resolución DIAN
    numero_resolucion_factura: string | null;
    rango_inicial_factura: number;
    rango_final_factura: number;
    fecha_inicio_resolucion: string | null;
    fecha_fin_resolucion: string | null;

    // Plantillas
    plantilla_factura_pdf: string;
    plantilla_correo_factura: string;

    // Contabilidad
    cuenta_ventas: string;
    cuenta_impuestos: string;
    cuenta_cxc_clientes: string;

    // Master Payload
    impuestos_activos: Impuesto[];
    metodos_pago_activos: MetodoPago[];
    condiciones_pago_activas: CondicionPago[];

    // Metadata
    fecha_creacion: string;
    fecha_actualizacion: string;
}

export interface ConfiguracionResumen {
    nombre_empresa: string;
    nit: string;
    telefono: string;
    email: string;
    moneda: Moneda;
    simbolo_moneda: string;
    impuesto_porcentaje: string | number;
}

export interface ConfiguracionUpdateInput {
    nombre_empresa?: string;
    razon_social?: string;
    nit?: string;
    telefono?: string;
    telefono_secundario?: string;
    email?: string;
    sitio_web?: string;
    direccion?: string;
    ciudad?: string;
    departamento?: string;
    pais?: string;
    logo?: File | null;
    regimen_fiscal?: RegimenFiscal;
    impuesto_porcentaje?: number;
    aplicar_impuesto_por_defecto?: boolean;
    moneda?: Moneda;
    simbolo_moneda?: string;
    decimales_precio?: number;
    prefijo_factura?: string;
    prefijo_compra?: string;
    prefijo_recibo?: string;
    digitos_consecutivo?: number;
    stock_minimo_global?: number;
    alertar_stock_bajo?: boolean;
    permitir_descuentos?: boolean;
    descuento_maximo?: number;
    permitir_venta_sin_stock?: boolean;
    terminos_condiciones?: string;
    tasa_cambio?: number;
}

export interface ResetConsecutivoInput {
    tipo: 'factura' | 'compra' | 'recibo';
    nuevo_consecutivo: number;
    confirmar: boolean;
}

export interface Impuesto {
    id: number;
    nombre: string;
    porcentaje: string | number;
    activo: boolean;
}

export interface MetodoPago {
    id: number;
    nombre: string;
    activo: boolean;
    es_efectivo: boolean;
    tipo: 'CONTADO' | 'CREDITO';
    tipo_display: string;
}

export interface CondicionPago {
    id: number;
    nombre: string;
    dias_plazo: number;
    activo: boolean;
    es_contado: boolean;
}
