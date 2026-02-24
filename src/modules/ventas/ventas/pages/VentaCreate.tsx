/**
 * 📄 PÁGINA: VentaCreate
 * Crear nueva venta. Mismo patrón que CompraCreate.tsx
 *
 * FLUJO:
 * 1. Inicializa estado UI (VentaFormData)
 * 2. Usuario busca cliente y agrega productos
 * 3. Valida del lado del cliente
 * 4. Convierte UI → payload backend
 * 5. Crea venta → recarga lista → redirige
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { VentaForm } from "../components/VentaForm";
import { useVentas } from "../hooks/useVenta";
import type { VentaFormData } from "../types/venta.types";

export default function VentaCreate() {
  const navigate = useNavigate();
  const { createVenta, fetchVentas, error } = useVentas();
  const [submitting, setSubmitting] = useState(false);

  // Estado inicial del formulario (UI ONLY)
  const [formData, setFormData] = useState<VentaFormData>({
    cliente_id: 0,
    estado: "PENDIENTE",
    detalles: [],
    total: 0,
  });

  // ─── Validaciones del cliente ──────────────────────────────────────────
  const validateForm = (): { valid: boolean; message?: string } => {
    if (!formData.cliente_id || formData.cliente_id === 0) {
      return { valid: false, message: "Debes seleccionar un cliente" };
    }

    if (formData.detalles.length === 0) {
      return { valid: false, message: "Debes agregar al menos un producto" };
    }

    for (let i = 0; i < formData.detalles.length; i++) {
      const d = formData.detalles[i];

      if (d.cantidad <= 0) {
        return {
          valid: false,
          message: `Producto #${i + 1}: La cantidad debe ser mayor a 0`,
        };
      }

      if (d.precio_unitario <= 0) {
        return {
          valid: false,
          message: `Producto #${i + 1}: El precio debe ser mayor a 0`,
        };
      }

      if (d.cantidad > d.stock_disponible) {
        return {
          valid: false,
          message: `${d.producto_nombre}: Stock insuficiente (disponible: ${d.stock_disponible})`,
        };
      }
    }

    if (formData.total <= 0) {
      return { valid: false, message: "El total debe ser mayor a 0" };
    }

    return { valid: true };
  };

  // ─── Convierte UI → payload backend ───────────────────────────────────
  const convertToAPIFormat = (data: VentaFormData) => ({
    cliente_id: data.cliente_id,
    estado: data.estado,
    detalles: data.detalles.map((d) => ({
      producto_id: d.producto_id,
      cantidad: d.cantidad,
      precio_unitario: d.precio_unitario,
    })),
  });

  // ─── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    setSubmitting(true);

    try {
      const apiData = convertToAPIFormat(formData);
      console.log("📡 Payload enviado al backend (Venta):", apiData);

      const nuevaVenta = await createVenta(apiData);

      if (nuevaVenta) {
        console.log("✅ Venta creada:", nuevaVenta);
        await fetchVentas();
        alert("¡Venta registrada exitosamente!");
        setTimeout(() => navigate("/ventas"), 500);
      } else {
        throw new Error(error || "Error desconocido al crear venta");
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

      let errorMsg = "Error al crear la venta. Revisa los datos.";

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

      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Cancelar ──────────────────────────────────────────────────────────
  const handleCancel = () => {
    if (submitting) return;

    const hasData = formData.cliente_id !== 0 || formData.detalles.length > 0;

    if (hasData) {
      const confirmar = window.confirm(
        "¿Seguro que deseas cancelar? Se perderán los datos ingresados.",
      );
      if (!confirmar) return;
    }

    navigate("/ventas");
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
          <h1 className="text-3xl font-bold text-gray-900">Nueva Venta</h1>
          <p className="text-gray-600 mt-1">Registra una venta a un cliente</p>
        </div>
      </div>

      {/* Formulario */}
      <VentaForm
        mode="create"
        value={formData}
        submitting={submitting}
        error={error}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      {/* Nota informativa */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Nota</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Busca el cliente por nombre o documento</li>
          <li>Busca y agrega productos al carrito</li>
          <li>El sistema valida el stock disponible</li>
          <li>El total se calcula automáticamente</li>
          <li>Una venta completada descuenta el stock del inventario</li>
        </ul>
      </div>
    </div>
  );
}
