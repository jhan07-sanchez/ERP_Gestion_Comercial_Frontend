/**
 * 📝 COMPONENTE: ClienteForm
 *
 * Formulario reutilizable para crear y editar clientes.
 * MISMO patrón que VentaForm.tsx
 *
 * CARACTERÍSTICAS:
 * - Create / Edit
 * - Control total desde el padre
 * - Validación clara
 * - Manejo de errores
 * - Estado submitting
 */

import { Card, Button, Input } from "@/components/ui";
import type { ClienteFormData, EstadoCliente } from "../types/cliente.types";
import { useAlert } from "@/components/alerts";

interface ClienteFormProps {
  value: ClienteFormData;

  submitting?: boolean;
  error?: string | null;

  mode?: "create" | "edit";

  onChange: (data: ClienteFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function ClienteForm({
  value,
  submitting = false,
  error,
  mode = "create",
  onChange,
  onSubmit,
  onCancel,
}: ClienteFormProps) {
  const { showAlert } = useAlert();
  // ─── Validación ─────────────────────────────
  const validateForm = (): boolean => {
    if (!value.nombre?.trim()) {
      showAlert("Validación", "warning", { description: "El nombre del cliente es obligatorio" });
      return false;
    }

    if (value.numero_documento && value.numero_documento.length < 5) {
      showAlert("Validación", "warning", { description: "El número de documento no parece válido (mínimo 5 caracteres)" });
      return false;
    }

    if (value.telefono && value.telefono.length < 7) {
      showAlert("Validación", "warning", { description: "El número de teléfono no parece válido (mínimo 7 dígitos)" });
      return false;
    }

    return true;
  };

  // ─── Submit ─────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit();
  };

  return (
    <Card>
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error global */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* ───── Datos del cliente ───── */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Datos del Cliente
            </h3>

            <Input
              label="Nombre *"
              value={value.nombre || ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  nombre: e.target.value,
                })
              }
              disabled={submitting}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tipo de documento
              </label>

              <select
                value={value.tipo_documento || "CEDULA"} // Valor por defecto opcional
                onChange={(e) =>
                  onChange({
                    ...value,
                    tipo_documento: e.target.value,
                  })
                }
                disabled={submitting}
                className="
                  w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-400
                "
              >
                <option value="Cédula de ciudadanía">
                  Cédula de ciudadanía
                </option>
                <option value="NIT">NIT</option>
                <option value="Cédula extranjera">Cédula extranjera</option>
              </select>
            </div>

            <Input
              label="numero de documento"
              value={value.numero_documento || ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  numero_documento: e.target.value,
                })
              }
              disabled={submitting}
            />

            <Input
              label="Teléfono"
              value={value.telefono || ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  telefono: e.target.value,
                })
              }
              disabled={submitting}
            />

            <Input
              label="Email"
              type="email"
              value={value.email || ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  email: e.target.value,
                })
              }
              disabled={submitting}
            />

            <Input
              label="Dirección"
              value={value.direccion || ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  direccion: e.target.value,
                })
              }
              disabled={submitting}
            />

            {/* Estado solo en edit */}
            {mode === "edit" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Estado
                </label>

                <select
                  value={value.estado ? "true" : "false"}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      estado: e.target.value as EstadoCliente,
                    })
                  }
                  disabled={submitting}
                  className="
                    w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-400
                  "
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>
            )}
          </div>

          {/* ───── Acciones ───── */}
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
              {mode === "create" ? "Crear Cliente" : "Actualizar Cliente"}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
