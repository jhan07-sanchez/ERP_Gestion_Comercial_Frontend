/**
 * Formulario para editar un producto existente
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Input } from "@/components/ui";
import { useProductos } from "../hooks/useProductos";
import { useCategorias } from "../hooks/useCategorias";
import type { ProductoUpdateInput } from "../types";

export default function ProductoEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { getProducto, updateProducto, error: hookError } = useProductos();
  const {
    categorias,
    isLoading: loadingCategorias,
    error: categoriasError,
  } = useCategorias();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductoUpdateInput>({
    nombre: "",
    codigo: "",
    descripcion: "",
    categoria: 0,
    precio_venta: 0,
    precio_compra: 0,
    stock_minimo: 0,
    estado: true,
  });

  // 🔹 Cargar producto
  useEffect(() => {
    const loadProducto = async () => {
      try {
        if (!id) throw new Error("ID no proporcionado");

        const producto = await getProducto(Number(id));
        if (!producto) throw new Error("Producto no encontrado");

        setFormData({
          nombre: producto.nombre,
          codigo: producto.codigo,
          descripcion: producto.descripcion ?? "",
          categoria:
            typeof producto.categoria === "object"
              ? producto.categoria.id
              : producto.categoria,
          precio_venta: producto.precio_venta,
          precio_compra: producto.precio_compra ?? 0,
          stock_minimo: producto.stock_minimo,
          estado: producto.estado,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar producto",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProducto();
  }, [id, getProducto]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : [
                "precio_venta",
                "precio_compra",
                "stock_minimo",
                "categoria",
              ].includes(name)
            ? Number(value) || 0
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!id) {
      setError("ID no válido");
      setIsSubmitting(false);
      return;
    }

    if (formData.precio_venta !== undefined && formData.precio_venta <= 0) {
      setError("El precio de venta debe ser mayor a 0");
      setIsSubmitting(false);
      return;
    }

    try {
      await updateProducto(Number(id), formData);
      navigate("../productos", { relative: "route" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar producto",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate("../productos", { relative: "route" })}>
          ← Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
          <p className="text-gray-600 mt-1">Modifica los datos del producto</p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            {(error || hookError || categoriasError) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">
                  {error || hookError || categoriasError}
                </p>
              </div>
            )}

            {/* Información básica */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Información Básica</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre del producto"
                />

                <Input name="codigo" value={formData.codigo} disabled />

                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={3}
                  className="md:col-span-2 w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Categoría</h2>

              <select
                name="categoria"
                value={String(formData.categoria?? 0)}
                onChange={handleInputChange}
                disabled={loadingCategorias}
                className="w-full px-3 py-2 border rounded-lg
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
                  min="0"
                />

                <Input
                  type="number"
                  name="precio_venta"
                  value={formData.precio_venta}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            {/* Inventario */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Inventario</h2>

              <Input
                type="number"
                name="stock_minimo"
                value={formData.stock_minimo}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="estado"
                  checked={formData.estado}
                  onChange={handleInputChange}
                />
                <span>Producto activo</span>
              </label>
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
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
