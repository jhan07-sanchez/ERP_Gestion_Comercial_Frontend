/**
 * 📝 PÁGINA: CajaCreate (VERSIÓN ROBUSTA)
 *
 * Permite abrir una nueva caja
 *
 * MEJORAS IMPLEMENTADAS:
 * ✅ Validación del lado del cliente
 * ✅ Manejo robusto de errores
 * ✅ Loading state consistente
 * ✅ Feedback claro al usuario
 * ✅ Estructura similar a CompraCreate
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/shared/components/alerts";

import { CajaForm } from "../components/CajaForm";
import { useCajaActions } from "../hooks/useCajaActions";
import { CajaService } from "../services/cajaService";

import type { CajaFormData } from "../types/Caja.types";

export default function CajaCreatePage() {
  const navigate = useNavigate();

  // Hooks
  const { showAlert, confirm } = useAlert();
  const { loading, error, abrirCaja } = useCajaActions();

  const [submitting, setSubmitting] = useState(false);

  /**
   * 🧠 Estado inicial del formulario
   */
  const [formData, setFormData] = useState<CajaFormData>({
    nombre: "",
    monto_inicial: "",
    observaciones: "",
  });

  /**
   * ✅ Validación del lado del cliente
   */
  const validateForm = (): { valid: boolean; message?: string } => {
    if (!formData.nombre.trim()) {
      return { valid: false, message: "El nombre de la caja es obligatorio" };
    }

    if (!formData.monto_inicial) {
      return { valid: false, message: "Debes ingresar un monto inicial" };
    }

    const monto = parseFloat(formData.monto_inicial);

    if (isNaN(monto)) {
      return { valid: false, message: "El monto inicial no es válido" };
    }

    if (monto < 0) {
      return {
        valid: false,
        message: "El monto inicial no puede ser negativo",
      };
    }

    return { valid: true };
  };

  /**
   * 🔁 Convierte UI → formato backend
   */
  const convertToAPIFormat = (data: CajaFormData) => {
    return {
      caja_id: 1, // TODO: permitir seleccionar caja
      monto_inicial: parseFloat(data.monto_inicial),
      observaciones: data.observaciones?.trim() || "",
    };
  };

  /**
   * 🚀 Envío del formulario
   */
  const handleSubmit = async () => {
    console.log("📋 [CajaCreate] Iniciando apertura de caja...");

    const validation = validateForm();

    if (!validation.valid) {
      showAlert("Validación", "warning", {
        description: validation.message,
      });
      return;
    }

    setSubmitting(true);

    try {
      // Validación de dominio
      CajaService.validarApertura(
        formData.nombre,
        parseFloat(formData.monto_inicial),
      );

      const apiData = convertToAPIFormat(formData);

      console.log("📡 Payload enviado al backend:", apiData);

      const resultado = await abrirCaja(apiData);

      if (resultado) {
        console.log("✅ Caja abierta exitosamente");

        showAlert("¡Caja abierta!", "success", {
          description: "La sesión de caja se ha iniciado correctamente",
        });

        setTimeout(() => {
          navigate(`/caja/sesion/${resultado.id}`);
        }, 500);
      } else {
        throw new Error(error || "Error desconocido al abrir caja");
      }
    } catch (err) {
      console.error("❌ ERROR:", err);

      const error = err as {
        response?: { status?: number; data?: unknown };
        message?: string;
      };

      console.error("❌ ERROR DEL BACKEND:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMsg = "Error al abrir la caja.";

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

      showAlert("Error", "error", {
        description: errorMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * ❌ Cancelar
   */
  const handleCancel = async () => {
    if (submitting) return;

    const hasData =
      formData.nombre.trim() !== "" ||
      formData.monto_inicial !== "" ||
      (formData.observaciones?.trim() ?? "").length > 0;

    if (hasData) {
      const confirmar = await confirm(
        "Confirmar Cancelación",
        "¿Seguro que deseas cancelar? Se perderán los datos ingresados.",
        "warning",
      );

      if (!confirmar) return;
    }

    navigate("/caja");
  };

  /**
   * 🔄 Loading global
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Abriendo caja...</p>
        </div>
      </div>
    );
  }

  /**
   * ❌ Error global
   */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error al abrir la caja
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>

          <button
            onClick={() => navigate("/caja")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  /**
   * 🧾 Render principal
   */
  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          disabled={submitting}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          ← Volver
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Abrir Nueva Caja</h1>
          <p className="text-gray-600 mt-1">
            Inicializa una nueva sesión de caja
          </p>
        </div>
      </div>

      {/* Formulario */}

      <CajaForm
        value={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
        error={error}
        mode="create"
      />

      {/* Nota */}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Nota</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Cuenta el dinero físico antes de abrir la caja</li>
          <li>El monto inicial se registrará como apertura</li>
          <li>Solo puede haber una sesión activa por caja</li>
          <li>Al cerrar se comparará el dinero físico vs sistema</li>
        </ul>
      </div>
    </div>
  );
}
