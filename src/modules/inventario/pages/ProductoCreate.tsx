/**
 * Formulario para crear un nuevo producto
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '@/components/ui';
import { useProductos } from '../hooks/useProductos';
import { productosAPI } from '../api/productos.api';
import type { ProductoCreateInput, Categoria } from '../types';

export default function ProductoCreate() {
  const navigate = useNavigate();
  const { createProducto, error: hookError } = useProductos();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductoCreateInput>({
    nombre: '',
    codigo: '',
    descripcion: '',
    categoria_id: 0,
    precio_venta: 0,
    precio_compra: 0,
    stock_minimo: 0,
    fecha_ingreso: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
  });

  // Cargar categorías
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const data = await productosAPI.getCategorias();
        setCategorias(data || []);
      } catch (err) {
        console.error('Error cargando categorías:', err);
        setError('No se pudieron cargar las categorías');
      }
    };

    loadCategorias();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;

    setFormData((prev) => ({
      ...prev,
      [name]: ['precio_venta', 'precio_compra', 'stock_minimo', 'categoria_id'].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      setIsSubmitting(false);
      return;
    }

    if (!formData.codigo.trim()) {
      setError('El código es requerido');
      setIsSubmitting(false);
      return;
    }

    if (formData.categoria_id === 0) {
      setError('Debes seleccionar una categoría');
      setIsSubmitting(false);
      return;
    }

    if (formData.precio_venta <= 0) {
      setError('El precio de venta debe ser mayor a 0');
      setIsSubmitting(false);
      return;
    }

    try {
      await createProducto(formData);
      navigate('../productos', { relative: 'route' });
    } catch (err) {
      let errorMsg = 'Error al crear producto';
      
      if (err instanceof Error) {
        errorMsg = err.message;
        // Si es un error de validación del servidor, intenta extraer los detalles
        if (err.message.includes('400') || err.message.includes('validation')) {
          console.error('Error details:', err);
        }
      }
      
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate('../productos', { relative: 'route' })}>
          ← Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
          <p className="text-gray-600 mt-1">Crea un nuevo producto en el inventario</p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Errores */}
            {(error || hookError) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error || hookError}</p>
              </div>
            )}

            {/* Sección 1: Información Básica */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                  <Input
                    name="nombre"
                    placeholder="Ej: Laptop Dell XPS 13"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Código *</label>
                  <Input
                    name="codigo"
                    placeholder="Ej: SKU-001"
                    value={formData.codigo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    name="descripcion"
                    placeholder="Descripción del producto..."
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección 2: Categoría */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categoría</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                <select
                  name="categoria_id"
                  value={String(formData.categoria_id)}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Seleccionar categoría...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sección 3: Precios */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Precios</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio de Compra ($)</label>
                  <Input
                    type="number"
                    name="precio_compra"
                    placeholder="0.00"
                    value={formData.precio_compra}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio de Venta ($) *</label>
                  <Input
                    type="number"
                    name="precio_venta"
                    placeholder="0.00"
                    value={formData.precio_venta}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Sección 4: Inventario */}
            <div className="pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventario</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Mínimo</label>
                  <Input
                    type="number"
                    name="stock_minimo"
                    placeholder="Cantidad mínima en stock"
                    value={formData.stock_minimo}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Ingreso</label>
                  <Input
                    type="date"
                    name="fecha_ingreso"
                    value={formData.fecha_ingreso || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" onClick={() => navigate('../productos', { relative: 'route' })}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear Producto'}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
