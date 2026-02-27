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
import { getApiErrorMessage } from "@/utils/apiError";

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
  const validateForm = (data = formData): { valid: boolean; message?: string } => {
    if (!data.cliente_id || data.cliente_id === 0) {
      return { valid: false, message: "Debes seleccionar un cliente" };
    }

    if (data.detalles.length === 0) {
      return { valid: false, message: "Debes agregar al menos un producto" };
    }

    for (let i = 0; i < data.detalles.length; i++) {
      const d = data.detalles[i];

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

    if (data.total <= 0) {
      return { valid: false, message: "El total debe ser mayor a 0" };
    }

    return { valid: true };
  };

  // ─── Convierte UI → payload backend ───────────────────────────────────
  const convertToAPIFormat = (data: VentaFormData) => ({
    cliente_id: data.cliente_id,
    estado: data.estado,
    metodo_pago: data.metodo_pago,
    monto_recibido: data.monto_recibido,
    vuelto: data.vuelto,
    detalles: data.detalles.map((d) => ({
      producto_id: d.producto_id,
      cantidad: d.cantidad,
      precio_unitario: d.precio_unitario,
    })),
  });

  // ─── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (updatedData?: VentaFormData) => {
    const dataToSubmit = updatedData || formData;
    const validation = validateForm(dataToSubmit);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    setSubmitting(true);

    try {
      const apiData = convertToAPIFormat(dataToSubmit);
      console.log("📡 Payload enviado al backend (Venta):", apiData);

      const nuevaVenta = await createVenta(apiData);

      if (nuevaVenta) {
        console.log("✅ Venta creada:", nuevaVenta);
        await fetchVentas();
        // Redirigir al detalle con el parámetro para abrir el modal de pago automáticamente
        setTimeout(() => navigate(`/ventas/${nuevaVenta.id}/detalle?abrirPago=true`), 300);
      } else {
        throw new Error(error || "Error desconocido al crear venta");
      }
    } catch (errorObj) {
      console.error("❌ ERROR DEL BACKEND:", errorObj);
      const errorMsg = getApiErrorMessage(errorObj, "Error al crear la venta. Revisa los datos.");
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
