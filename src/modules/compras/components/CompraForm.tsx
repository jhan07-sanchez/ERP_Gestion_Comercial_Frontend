/**
 * 📝 COMPONENTE: CompraForm
 *
 * Formulario reutilizable para crear y editar compras
 * Maneja validación, estados de carga y cálculo de totales
 *
 * CARACTERÍSTICAS:
 * - Create / Edit
 * - Manejo de detalles (productos)
 * - Cálculo automático de subtotales y total
 * - Validación clara
 */

import { Card, Button, Input } from "@/components/ui";
import type { EstadoCompra } from "../types";

/**
 * 🔹 Detalle de compra (UI ONLY)
 */
export interface CompraDetalleForm {
  producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number; // calculado en UI
}

/**
 * 🔹 Datos del formulario (UI ONLY)
 */
export interface CompraFormData {
  proveedor_id: number;
  fecha: string; // YYYY-MM-DD
  observaciones?: string;
  detalles: CompraDetalleForm[];
  total: number; // calculado en UI
  estado?: EstadoCompra; // solo en edit
}

interface CompraFormProps {
  value: CompraFormData;

  // Catálogos
  proveedores: { id: number; nombre: string }[];
  productos: { id: number; nombre: string }[];

  // Estados
  submitting?: boolean;
  error?: string | null;

  // Modo
  mode?: "create" | "edit";

  // Eventos
  onChange: (data: CompraFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function CompraForm({
  value,
  proveedores,
  productos,
  submitting = false,
  error,
  mode = "create",
  onChange,
  onSubmit,
  onCancel,
}: CompraFormProps) {
  /**
   * 🔁 Recalcula total
   */
  const calcularTotal = (detalles: CompraDetalleForm[]) =>
    detalles.reduce((sum, d) => sum + d.subtotal, 0);

  /**
   * 🔄 Cambios simples
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value: inputValue, type } = e.target as HTMLInputElement;

    let processedValue: string | number | boolean = inputValue;

    if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    onChange({
      ...value,
      [name]: processedValue,
    });
  };

  /**
   * ➕ Agregar detalle
   */
  const addDetalle = () => {
    const nuevosDetalles = [
      ...value.detalles,
      { producto: 0, cantidad: 1, precio_unitario: 0, subtotal: 0 },
    ];

    onChange({
      ...value,
      detalles: nuevosDetalles,
      total: calcularTotal(nuevosDetalles),
    });
  };

  /**
   * ❌ Eliminar detalle
   */
  const removeDetalle = (index: number) => {
    const nuevosDetalles = value.detalles.filter((_, i) => i !== index);

    onChange({
      ...value,
      detalles: nuevosDetalles,
      total: calcularTotal(nuevosDetalles),
    });
  };

  /**
   * ✏️ Actualizar detalle
   */
  const updateDetalle = (
    index: number,
    field: keyof CompraDetalleForm,
    newValue: number,
  ) => {
    const detalles = [...value.detalles];

    const detalleActualizado = {
      ...detalles[index],
      [field]: newValue,
    };

    detalleActualizado.subtotal =
      detalleActualizado.cantidad * detalleActualizado.precio_unitario;

    detalles[index] = detalleActualizado;

    onChange({
      ...value,
      detalles,
      total: calcularTotal(detalles),
    });
  };

  /**
   * ✅ Validación
   */
  const validateForm = (): boolean => {
    if (!value.proveedor_id) {
      alert("Debes seleccionar un proveedor");
      return false;
    }

    if (!value.fecha) {
      alert("La fecha es obligatoria");
      return false;
    }

    if (value.detalles.length === 0) {
      alert("Debes agregar al menos un producto");
      return false;
    }

    if (
      value.detalles.some(
        (d) => !d.producto || d.cantidad <= 0 || d.precio_unitario <= 0,
      )
    ) {
      alert("Revisa los productos, cantidades y precios");
      return false;
    }

    return true;
  };

  /**
   * 🚀 Envío
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit();
  };

  return (
    <Card>
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Información general */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="proveedor_id"
              value={value.proveedor_id || 0}
              onChange={(e) =>
                onChange({
                  ...value,
                  proveedor_id: Number(e.target.value), //  aquí convertimos
                })
              }
              disabled={submitting}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value={0}>Seleccionar proveedor</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>

            <Input
              type="date"
              name="fecha"
              label="Fecha"
              value={value.fecha}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          {/* Observaciones */}
          <textarea
            name="observaciones"
            value={value.observaciones ?? ""}
            onChange={handleChange}
            rows={3}
            placeholder="Observaciones..."
            className="w-full border rounded-lg p-3"
            disabled={submitting}
          />

          {/* Detalles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Productos</h3>

            {value.detalles.map((detalle, index) => (
              <div key={index} className="grid grid-cols-5 gap-3 items-center">
                <select
                  value={detalle.producto || 0}
                  onChange={(e) =>
                    updateDetalle(index, "producto", Number(e.target.value))
                  }
                  className="border rounded-lg px-2 py-1"
                >
                  <option value={0}>Producto</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

                <Input
                  type="number"
                  value={detalle.cantidad}
                  onChange={(e) =>
                    updateDetalle(index, "cantidad", Number(e.target.value))
                  }
                  min={1}
                />

                <Input
                  type="number"
                  value={detalle.precio_unitario}
                  onChange={(e) =>
                    updateDetalle(
                      index,
                      "precio_unitario",
                      Number(e.target.value),
                    )
                  }
                  min={0}
                  step="0.01"
                />

                <div className="font-medium">
                  ${detalle.subtotal.toFixed(2)}
                </div>

                <Button
                  type="button"
                  variant="danger"
                  onClick={() => removeDetalle(index)}
                >
                  ✕
                </Button>
              </div>
            ))}

            <Button type="button" onClick={addDetalle}>
              + Agregar producto
            </Button>
          </div>

          {/* Total */}
          <div className="text-right text-xl font-bold">
            Total: ${value.total.toFixed(2)}
          </div>

          {/* Estado (solo edit) */}
          {mode === "edit" && (
            <select
              name="estado"
              value={value.estado ?? "pendiente"}
              onChange={(e) =>
                onChange({
                  ...value,
                  estado: e.target.value as EstadoCompra,
                })
              }
              disabled={submitting}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="REALIZADA">Realizada</option>
              <option value="ANULADA">Anulada</option>
            </select>
          )}

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

            <Button type="submit" isLoading={submitting}>
              {mode === "create" ? "Crear Compra" : "Actualizar Compra"}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
