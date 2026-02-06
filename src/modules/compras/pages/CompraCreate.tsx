/**
 * 📄 PÁGINA: CompraCreate
 *
 * Página para crear una nueva compra
 *
 * FLUJO:
 * 1. Inicializa estado UI (CompraFormData)
 * 2. Usuario completa formulario
 * 3. Convierte UI → payload backend
 * 4. Envía al backend
 * 5. Redirige a listado
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";

import { CompraForm, type CompraFormData } from "../components/CompraForm";
import { useCompras } from "../hooks/useCompras";
import { useProveedor } from "@/modules/proveedores/hooks/useProveedor";
import { useProductos } from "@/modules/inventario/hooks/useProductos";

export default function CompraCreate() {
  const navigate = useNavigate();

  // Hooks de dominio
  const { createCompra, error } = useCompras();
  const { proveedores } = useProveedor();
  const { productos } = useProductos();

  const [submitting, setSubmitting] = useState(false);

  /**
   * 🧠 Estado inicial del formulario (UI ONLY)
   */
  const [formData, setFormData] = useState<CompraFormData>({
    proveedor: 0,
    fecha: new Date().toISOString().split("T")[0],
    observaciones: "",
    detalles: [],
    total: 0,
  });

  /**
   * 🔁 Convierte datos UI → formato backend
   * (igual filosofía que ProductoCreate)
   */
  const convertToAPIFormat = (data: CompraFormData) => {
    return {
      proveedor: data.proveedor,
      fecha: data.fecha,
      observaciones: data.observaciones?.trim() || undefined,
      detalles: data.detalles.map((d) => ({
        producto: d.producto,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
      })),
    };
  };

  /**
   * 🚀 Envío del formulario
   */
  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const apiData = convertToAPIFormat(formData);

      console.log("📡 Payload enviado al backend (Compra):", apiData);

      await createCompra(apiData);

      alert("¡Compra registrada exitosamente!");
      navigate("/compras");
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

      let errorMsg = "Error al crear la compra. Revisa los datos.";

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
      formData.proveedor !== 0 ||
      formData.detalles.length > 0 ||
      (formData.observaciones?.trim() ?? "").length > 0;

    if (hasData) {
      const confirmar = window.confirm(
        "¿Seguro que deseas cancelar? Se perderán los datos ingresados.",
      );
      if (!confirmar) return;
    }

    navigate("/compras");
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
          <h1 className="text-3xl font-bold text-gray-900">Nueva Compra</h1>
          <p className="text-gray-600 mt-1">Registra una compra de proveedor</p>
        </div>
      </div>

      {/* Formulario */}
      <CompraForm
        mode="create"
        value={formData}
        proveedores={proveedores}
        productos={productos}
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
          <li>Debes seleccionar un proveedor</li>
          <li>Agrega al menos un producto</li>
          <li>El total se calcula automáticamente</li>
          <li>La compra impactará el inventario</li>
        </ul>
      </div>
    </div>
  );
}
