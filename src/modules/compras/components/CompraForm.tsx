// src/modules/compras/components/CompraForm.tsx
import { useState } from "react";
import { Card, Button, Input, Select } from "@/components/ui";
import { Proveedor, CompraItem, CompraCreateInput } from "../types";
import { useProveedores } from "../../inventario/hooks/useProveedores";

interface CompraFormProps {
  mode: "create" | "edit";
  value: CompraCreateInput;
  proveedores: Proveedor[];
  loadingProveedores: boolean;
  submitting: boolean;
  error?: string | null;
  onChange: (data: CompraCreateInput) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function CompraForm({
  mode,
  value,
  proveedores,
  loadingProveedores,
  submitting,
  error,
  onChange,
  onSubmit,
  onCancel,
}: CompraFormProps) {
  const { proveedores: proveedoresList } = useProveedores();
  const [items, setItems] = useState<CompraItem[]>(value.items || []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value: inputValue } = e.target;
    onChange({ ...value, [name]: inputValue });
  };

  const handleItemChange = (
    index: number,
    field: keyof CompraItem,
    value: number,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Actualizar subtotal
    newItems[index].subtotal =
      newItems[index].cantidad * newItems[index].precio_unitario;

    setItems(newItems);
    onChange({ ...value, items: newItems });
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        producto_id: 0,
        producto_nombre: "",
        cantidad: 1,
        precio_unitario: 0,
        subtotal: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!value.numero_factura?.trim()) {
      alert("El número de factura es obligatorio");
      return false;
    }

    if (value.items.length === 0) {
      alert("Debes agregar al menos un producto a la compra");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit();
  };

  return (
    <Card>
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mensajes de Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Información Básica */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Información de la Compra
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Número de Factura"
                name="numero_factura"
                value={value.numero_factura || ""}
                onChange={handleChange}
                placeholder="Ej: FAC-2024-001"
                required
                disabled={submitting}
              />

              <Input
                label="Fecha"
                type="date"
                name="fecha"
                value={value.fecha || new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                disabled={submitting}
              />

              <Select
                label="Proveedor"
                name="proveedor_id"
                value={value.proveedor_id || 0}
                onChange={(e) =>
                  onChange({ ...value, proveedor_id: Number(e.target.value) })
                }
                disabled={loadingProveedores || submitting}
                required
              >
                <option value={0}>Seleccionar proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre} - {proveedor.telefono}
                  </option>
                ))}
              </Select>

              <Input
                label="Estado"
                type="text"
                value={mode === "create" ? "PENDIENTE" : value.estado || ""}
                disabled
                helperText="El estado se actualiza automáticamente"
              />
            </div>
          </div>

          {/* Items de Compra */}
          <div className="border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Productos en la Compra
              </h2>
              <Button
                variant="secondary"
                type="button"
                onClick={addItem}
                disabled={submitting}
              >
                + Agregar Producto
              </Button>
            </div>

            {items.map((item, index) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 mb-4 relative"
              >
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select
                    label="Producto"
                    value={item.producto_id || 0}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "producto_id",
                        Number(e.target.value),
                      )
                    }
                    disabled={submitting}
                  >
                    <option value={0}>Seleccionar producto</option>
                    {/* Aquí se cargarían los productos */}
                  </Select>

                  <Input
                    label="Cantidad"
                    type="number"
                    value={item.cantidad}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "cantidad",
                        Number(e.target.value),
                      )
                    }
                    min="1"
                    disabled={submitting}
                  />

                  <Input
                    label="Precio Unitario"
                    type="number"
                    value={item.precio_unitario}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "precio_unitario",
                        Number(e.target.value),
                      )
                    }
                    step="0.01"
                    disabled={submitting}
                  />

                  <Input
                    label="Subtotal"
                    value={item.subtotal.toFixed(2)}
                    disabled
                    helperText="Se calcula automáticamente"
                  />
                </div>
              </div>
            ))}

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  Total de la Compra:
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  $
                  {items
                    .reduce((sum, item) => sum + item.subtotal, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Observaciones
            </h2>
            <textarea
              name="observaciones"
              value={value.observaciones || ""}
              onChange={handleChange}
              rows={3}
              placeholder="Notas adicionales sobre la compra..."
              disabled={submitting}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                       disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              isLoading={submitting}
            >
              {submitting
                ? "Guardando..."
                : mode === "create"
                  ? "Crear Compra"
                  : "Actualizar Compra"}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
