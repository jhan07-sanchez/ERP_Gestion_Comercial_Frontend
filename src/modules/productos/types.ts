import type { Categoria, CategoriaSimple } from "../../modules/categorias/types";

export interface Producto {
    id: number;
    nombre: string;
    codigo: string;
    descripcion?: string;
    categoria: Categoria | number;
    precio_venta: number;
    precio_compra?: number;
    stock_minimo: number;
    estado: boolean;
    fecha_creacion?: string;
    fecha_actualizacion?: string;
}

export interface ProductoList extends Producto {
    categoria_info?: CategoriaSimple;
    stock_actual?: number;
}

export interface ProductoCreateInput {
    nombre: string;
    codigo?: string;
    descripcion?: string;
    categoria: number;
    precio_venta: number;
    precio_compra?: number;
    stock_minimo: number;
    estado?: boolean;
    imagen?: File | null;
    fecha_ingreso?: string;
}

export interface ProductoUpdateInput {
    nombre?: string;
    descripcion?: string;
    categoria?: number;
    precio_venta?: number;
    precio_compra?: number;
    stock_minimo?: number;
    estado?: boolean;
}

export interface ProductoFilters {
    search?: string;
    categoria_id?: number;
    categoria?: string;
    estado?: boolean;
    precio_min?: number;
    precio_max?: number;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface SuccessResponse<T> {
    detail: string;
    data: T;
}

export interface ProductoFormValues {
    nombre: string;
    codigo: string;
    descripcion?: string;
    categoria: number;
    precio_venta: number;
    precio_compra?: number;
    stock_minimo: number;
    estado?: boolean;
}
