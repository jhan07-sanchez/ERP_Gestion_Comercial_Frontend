/**
 * 📝 COMPONENTE: ProveedorForm
 *
 * Formulario reutilizable para crear y editar proveedores
 *
 * CARACTERÍSTICAS:
 * - Create / Edit
 * - Controlado (value + onChange)
 * - Validación clara
 * - UI pura (sin lógica de negocio)
 */

import { Card, Button, Input } from "@/components/ui";
import type { ProveedorFormData } from "../types/proveedor.types";

interface ProveedorFormProps {
  value: ProveedorFormData;

  // Estados
  submitting?: boolean;
  error?: string | null;

  // Eventos
  onChange: (data: ProveedorFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function ProveedorForm({
  value,
  submitting = false,
  error,
  onChange,
  onSubmit,
  onCancel,
}: ProveedorFormProps) {
  /**
   * 🔄 Cambios simples
   * (misma lógica que CompraForm)
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value: inputValue, type } = e.target as HTMLInputElement;

    let processedValue: string | boolean = inputValue;

    if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    onChange({
      ...value,
      [name]: processedValue,
    });
  };

  /**
   * ✅ Validación
   */
  const validateForm = (): boolean => {
    if (!value.nombre.trim()) {
      alert("El nombre del proveedor es obligatorio");
      return false;
    }

    if (value.email && !value.email.includes("@")) {
      alert("El email no es válido");
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

          {/* Datos principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              name="nombre"
              value={value.nombre}
              onChange={handleChange}
              disabled={submitting}
              required
            />

            <Input
              label="Documento"
              name="identificacion"
              value={value.identificacion ?? ""}
              onChange={handleChange}
              disabled={submitting}
            />

            <Input
              label="Teléfono"
              name="telefono"
              value={value.telefono ?? ""}
              onChange={handleChange}
              disabled={submitting}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={value.email ?? ""}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          {/* Dirección */}
          <textarea
            name="direccion"
            value={value.direccion ?? ""}
            onChange={handleChange}
            rows={3}
            placeholder="Dirección..."
            className="w-full border rounded-lg p-3"
            disabled={submitting}
          />

          {/* Fecha de Creación */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Fecha de Creación
            </h2>
            <Input
              label="Fecha de Ingreso"
              type="date"
              name="fecha_ingreso"
              value={value.fecha_creacion ? value.fecha_creacion.split("T")[0] : ""}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          {/* Estado */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="estado"
              checked={value.estado}
              onChange={handleChange}
              disabled={submitting}
            />
            Proveedor activo
          </label>

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
              Guardar Proveedor
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
