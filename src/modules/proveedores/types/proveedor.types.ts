// proveedores/types/proveedor.types.ts

export interface Proveedor {
  id: number;
  nombre: string;
  documento: string;
  telefono: string;
  email: string;
  direccion: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface ProveedorFormData {
  nombre: string;
  documento: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  activo?: boolean;
}

export interface ProveedorFilters {
  search?: string;
  activo?: boolean;
}
