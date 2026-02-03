/**
 * Formulario para crear un nuevo producto
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input } from "@/components/ui";
import { useProductos } from "../hooks/useProductos";
import { useCategorias } from "../hooks/useCategorias";
import type { ProductoCreateInput } from "../types";

export default function ProductoCreate() {
  const navigate = useNavigate();

  const { createProducto, error: hookError } = useProductos();
  const {
    categorias,
    isLoading: loadingCategorias,
    error: categoriasError,
  } = useCategorias();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductoCreateInput>({
    nombre: "",
    codigo: "",
    descripcion: "",
    categoria_id: 0,
    precio_venta: 0,
    precio_compra: 0,
    stock_minimo: 0,
    fecha_ingreso: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: [
        "precio_venta",
        "precio_compra",
        "stock_minimo",
        "categoria_id",
      ].includes(name)
        ? Number(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validaciones frontend
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      setIsSubmitting(false);
      return;
    }

    if (!formData.codigo.trim()) {
      setError("El código es requerido");
      setIsSubmitting(false);
      return;
    }

    if (formData.categoria_id === 0) {
      setError("Debes seleccionar una categoría");
      setIsSubmitting(false);
      return;
    }

    if (formData.precio_venta <= 0) {
      setError("El precio de venta debe ser mayor a 0");
      setIsSubmitting(false);
      return;
    }

    try {
      await createProducto(formData);
      navigate("../productos", { relative: "route" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate("../productos", { relative: "route" })}>
          ← Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
          <p className="text-gray-600 mt-1">
            Crea un nuevo producto en el inventario
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Errores */}
            {(error || hookError || categoriasError) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">
                  {error || hookError || categoriasError}
                </p>
              </div>
            )}

            {/* Información Básica */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Información Básica</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nombre *
                  </label>
                  <Input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Laptop Dell XPS 13"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Código *
                  </label>
                  <Input
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                    placeholder="Ej: SKU-001"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Categoría */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Categoría</h2>

              <select
                name="categoria_id"
                value={String(formData.categoria_id)}
                onChange={handleInputChange}
                disabled={loadingCategorias}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="0">
                  {loadingCategorias
                    ? "Cargando categorías..."
                    : "Seleccionar categoría..."}
                </option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Precios */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Precios</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  name="precio_compra"
                  value={formData.precio_compra}
                  onChange={handleInputChange}
                  placeholder="Precio de compra"
                  min="0"
                />

                <Input
                  type="number"
                  name="precio_venta"
                  value={formData.precio_venta}
                  onChange={handleInputChange}
                  placeholder="Precio de venta"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Inventario */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Inventario</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  name="stock_minimo"
                  value={formData.stock_minimo}
                  onChange={handleInputChange}
                  placeholder="Stock mínimo"
                  min="0"
                />

                <Input
                  type="date"
                  name="fecha_ingreso"
                  value={formData.fecha_ingreso}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                onClick={() => navigate("../productos", { relative: "route" })}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || loadingCategorias}
              >
                {isSubmitting ? "Creando..." : "Crear Producto"}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
