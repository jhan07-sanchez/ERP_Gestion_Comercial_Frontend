import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button, PageContainer, PageHeader, Card } from "@/shared/components/ui";
import { VentaForm } from "../components/VentaForm";
import { useVentas } from "../hooks/useVenta";
import type {
  VentaFormData,
  VentaUpdateInput,
  ClienteParaVenta,
} from "../types/venta.types";
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import { IconEdit, IconLock, IconAlertTriangle, IconArrowLeft } from "@tabler/icons-react";

export default function VentaEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVenta, updateVenta, fetchVentas, error } = useVentas();
  const { showAlert } = useAlert();
  const { isCajaAbierta } = useCajaStore();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<VentaFormData | null>(null);
  const [clienteInicial, setClienteInicial] = useState<ClienteParaVenta | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadVenta = async () => {
      try {
        const venta = await getVenta(Number(id));
        setClienteInicial({
          id: venta.cliente_info.id,
          nombre: venta.cliente_info.nombre,
          numero_documento: venta.cliente_info.numero_documento,
          telefono: venta.cliente_info.telefono,
          email: venta.cliente_info.email,
        });

        const mapped: VentaFormData = {
          id: venta.id,
          numero_documento: venta.numero_documento,
          cliente_id: venta.cliente,
          estado: venta.estado,
          tipo_documento: venta.tipo_documento,
          total: Number(venta.total),
          detalles: venta.detalles.map((d) => ({
            producto_id: d.producto,
            producto_codigo: d.producto_codigo,
            producto_nombre: d.producto_nombre,
            stock_disponible: d.cantidad,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
            subtotal: d.subtotal,
          })),
        };
        setFormData(mapped);
      } catch {
        showAlert("Error", "error", { description: "Error al cargar la venta. Volviendo al listado..." });
        navigate("/ventas");
      } finally {
        setLoading(false);
      }
    };
    loadVenta();
  }, [id, getVenta, navigate, showAlert]);

  const convertToAPIFormat = (data: VentaFormData): VentaUpdateInput => ({
    cliente_id: data.cliente_id,
    estado: data.estado,
    metodo_pago: data.metodo_pago,
    monto_recibido: data.monto_recibido ? Number(data.monto_recibido) : undefined,
    vuelto: data.vuelto ? Number(data.vuelto) : undefined,
    detalles: data.detalles.map((d) => ({
      producto_id: d.producto_id,
      cantidad: Number(d.cantidad) || 0,
      precio_unitario: Number(d.precio_unitario) || 0,
    })),
  });

  const handleSubmit = async (updatedData?: VentaFormData) => {
    if (!id || (!formData && !updatedData)) return;
    setSubmitting(true);
    try {
      const dataToSubmit = updatedData || formData!;
      const apiData = convertToAPIFormat(dataToSubmit);
      const success = await updateVenta(Number(id), apiData);
      if (success) {
        await fetchVentas();
        showAlert("¡Venta Actualizada!", "success", { description: "La venta se ha actualizado correctamente" });
        setTimeout(() => navigate("/ventas"), 800);
      } else {
        throw new Error(error || "Error desconocido al actualizar");
      }
    } catch {
      showAlert("Error", "error", { description: "Error al actualizar la venta. Revisa los datos e intenta de nuevo." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (submitting) return;
    navigate("/ventas");
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-primary-600 font-medium">Cargando venta...</p>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={formData?.numero_documento || `Editar Venta #${id}`}
        subtitle="Modifica la información de la venta seleccionada"
        icon={<IconEdit size={24} />}
        backButton={
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleCancel}
            className="p-2 h-10 w-10 flex items-center justify-center rounded-xl"
            disabled={submitting}
          >
            <IconArrowLeft size={20} />
          </Button>
        }
      />

      {!isCajaAbierta && (
        <Card className="border-danger-100 bg-danger-50/30 overflow-hidden animate-in fade-in zoom-in-95 duration-500 mb-6">
          <Card.Content className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-danger-100 flex items-center justify-center text-danger-600 mb-6 shadow-sm border border-danger-200">
              <IconLock size={40} />
            </div>
            <h2 className="text-2xl font-black text-danger-900 mb-3 tracking-tight">Caja Cerrada</h2>
            <p className="text-danger-800/80 mb-8 max-w-md font-medium">
              Para editar ventas es necesario tener una sesión de caja abierta. 
              Esto es requerido para el control financiero.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <Link to="/caja" className="flex-1">
                <Button className="w-full shadow-lg shadow-danger-200" variant="danger">
                  Ir a Caja
                </Button>
              </Link>
              <Button variant="secondary" className="flex-1" onClick={handleCancel}>
                Volver
              </Button>
            </div>
          </Card.Content>
        </Card>
      )}

      {isCajaAbierta && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

          <div className="p-5 bg-warning-50/50 border border-warning-100 rounded-2xl flex gap-4">
            <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center text-warning-600 shrink-0 shadow-sm border border-warning-200">
              <IconAlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-warning-900 mb-1 uppercase tracking-wider">⚠️ Importante</h3>
              <ul className="text-xs text-warning-800 space-y-1.5 list-disc list-inside font-medium opacity-90">
                <li>Solo se pueden editar ventas en estado PENDIENTE.</li>
                <li>Los cambios en productos afectan el stock disponible al completar la transacción.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

