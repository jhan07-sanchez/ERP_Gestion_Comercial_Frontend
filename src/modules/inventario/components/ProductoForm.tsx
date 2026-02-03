import { Card, Button, Input } from "@/components/ui";
import type { Categoria, ProductoUpdateInput } from "../types";

interface ProductoFormProps {
  value: ProductoUpdateInput;
  categorias: Categoria[];
  loadingCategorias?: boolean;
  submitting?: boolean;
  error?: string | null;

  onChange: (data: ProductoUpdateInput) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function ProductoForm({
  value,
  categorias,
  loadingCategorias = false,
  submitting = false,
  error,
  onChange,
  onSubmit,
  onCancel,
}: ProductoFormProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const {
      name,
      value: inputValue,
      type,
      checked,
    } = e.target as HTMLInputElement;

    onChange({
      ...value,
      [name]:
        type === "checkbox"
          ? checked
          : [
                "precio_venta",
                "precio_compra",
                "stock_minimo",
                "categoria",
              ].includes(name)
            ? Number(inputValue) || 0
            : inputValue,
    });
  };

  return (
    <Card>
      <Card.Content>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-6"
        >
          {/* Errores */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Información básica */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Información Básica</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="nombre"
                value={value.nombre ?? ""}
                onChange={handleChange}
                placeholder="Nombre del producto"
                required
              />

              <Input name="codigo" value={value.codigo ?? ""} disabled />

              <textarea
                name="descripcion"
                value={value.descripcion ?? ""}
                onChange={handleChange}
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
              value={String(value.categoria ?? 0)}
              onChange={handleChange}
              disabled={loadingCategorias}
              className="w-full px-3 py-2 border rounded-lg
                         disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              <option value="0">Seleccionar categoría...</option>
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
                value={value.precio_compra ?? 0}
                onChange={handleChange}
                min="0"
                placeholder="Precio de compra"
              />

              <Input
                type="number"
                name="precio_venta"
                value={value.precio_venta ?? 0}
                onChange={handleChange}
                min="0"
                placeholder="Precio de venta"
                required
              />
            </div>
          </div>

          {/* Inventario */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Inventario</h2>

            <Input
              type="number"
              name="stock_minimo"
              value={value.stock_minimo ?? 0}
              onChange={handleChange}
              min="0"
              placeholder="Stock mínimo"
            />
          </div>

          {/* Estado */}
          {"estado" in value && (
            <div className="pb-6">
              <h2 className="text-lg font-semibold mb-4">Estado</h2>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="estado"
                  checked={value.estado ?? true}
                  onChange={handleChange}
                />
                <span>Producto activo</span>
              </label>
            </div>
          )}

          {/* Acciones */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" onClick={onCancel}>
              Cancelar
            </Button>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
