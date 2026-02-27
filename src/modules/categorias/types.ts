export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  slug: string;
  estado: boolean; // ✅ Agregado estado
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CategoriaCreateInput {
  nombre: string;
  descripcion?: string;
  estado: boolean;
}

export interface CategoriaSimple {
  id: number;
  nombre: string;
}
