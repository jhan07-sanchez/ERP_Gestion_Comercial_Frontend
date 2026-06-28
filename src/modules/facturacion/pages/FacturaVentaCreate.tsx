import { useNavigate } from "react-router-dom";
import { PageContainer, PageHeader, Button } from "@/shared/components/ui";
import { FacturaForm } from "../components/factura-venta/FacturaForm";
import { useFacturaActions } from "../hooks/useFacturaActions";
import { IconArrowLeft, IconReceipt } from "@tabler/icons-react";
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import type { FacturaFormState } from "../types";

export default function FacturaVentaCreate() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { createFactura, loadingCreate } = useFacturaActions();
  const { isCajaAbierta } = useCajaStore();

  const handleSubmit = async (data: FacturaFormState) => {
    if (!isCajaAbierta) {
      showAlert("Caja Cerrada", "warning", { description: "Debe abrir una sesión de caja antes de facturar." });
      return;
    }

    const payload = {
      cliente_id: data.cliente_id,
      vendedor_id: data.vendedor_id,
      observaciones: data.observaciones,
      fecha_vencimiento: data.fecha_vencimiento,
      subtotal: data.subtotal,
      descuento_total: data.descuento_total,
      impuestos_total: data.impuestos_total,
      total: data.total,
      detalles: data.detalles.map((d) => ({
        producto_id: d.producto_id,
        cantidad: Number(d.cantidad),
        precio_unitario: Number(d.precio_unitario),
        descuento: Number(d.descuento) || 0,
      })),
    };

    console.log("PAYLOAD ENVIADO:", payload);
    const factura = await createFactura(payload);
    if (factura) {
      showAlert("Éxito", "success", { description: "Borrador de factura guardado correctamente." });
      navigate(`/facturacion/facturas_venta/${factura.id}/detalle`);
    }
  };

  const handleCancel = () => {
    navigate("/facturacion/facturas_venta/lista");
  };

  return (
    <PageContainer>
      <PageHeader
        title="Nueva Factura"
        subtitle="Emitir una nueva factura de venta"
        icon={<IconReceipt size={24} />}
        backButton={
          <Button variant="ghost" onClick={handleCancel} className="mb-4">
            <IconArrowLeft size={18} className="mr-2" />
            Volver
          </Button>
        }
      />
      <div className="pb-20">
        <FacturaForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitting={loadingCreate}
          mode="create"
        />
      </div>
    </PageContainer>
  );
}
