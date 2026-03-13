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
import { Button } from "@/shared/components/ui";
import { VentaForm } from "../components/VentaForm";
import { useVentas } from "../hooks/useVenta";
import type { VentaFormData, VentaCreateInput } from "../types/venta.types";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import { Link } from "react-router-dom";

export default function VentaCreate() {
  const navigate = useNavigate();
  const { createVenta, fetchVentas, error } = useVentas();
  const { isCajaAbierta } = useCajaStore();
  const { showAlert, confirm } = useAlert();
  const [submitting, setSubmitting] = useState(false);

  // Estado inicial del formulario (UI ONLY)
  const [formData, setFormData] = useState<VentaFormData>({
    cliente_id: 0,
    estado: "PENDIENTE",
    tipo_documento: "FACTURA",
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
  const convertToAPIFormat = (data: VentaFormData): VentaCreateInput => ({
    cliente_id: data.cliente_id,
    estado: data.estado,
    tipo_documento: data.tipo_documento,
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
      showAlert("Validación", "warning", { description: validation.message });
      return;
    }

    setSubmitting(true);

    try {
      const apiData = convertToAPIFormat(dataToSubmit);
      console.log("📡 Payload enviado al backend (Venta):", apiData);

      const nuevaVenta = await createVenta(apiData);

      if (nuevaVenta) {
        showAlert("¡Venta Creada!", "success", { description: "La venta se ha registrado exitosamente" });
        console.log("✅ Venta creada:", nuevaVenta);
        await fetchVentas();
        // Redirigir al detalle con el parámetro para abrir el modal de pago automáticamente
        setTimeout(() => navigate(`/ventas/${nuevaVenta.id}/detalle?abrirPago=true`), 800);
      } else {
        throw new Error(error || "Error desconocido al crear venta");
      }
    } catch (errorObj) {
      console.error("❌ ERROR DEL BACKEND:", errorObj);
      const errorMsg = getApiErrorMessage(errorObj, "Error al crear la venta. Revisa los datos.");
      showAlert("Error", "error", { description: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Cancelar ──────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (submitting) return;

    const hasData = formData.cliente_id !== 0 || formData.detalles.length > 0;

    if (hasData) {
      const confirmar = await confirm(
        "Confirmar Cancelación",
        "¿Seguro que deseas cancelar? Se perderán los datos ingresados.",
        "warning"
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

      {/* Validar Caja Abierta Primero */}
      {!isCajaAbierta && (
        <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-red-200">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-5xl mb-4 text-center flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Caja Cerrada
            </h2>
            <p className="text-gray-600 mb-6">
              Para poder registrar nuevas ventas es necesario tener una sesión de caja abierta. 
              Esto es requerido para el control financiero.
            </p>
            <div className="space-y-3">
              <Link to="/caja">
                <Button className="w-full">
                  Ir a Gestión de Caja
                </Button>
              </Link>
              <Button variant="secondary" className="w-full" onClick={handleCancel}>
                Volver al listado
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      {isCajaAbierta && (
        <>
          <VentaForm
            mode="create"
            value={formData}
            submitting={submitting}
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
        </>
      )}
    </div>
  );
}
