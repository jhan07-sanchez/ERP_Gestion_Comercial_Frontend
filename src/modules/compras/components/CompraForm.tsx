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
import React, { useState } from "react";
import { Card, Button, Input, Badge, Select } from "@/shared/components/ui";
import type { EstadoCompra } from "../types";
import { formatCurrency } from "@/shared/utils/formatters";
import { useAlert } from "@/shared/components/alerts";
import { useConfiguracion } from "@/modules/configuracion/hooks/useConfiguracion";


/**
 * 🔹 Detalle de compra (UI ONLY)
 */
export interface CompraDetalleForm {
  producto: number;
  cantidad: number | "";
  precio_unitario: number | "";
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
  value: valueForm,
  proveedores,
  productos,
  submitting = false,
  error,
  mode = "create",
  onChange,
  onSubmit,
  onCancel,
}: CompraFormProps) {
  const { showAlert } = useAlert();
  const { config } = useConfiguracion();
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
    const { name, value: inputValue, type } = e.target;

    let processedValue: string | number | boolean | null;

    if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      processedValue = inputValue === "" ? "" : Number(inputValue);
    } else {
      processedValue = inputValue;
    }

    onChange({
      ...valueForm,
      [name]: processedValue,
    });
  };

  /**
   * ➕ Agregar detalle
   */
  const addDetalle = () => {
    const nuevosDetalles = [
      ...valueForm.detalles,
      { producto: 0, cantidad: 1, precio_unitario: 0, subtotal: 0 },
    ];

    onChange({
      ...valueForm,
      detalles: nuevosDetalles,
      total: calcularTotal(nuevosDetalles),
    });
  };

  /**
   * ❌ Eliminar detalle
   */
  const removeDetalle = (index: number) => {
    const nuevosDetalles = valueForm.detalles.filter((_, i) => i !== index);

    onChange({
      ...valueForm,
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
    newValue: number | "",
  ) => {
    const detalles = [...valueForm.detalles];

    const detalleActualizado = {
      ...detalles[index],
      [field]: newValue,
    };

    detalleActualizado.subtotal =
      (Number(detalleActualizado.cantidad) || 0) * (Number(detalleActualizado.precio_unitario) || 0);

    detalles[index] = detalleActualizado;

    onChange({
      ...valueForm,
      detalles,
      total: calcularTotal(detalles),
    });
  };

  /**
   * ✅ Validación
   */
  const validateForm = (): boolean => {
    if (!valueForm.proveedor_id) {
      showAlert("Validación", "warning", { description: "Debes seleccionar un proveedor para la compra" });
      return false;
    }

    if (!valueForm.fecha) {
      showAlert("Validación", "warning", { description: "La fecha de la compra es obligatoria" });
      return false;
    }

    if (valueForm.detalles.length === 0) {
      showAlert("Validación", "warning", { description: "Debes agregar al menos un producto a la compra" });
      return false;
    }

    if (
      valueForm.detalles.some(
        (d) => !d.producto || Number(d.cantidad) <= 0 || Number(d.precio_unitario) <= 0,
      )
    ) {
      showAlert("Validación", "warning", { description: "Revisa que todos los productos seleccionados tengan cantidad y precio válidos" });
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
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  return (
    <Card>
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error */}
          {error && (
            <div className="p-4 bg-danger-50 border border-danger-200 rounded-xl shadow-sm">
              <p className="text-danger-700 font-medium">{error}</p>
            </div>
          )}

          {/* Información general */}
          <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-semibold text-primary-800">
              Información General
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Proveedor */}
              <div className="space-y-2">
                <Select
                  name="proveedor_id"
                  label="Proveedor"
                  value={valueForm.proveedor_id || 0}
                  onChange={(value) =>
                    onChange({
                      ...valueForm,
                      proveedor_id: Number(value),
                    })
                  }
                  disabled={submitting}
                  options={[
                    { value: 0, label: "Seleccionar proveedor" },
                    ...proveedores.map(p => ({ value: p.id, label: p.nombre }))
                  ]}
                />
              </div>

              {/* Fecha */}
              <Input
                type="date"
                name="fecha"
                label="Fecha"
                value={valueForm.fecha}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            {/* Preview del Próximo Correlativo de Compra */}
            {config && (
              <div className="flex items-center gap-2 text-sm text-primary-500 bg-accent-50/50 p-3 rounded-xl border border-accent-100 w-full md:w-fit">
                <span className="font-medium text-accent-700">
                  N° de Compra (Siguiente):
                </span>
                <Badge variant="success" className="font-mono scale-110">
                  {config.numero_compra_preview}
                </Badge>
              </div>
            )}

            {/* Observaciones */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-600">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={valueForm.observaciones ?? ""}
                onChange={handleChange}
                rows={3}
                placeholder="Escribe una nota adicional sobre la compra..."
                className="w-full border border-primary-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition resize-none"
                disabled={submitting}
              />
            </div>
          </div>

          {/* Detalles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Seleccionar productos</h3>

            {/* Encabezado tipo tabla */}
            {valueForm.detalles.length > 0 && (
              <div className="grid grid-cols-5 gap-3 bg-primary-100 px-3 py-2 rounded-lg font-semibold text-sm text-primary-600">
                <div>Producto</div>
                <div className="text-center">Cantidad</div>
                <div className="text-center">Precio Unitario</div>
                <div className="text-right">Subtotal</div>
                <div></div>
              </div>
            )}

            {valueForm.detalles.map((detalle, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-3 items-center bg-white px-3 py-2 rounded-lg border border-primary-200 shadow-sm"
              >
                {/* Producto */}
                <div className="w-full">
                  <Select
                    name="producto"
                    label=""
                    value={detalle.producto || 0}
                    onChange={(value) =>
                      updateDetalle(index, "producto", Number(value))
                    }
                    options={[
                      { value: 0, label: "Producto" },
                      ...productos.map(p => ({ value: p.id, label: p.nombre }))
                    ]}
                  />
                </div>

                {/* Cantidad */}
                <Input
                  type="number"
                  label=""
                  value={detalle.cantidad ?? ""}
                  onChange={(e) =>
                    updateDetalle(index, "cantidad", e.target.value === "" ? "" : Number(e.target.value))
                  }
                  min={1}
                />

                {/* Precio Unitario */}
                <Input
                  type="text"
                  label=""
                  value={
                    focusedIndex === index
                      ? detalle.precio_unitario.toString()
                      : formatCurrency(Number(detalle.precio_unitario) || 0)
                  }
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9]/g, "");
                    updateDetalle(index, "precio_unitario", Number(clean || 0));
                  }}
                />

                {/* Subtotal */}
                <div className="font-semibold text-right text-success-600">
                  {formatCurrency(detalle.subtotal)}
                </div>

                {/* Eliminar */}
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
          <div className="flex justify-end">
            <div className="bg-primary-900 text-white px-8 py-4 rounded-xl shadow-lg min-w-[250px] text-right">
              <p className="text-sm uppercase tracking-wide text-primary-300">
                Total de la Compra
              </p>
              <p className="text-3xl font-bold mt-1">
                {formatCurrency(valueForm.total)}
              </p>
            </div>
          </div>

          {/* Estado (solo edit) */}
          {mode === "edit" && (
            <Select
              name="estado"
              label=""
              value={valueForm.estado ?? "pendiente"}
              onChange={(value) =>
                onChange({
                  ...valueForm,
                  estado: value as EstadoCompra,
                })
              }
              disabled={submitting}
              options={[
                { value: "PENDIENTE", label: "Pendiente" },
                { value: "REALIZADA", label: "Realizada" },
                { value: "ANULADA", label: "Anulada" }
              ]}
            />
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
