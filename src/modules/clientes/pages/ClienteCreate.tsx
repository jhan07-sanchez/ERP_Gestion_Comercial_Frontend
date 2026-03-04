/**
 * 📄 PÁGINA: ClienteCreate
 * Crear nuevo cliente. Mismo patrón que VentaCreate.tsx
 *
 * FLUJO:
 * 1. Inicializa estado UI (ClienteFormData)
 * 2. Usuario llena datos del cliente
 * 3. Valida del lado del cliente
 * 4. Convierte UI → payload backend
 * 5. Crea cliente → recarga lista → redirige
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui";
import { ClienteForm } from "../components/ClienteForm";
import { useClientes } from "../hooks/useClientes";
import type { ClienteFormData } from "../types";
import { normalizeTipoDocumentoForAPI } from "../types";
import { useAlert } from "@/shared/components/alerts";

export default function ClienteCreate() {
  const navigate = useNavigate();
  const { createCliente, fetchClientes, error } = useClientes();
  const { showAlert, confirm } = useAlert();
  const [submitting, setSubmitting] = useState(false);

  // ─── Estado inicial del formulario (UI ONLY) ──────────────────────────
  const [formData, setFormData] = useState<ClienteFormData>({
    nombre: "",
    tipo_documento: "CEDULA",
    numero_documento: "",
    telefono: "",
    email: "",
    direccion: "",
    estado: "ACTIVO",
  });

  // ─── Validaciones del cliente ──────────────────────────────────────────
  const validateForm = (): { valid: boolean; message?: string } => {
    if (!formData.nombre.trim()) {
      return { valid: false, message: "El nombre es obligatorio" };
    }

    if (!formData.tipo_documento) {
      return { valid: false, message: "El tipo de documento es obligatorio" };
    }

    if (!formData.numero_documento.trim()) {
      return {
        valid: false,
        message: "El número de documento es obligatorio",
      };
    }

    if (formData.email && !formData.email.includes("@")) {
      return { valid: false, message: "El email no es válido" };
    }

    return { valid: true };
  };

  // ─── Convierte UI → payload backend ───────────────────────────────────
  const convertToAPIFormat = (data: ClienteFormData) => ({
    nombre: data.nombre.trim(),
    tipo_documento: normalizeTipoDocumentoForAPI(data.tipo_documento),
    numero_documento: data.numero_documento.trim(),
    telefono: data.telefono?.trim() || null,
    email: data.email?.trim() || null,
    direccion: data.direccion?.trim() || null,
    estado: data.estado === "ACTIVO",
  });

  // ─── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const validation = validateForm();

    if (!validation.valid) {
      showAlert("Validación", "warning", { description: validation.message });
      return;
    }

    setSubmitting(true);

    try {
      const apiData = convertToAPIFormat(formData);

      console.log("📡 Payload enviado al backend (Cliente):", apiData);

      const nuevoCliente = await createCliente(apiData);

      if (nuevoCliente) {
        console.log("✅ Cliente creado:", nuevoCliente);

        await fetchClientes();

        showAlert("¡Cliente registrado!", "success", { description: "El cliente se ha registrado exitosamente" });

        setTimeout(() => navigate("/clientes"), 500);
      } else {
        throw new Error(error || "Error desconocido al crear cliente");
      }
    } catch (err) {
      const e = err as {
        response?: { status?: number; data?: unknown };
        message?: string;
      };

      console.error("❌ ERROR DEL BACKEND:", {
        status: e.response?.status,
        data: e.response?.data,
        message: e.message,
      });

      let errorMsg = "Error al crear el cliente. Revisa los datos.";

      if (e.response?.data && typeof e.response.data === "object") {
        const backendError = e.response.data as Record<string, unknown>;

        const fieldErrors = Object.entries(backendError)
          .map(([field, messages]) => {
            const msg = Array.isArray(messages)
              ? messages.join(", ")
              : String(messages);

            return `${field}: ${msg}`;
          })
          .join("\n");

        if (fieldErrors) errorMsg = `Errores:\n${fieldErrors}`;
      }

      showAlert("Error", "error", { description: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Cancelar ──────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (submitting) return;

    const hasData =
      formData.nombre !== "" ||
      formData.numero_documento !== "" ||
      formData.telefono !== "" ||
      formData.email !== "";

    if (hasData) {
      const confirmar = await confirm(
        "Confirmar Cancelación",
        "¿Seguro que deseas cancelar? Se perderán los datos ingresados.",
        "warning"
      );

      if (!confirmar) return;
    }

    navigate("/clientes");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={submitting}
        >
          ← Volver
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Cliente</h1>

          <p className="text-gray-600 mt-1">
            Registra un nuevo cliente en el sistema
          </p>
        </div>
      </div>

      {/* Formulario */}
      <ClienteForm
        mode="create"
        value={formData}
        submitting={submitting}
        error={error}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      {/* Nota */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Nota</h3>

        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>El nombre del cliente es obligatorio</li>
          <li>El documento debe ser único</li>
          <li>El email es opcional pero recomendado</li>
          <li>El cliente quedará activo automáticamente</li>
          <li>Podrás usar este cliente inmediatamente en ventas</li>
        </ul>
      </div>
    </div>
  );
}
