import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, PageContainer, PageHeader, Card } from "@/shared/components/ui";
import { VentaForm } from "../components/VentaForm";
import { useVentas } from "../hooks/useVenta";
import type { VentaFormData, VentaCreateInput } from "../types/venta.types";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import { IconPlus, IconLock, IconBulb, IconArrowLeft } from "@tabler/icons-react";

export default function VentaCreate() {
  const navigate = useNavigate();
  const { createVenta, fetchVentas, error } = useVentas();
  const { isCajaAbierta } = useCajaStore();
  const { showAlert, confirm } = useAlert();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<VentaFormData>({
    cliente_id: 0,
    estado: "PENDIENTE",
    tipo_documento: "FACTURA",
    detalles: [],
    total: 0,
  });

  const validateForm = (data = formData): { valid: boolean; message?: string } => {
    if (!data.cliente_id || data.cliente_id === 0) {
      return { valid: false, message: "Debes seleccionar un cliente" };
    }
    if (data.detalles.length === 0) {
      return { valid: false, message: "Debes agregar al menos un producto" };
    }
    for (let i = 0; i < data.detalles.length; i++) {
      const d = data.detalles[i];
      if (d.cantidad <= 0) return { valid: false, message: `Producto #${i + 1}: La cantidad debe ser mayor a 0` };
      if (d.precio_unitario <= 0) return { valid: false, message: `Producto #${i + 1}: El precio debe ser mayor a 0` };
      if (d.cantidad > d.stock_disponible) return { valid: false, message: `${d.producto_nombre}: Stock insuficiente (disponible: ${d.stock_disponible})` };
    }
    if (data.total <= 0) return { valid: false, message: "El total debe ser mayor a 0" };
    return { valid: true };
  };

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
      const nuevaVenta = await createVenta(apiData);
      if (nuevaVenta) {
        showAlert("¡Venta Creada!", "success", { description: "La venta se ha registrado exitosamente" });
        await fetchVentas();
        setTimeout(() => navigate(`/ventas/${nuevaVenta.id}/detalle?abrirPago=true`), 800);
      } else {
        throw new Error(error || "Error desconocido al crear venta");
      }
    } catch (errorObj) {
      const errorMsg = getApiErrorMessage(errorObj, "Error al crear la venta. Revisa los datos.");
      showAlert("Error", "error", { description: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (submitting) return;
    const hasData = formData.cliente_id !== 0 || formData.detalles.length > 0;
    if (hasData) {
      const confirmar = await confirm("Confirmar Cancelación", "¿Seguro que deseas cancelar? Se perderán los datos ingresados.", "warning");
      if (!confirmar) return;
    }
    navigate("/ventas");
  };

  return (
    <PageContainer>
      <PageHeader
        title="Nueva Venta"
        subtitle="Registra una venta a un cliente"
        icon={<IconPlus size={24} />}
        backButton={
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleCancel}
            className="p-2 h-10 w-10 flex items-center justify-center rounded-xl"
          >
            <IconArrowLeft size={20} />
          </Button>
        }
      />

      {!isCajaAbierta && (
        <Card className="border-rose-100 bg-rose-50/30 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <Card.Content className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-6 shadow-sm border border-rose-200">
              <IconLock size={40} />
            </div>
            <h2 className="text-2xl font-black text-rose-900 mb-3 tracking-tight">Caja Cerrada</h2>
            <p className="text-rose-800/80 mb-8 max-w-md font-medium">
              Para registrar ventas es necesario tener una sesión de caja abierta. 
              Esto asegura el control financiero de tu negocio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <Link to="/caja" className="flex-1">
                <Button className="w-full shadow-lg shadow-rose-200" variant="danger">
                  Abrir Caja Ahora
                </Button>
              </Link>
              <Button variant="secondary" className="flex-1" onClick={handleCancel}>
                Volver al listado
              </Button>
            </div>
          </Card.Content>
        </Card>
      )}

      {isCajaAbierta && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <VentaForm
            mode="create"
            value={formData}
            submitting={submitting}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />

          <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-200">
              <IconBulb size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-900 mb-1 uppercase tracking-wider">💡 Tip de Ventas</h3>
              <ul className="text-xs text-blue-800 space-y-1.5 list-disc list-inside font-medium opacity-90">
                <li>Busca clientes por nombre o DNI/RUC para agilizar la carga.</li>
                <li>Verifica los precios y cantidades antes de finalizar.</li>
                <li>El stock se descuenta automáticamente al completar la transacción.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

