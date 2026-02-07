/**
 * 📄 PÁGINA: ProveedorCreate
 *
 * Página para crear un nuevo proveedor
 *
 * FLUJO:
 * 1. Inicializa estado UI (ProveedorFormData)
 * 2. Usuario completa formulario
 * 3. Envía al backend
 * 4. Redirige a listado
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";

import { ProveedorForm } from "../components/ProveedorForm";
import { useProveedorActions } from "../hooks/useProveedorActions";
import type { ProveedorFormData } from "../types/proveedor.types";

export default function ProveedorCreate() {
  const navigate = useNavigate();
  const { createProveedor, loading, error } = useProveedorActions();

  const [submitting, setSubmitting] = useState(false);

  /**
   * 🧠 Estado inicial del formulario (UI ONLY)
   */
  const [formData, setFormData] = useState<ProveedorFormData>({
    nombre: "",
    identificacion: "",
    telefono: "",
    email: "",
    direccion: "",
    estado: true,
  });

  /**
   * 🚀 Envío del formulario
   */
  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      console.log("📡 Payload enviado al backend (Proveedor):", formData);

      const newProveedor = await createProveedor(formData);

      if (newProveedor) {
        alert("¡Proveedor creado exitosamente!");
        navigate("/proveedores");
      }
    } catch (err) {
      const error = err as {
        response?: { status?: number; data?: unknown };
        message?: string;
      };

      console.error("❌ ERROR DEL BACKEND:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMsg = "Error al crear el proveedor. Revisa los datos.";

      if (error.response?.data && typeof error.response.data === "object") {
        const backendError = error.response.data as Record<string, unknown>;

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

      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * ❌ Cancelar
   */
  const handleCancel = () => {
    if (submitting) return;

    const hasData =
      formData.nombre.trim().length > 0 ||
      (formData.identificacion ?? "").trim().length > 0 ||
      (formData.telefono ?? "").trim().length > 0 ||
      (formData.email ?? "").trim().length > 0 ||
      (formData.direccion ?? "").trim().length > 0;


    if (hasData) {
      const confirmar = window.confirm(
        "¿Seguro que deseas cancelar? Se perderán los datos ingresados.",
      );
      if (!confirmar) return;
    }

    navigate("/proveedores");
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
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Proveedor</h1>
          <p className="text-gray-600 mt-1">
            Registra un proveedor para compras y abastecimiento
          </p>
        </div>
      </div>

      {/* Formulario */}
      <ProveedorForm
        value={formData}
        submitting={submitting || loading}
        error={error}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      {/* Nota */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Nota</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>El nombre del proveedor es obligatorio</li>
          <li>El documento ayuda a evitar duplicados</li>
          <li>Los proveedores activos pueden usarse en compras</li>
        </ul>
      </div>
    </div>
  );
}
