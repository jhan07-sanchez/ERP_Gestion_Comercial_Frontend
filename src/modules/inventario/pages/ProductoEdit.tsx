/**
 * Formulario para editar un producto existente
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Input } from '@/components/ui';
import { useProductos } from '../hooks/useProductos';
import { productosAPI } from '../api/productos.api';
import type { ProductoUpdateInput, Categoria } from '../types';

export default function ProductoEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateProducto, error: hookError } = useProductos();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductoUpdateInput>({});

  // Cargar producto y categorías
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) throw new Error('ID no proporcionado');

        const [producto, cats] = await Promise.all([
          productosAPI.getProducto(parseInt(id)),
          productosAPI.getCategorias(),
        ]);

        setFormData({
          nombre: producto.nombre,
          codigo: producto.codigo,
          descripcion: producto.descripcion,
          categoria: typeof producto.categoria === 'object' ? producto.categoria.id : producto.categoria,
          precio_venta: producto.precio_venta,
          precio_compra: producto.precio_compra,
          stock_minimo: producto.stock_minimo,
          estado: producto.estado,
        });

        setCategorias(cats || []);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error cargando el producto';
        console.error('Load error:', err);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = (e.target as HTMLInputElement | HTMLSelectElement);

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : ['precio_venta', 'precio_compra', 'stock_minimo', 'categoria'].includes(name)
            ? parseFloat(value) || 0
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validaciones
    if (formData.nombre && !formData.nombre.trim()) {
      setError('El nombre no puede estar vacío');
      setIsSubmitting(false);
      return;
    }

    if (formData.precio_venta !== undefined && formData.precio_venta <= 0) {
      setError('El precio de venta debe ser mayor a 0');
      setIsSubmitting(false);
      return;
    }

    try {
      if (!id) throw new Error('ID no proporcionado');
      await updateProducto(parseInt(id), formData);
      navigate('../productos', { relative: 'route' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate('../productos', { relative: 'route' })}>
          ← Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
          <p className="text-gray-600 mt-1">Modifica los detalles del producto</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <Input
                    name="nombre"
                    placeholder="Ej: Laptop Dell XPS 13"
                    value={formData.nombre || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Código</label>
                  <Input
                    name="codigo"
                    placeholder="Ej: SKU-001"
                    value={formData.codigo || ''}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    name="descripcion"
                    placeholder="Descripción del producto..."
                    value={formData.descripcion || ''}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  name="categoria"
                  value={String(formData.categoria || 0)}
                  onChange={handleInputChange}
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
                    value={formData.precio_compra || 0}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio de Venta ($)</label>
                  <Input
                    type="number"
                    name="precio_venta"
                    placeholder="0.00"
                    value={formData.precio_venta || 0}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Sección 4: Inventario */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventario</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Mínimo</label>
                <Input
                  type="number"
                  name="stock_minimo"
                  placeholder="Cantidad mínima en stock"
                  value={formData.stock_minimo || 0}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            {/* Sección 5: Estado */}
            <div className="pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado</h2>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="estado"
                  checked={formData.estado !== false}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-gray-700">Producto activo</span>
              </label>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" onClick={() => navigate('../productos', { relative: 'route' })}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
