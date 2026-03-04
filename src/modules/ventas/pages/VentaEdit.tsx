/**
 * 📄 PÁGINA: VentaEdit
 * Editar venta existente. Mismo patrón que CompraEdit.tsx
 *
 * FLUJO:
 * 1. Carga venta por ID
 * 2. Mapea datos → VentaFormData (UI)
 * 3. Usuario edita
 * 4. Valida del lado del cliente
 * 5. Convierte UI → payload backend
 * 6. Actualiza → recarga → redirige
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui";
import { VentaForm } from "../components/VentaForm";
import { useVentas } from "../hooks/useVenta";
import type {
  VentaFormData,
  VentaUpdateInput,
  ClienteParaVenta,
} from "../types/venta.types";
import { useAlert } from "@/shared/components/alerts";

export default function VentaEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getVenta, updateVenta, fetchVentas, error } = useVentas();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<VentaFormData | null>(null);
  const [clienteInicial, setClienteInicial] = useState<ClienteParaVenta | null>(
    null,
  );

  // ─── Cargar venta ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const loadVenta = async () => {
      try {
        const venta = await getVenta(Number(id));

        console.log("📦 Venta recibida para editar:", venta);

        // Mapear cliente inicial para el formulario
        setClienteInicial({
          id: venta.cliente_info.id,
          nombre: venta.cliente_info.nombre,
          documento: venta.cliente_info.numero_documento,
          telefono: venta.cliente_info.telefono,
          email: venta.cliente_info.email,
        });

        // Mapear a VentaFormData (UI ONLY)
        const mapped: VentaFormData = {
          cliente_id: venta.cliente,
          estado: venta.estado,
          total: Number(venta.total),
          detalles: venta.detalles.map((d) => ({
            producto_id: d.producto,
            producto_codigo: d.producto_codigo,
            producto_nombre: d.producto_nombre,
            stock_disponible: d.cantidad, // mínimo lo que ya tiene comprado
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
            subtotal: d.subtotal,
          })),
        };

        setFormData(mapped);
      } catch (err) {
        console.error("❌ Error cargando venta:", err);
        showAlert("Error", "error", { description: "Error al cargar la venta. Volviendo al listado..." });
        navigate("/ventas");
      } finally {
        setLoading(false);
      }
    };

    loadVenta();
  }, [id, getVenta, navigate, showAlert]);

  // ─── Convertir UI → payload backend ───────────────────────────────────
  const convertToAPIFormat = (data: VentaFormData): VentaUpdateInput => ({
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
    if (!id || (!formData && !updatedData)) return;

    setSubmitting(true);

    try {
      const dataToSubmit = updatedData || formData!;
      const apiData = convertToAPIFormat(dataToSubmit);
      console.log("📡 Payload actualización venta:", apiData);

      const success = await updateVenta(Number(id), apiData);

      if (success) {
        console.log("✅ Venta actualizada");
        await fetchVentas();
        showAlert("¡Venta Actualizada!", "success", { description: "La venta se ha actualizado correctamente" });
        navigate("/ventas");
      } else {
        throw new Error(error || "Error desconocido al actualizar");
      }
    } catch (err) {
      console.error("❌ Error actualizando venta:", err);
      showAlert("Error", "error", {
        description: "Error al actualizar la venta. Revisa los datos e intenta de nuevo."
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Cancelar ──────────────────────────────────────────────────────────
  const handleCancel = () => {
    if (submitting) return;
    navigate("/ventas");
  };

  // ─── Loading ───────────────────────────────────────────────────────────
  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando venta...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Venta #{id}
          </h1>
          <p className="text-gray-600 mt-1">
            Modifica la información de la venta seleccionada
          </p>
        </div>
      </div>

      {/* Formulario */}
      <VentaForm
        key={`venta-edit-${id}-${formData.cliente_id}-${formData.detalles.length}`}
        mode="edit"
        value={formData}
        clienteInicial={clienteInicial}
        submitting={submitting}
        error={error}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      {/* Advertencia */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-sm font-semibold text-yellow-900 mb-2">
          ⚠️ Importante
        </h3>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>Solo se pueden editar ventas en estado PENDIENTE</li>
          <li>Los cambios en productos afectan el stock al completar</li>
          <li>Verifica las cantidades antes de guardar</li>
        </ul>
      </div>
    </div>
  );
}
