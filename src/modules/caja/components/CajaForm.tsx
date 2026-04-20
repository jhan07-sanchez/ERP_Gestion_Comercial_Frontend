import React from "react";
import { Card, Input, Button } from "@/shared/components/ui";
import type { CajaFormData } from "../types/Caja.types";
import { useAlert } from "@/shared/components/alerts";
import { IconWallet, IconAlertCircle } from "@tabler/icons-react";

interface CajaFormProps {
  value: CajaFormData;
  onChange: (data: CajaFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitting?: boolean;
  error?: string | null;
  mode?: "create" | "edit";
}

export function CajaForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  submitting = false,
  error,
  mode = "create",
}: CajaFormProps) {
  const { showAlert } = useAlert();

  // VALIDACIÓN
  const validateForm = (): boolean => {
    if (!value.nombre?.trim()) {
      showAlert("Validación", "warning", {
        description: "El nombre de la caja es obligatorio.",
      });
      return false;
    }

    if (value.nombre.trim().length < 3) {
      showAlert("Validación", "warning", {
        description: "El nombre debe tener al menos 3 caracteres.",
      });
      return false;
    }

    if (value.nombre.length > 100) {
      showAlert("Validación", "warning", {
        description: "El nombre no puede superar 100 caracteres.",
      });
      return false;
    }

    if (value.monto_inicial === undefined || value.monto_inicial === null || value.monto_inicial === "") {
      showAlert("Validación", "warning", {
        description: "El monto inicial es obligatorio.",
      });
      return false;
    }

    const monto = Number(value.monto_inicial);

    if (isNaN(monto)) {
      showAlert("Validación", "warning", {
        description: "El monto debe ser un número válido.",
      });
      return false;
    }

    if (monto < 0) {
      showAlert("Validación", "warning", {
        description: "El monto inicial no puede ser negativo.",
      });
      return false;
    }

    if (value.observaciones && value.observaciones.length > 500) {
      showAlert("Validación", "warning", {
        description: "Las observaciones no pueden superar 500 caracteres.",
      });
      return false;
    }

    return true;
  };

  // CAMBIOS
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value: inputValue, type } = e.target;

    let fieldValue: string | number | boolean | null;

    if (type === "checkbox") {
      fieldValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      fieldValue = inputValue === "" ? "" : Number(inputValue);
    } else {
      fieldValue = inputValue;
    }

    onChange({
      ...value,
      [name]: fieldValue as string | number | boolean | null,
    });
  };

  // SUBMIT
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit();
  };

  return (
    <Card>
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error backend */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-start gap-3 pb-6 border-b border-gray-200">
            <div className="p-3 rounded-lg bg-blue-50">
              <IconWallet size={20} className="text-blue-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {mode === "create"
                  ? "Abrir Nueva Caja"
                  : "Editar Información de Caja"}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Ingresa los datos para abrir la caja.
              </p>
            </div>
          </div>

          {/* Información */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Información de la Caja
            </h3>

            {/* Nombre */}
            <Input
              label="Nombre de la Caja"
              name="nombre"
              type="text"
              placeholder="Ej: Caja Principal"
              value={value.nombre || ""}
              onChange={handleChange}
              disabled={submitting}
              maxLength={100}
            />

            {/* Monto inicial */}
            <Input
              label="Monto Inicial"
              name="monto_inicial"
              type="number"
              placeholder="0.00"
              value={value.monto_inicial || ""}
              onChange={handleChange}
              disabled={submitting}
            />

            {/* Observaciones */}
            <Input
              label="Observaciones"
              name="observaciones"
              type="textarea"
              placeholder="Notas adicionales"
              value={value.observaciones || ""}
              onChange={handleChange}
              disabled={submitting}
              maxLength={500}
            />
          </div>

          {/* Resumen */}
          <div className="flex justify-end">
            <div className="bg-gray-900 text-white px-8 py-4 rounded-xl shadow-lg min-w-[250px] text-right">
              <p className="text-sm uppercase tracking-wide text-gray-300">
                Monto Inicial
              </p>

              <p className="text-3xl font-bold mt-1">
                ${value.monto_inicial || "0.00"}
              </p>
            </div>
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

            <Button type="submit" isLoading={submitting}>
              {mode === "create" ? "Abrir Caja" : "Guardar Cambios"}
            </Button>
          </div>

          {/* Nota */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
            <IconAlertCircle size={18} className="text-amber-600 mt-1" />

            <div className="text-sm text-amber-700">
              <p className="font-medium mb-1">Datos obligatorios</p>

              <ul className="list-disc list-inside text-xs space-y-1">
                <li>Nombre de la caja</li>
                <li>Monto inicial del dinero físico</li>
              </ul>
            </div>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
