// src/modules/compras/components/CompraForm.tsx
import { useState } from "react";
import { Card, Button, Input, Select } from "@/components/ui";
import type { Proveedor } from "@/modules/proveedores/types/proveedor.types";

import type {
  CompraFormData,
  CompraItemForm,
} from "../types/compra-form.types";

interface CompraFormProps {
  mode: "create" | "edit";
  value: CompraFormData;
  proveedores: Proveedor[]; // ← ahora ES el correcto
  loadingProveedores: boolean;
  submitting: boolean;
  error?: string | null;
  onChange: (data: CompraFormData) => void;
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
  const [items, setItems] = useState<CompraItemForm[]>(value.items);

  const proveedorOptions = proveedores.map((p) => ({
    label: p.nombre,
    value: p.id,
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value: inputValue } = e.target;
    onChange({ ...value, [name]: inputValue });
  };

  const handleItemChange = (
    index: number,
    field: keyof CompraItemForm,
    fieldValue: number,
  ) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: fieldValue } : item,
    );

    setItems(newItems);
    onChange({ ...value, items: newItems });
  };

  const addItem = () => {
    const newItem: CompraItemForm = {
      id: Date.now(),
      producto_id: 0,
      producto_nombre: "",
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0,
    };

    const newItems = [...items, newItem];
    setItems(newItems);
    onChange({ ...value, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onChange({ ...value, items: newItems });
  };

  const total = items.reduce(
    (sum, item) => sum + item.cantidad * item.precio_unitario,
    0,
  );

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
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Número de Factura"
              name="numero_factura"
              value={value.numero_factura}
              onChange={handleChange}
              disabled={submitting}
            />

            <Input
              label="Fecha"
              type="date"
              name="fecha"
              value={value.fecha}
              onChange={handleChange}
              disabled={submitting}
            />

            <Select
              label="Proveedor"
              value={value.proveedor_id}
              options={proveedorOptions}
              onChange={(val) =>
                onChange({ ...value, proveedor_id: Number(val) })
              }
              disabled={loadingProveedores || submitting}
            />

            <Input
              label="Estado"
              value={mode === "create" ? "PENDIENTE" : "EDITANDO"}
              disabled
            />
          </div>

          {/* Items */}
          <div>
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Productos</h3>
              <Button type="button" onClick={addItem}>
                + Agregar
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={item.id} className="border p-4 mb-4 rounded-lg">
                <div className="grid grid-cols-4 gap-4">
                  <Input
                    label="Producto ID"
                    type="number"
                    value={item.producto_id}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "producto_id",
                        Number(e.target.value),
                      )
                    }
                  />

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
                  />

                  <Input
                    label="Precio"
                    type="number"
                    value={item.precio_unitario}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "precio_unitario",
                        Number(e.target.value),
                      )
                    }
                  />

                  <Input
                    label="Subtotal"
                    value={(item.cantidad * item.precio_unitario).toFixed(2)}
                    disabled
                  />
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => removeItem(index)}
                  className="mt-2"
                >
                  Eliminar
                </Button>
              </div>
            ))}

            <div className="text-right font-bold text-xl">
              Total: ${total.toFixed(2)}
            </div>
          </div>

          {/* Observaciones */}
          <textarea
            name="observaciones"
            value={value.observaciones || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Observaciones"
          />

          {/* Acciones */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {mode === "create" ? "Crear Compra" : "Actualizar Compra"}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
