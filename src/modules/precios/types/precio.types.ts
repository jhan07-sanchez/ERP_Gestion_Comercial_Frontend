export interface Precio {
  id: number;

  // Relaciones
  producto: number;
  proveedor: number;

  // Datos
  precio: number;

  // Estado
  vigente: boolean;

  // Fechas
  fecha_inicio: string;
  fecha_fin?: string | null;
  fecha_creacion?: string;
}

export interface PrecioList extends Precio {
  producto_nombre?: string;
  producto_codigo?: string;

  proveedor_nombre?: string;
  proveedor_documento?: string;

  estado_badge?: {
    texto: string;
    color: string;
    icono: string;
    clase?: string;
  };

  vigencia_info?: {
    estado: string;
    mensaje?: string;
    dias_vigente?: number | null;
  };
}

export interface PrecioDetail extends Precio {
  producto_info?: {
    id: number;
    codigo: string;
    nombre: string;
    precio_venta: number;
    precio_compra_actual: number;
  };

  proveedor_info?: {
    id: number;
    nombre: string;
    documento: string;
    telefono?: string;
    email?: string;
  };

  variacion_precio?: {
    tiene_historial: boolean;
    precio_anterior?: number;
    variacion_absoluta: number;
    variacion_porcentual: number;
    tendencia: "subio" | "bajo" | "igual" | "nuevo";
  };
}

export interface PrecioCreateInput {
  producto: number;
  proveedor: number;
  precio: number;
  vigente: boolean;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface PrecioUpdateInput {
  precio?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface PrecioUpdateInput {
  precio?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface PrecioFilters {
  producto?: number;
  proveedor?: number;
  vigente?: boolean;
  search?: string;
}

export interface PrecioFormValues {
  producto: number | "";
  proveedor: number | "";
  precio: number | "";
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
