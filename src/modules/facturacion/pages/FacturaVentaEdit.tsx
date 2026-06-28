import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageContainer, PageHeader, Button } from "@/shared/components/ui";
import { FacturaForm } from "../components/factura-venta/FacturaForm";
import { useFacturaActions } from "../hooks/useFacturaActions";
import { useFacturaDetail } from "../hooks/useFacturaDetail";
import { IconArrowLeft, IconReceipt } from "@tabler/icons-react";
import type { FacturaFormState } from "../types";
import { useAlert } from "@/shared/components/alerts";
import { Loader } from "@/shared/components/Loader";

export default function FacturaVentaEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { updateFactura, loadingUpdate } = useFacturaActions();
  const { getFactura, loading, error } = useFacturaDetail();

  const [initialData, setInitialData] = useState<FacturaFormState | null>(null);

  useEffect(() => {
    if (!id) return;
    getFactura(Number(id)).then((data) => {
      if (data.estado !== "BORRADOR") {
        showAlert("No Editable", "warning", { description: "Solo se pueden editar facturas en estado BORRADOR." });
        navigate(`/facturacion/facturas_venta/${id}/detalle`);
        return;
      }

      setInitialData({
        id: data.id,
        cliente_id: data.cliente || 0,
        observaciones: data.observaciones || "",
        fecha_vencimiento: data.fecha_vencimiento || undefined,
        estado: data.estado,
        subtotal: data.subtotal,
        descuento_total: data.descuento_total || 0,
        impuestos_total: data.impuestos_total,
        total: data.total,
        detalles: data.detalles.map((d) => ({
          producto_id: d.producto || 0,
          producto_nombre: d.producto_nombre,
          producto_codigo: d.producto_codigo,
          cantidad: Number(d.cantidad),
          precio_unitario: Number(d.precio_unitario),
          descuento: Number(d.descuento || 0),
          subtotal: Number(d.subtotal),
          stock_disponible: d.stock_disponible || 0,
        })),
      });
    }).catch(() => {
      showAlert("Error", "error", { description: "No se pudo cargar la factura." });
      navigate("/facturacion/facturas_venta/lista");
    });
  }, [id, getFactura, navigate, showAlert]);

  const handleSubmit = async (data: FacturaFormState) => {
    if (!id) return;

    const payload = {
      cliente_id: data.cliente_id,
      vendedor_id: data.vendedor_id,
      observaciones: data.observaciones,
      fecha_vencimiento: data.fecha_vencimiento,
      subtotal: data.subtotal,
      descuento_total: data.descuento_total,
      impuestos_total: data.impuestos_total,
      total: data.total,
      detalles: data.detalles.map(d => ({
        producto_id: d.producto_id,
        cantidad: Number(d.cantidad),
        precio_unitario: Number(d.precio_unitario),
        descuento: Number(d.descuento) || 0,
      }))
    };

    const factura = await updateFactura(Number(id), payload);
    if (factura) {
      showAlert("Éxito", "success", { description: "Factura actualizada correctamente." });
      navigate(`/facturacion/facturas_venta/${factura.id}/detalle`);
    }
  };

  const handleCancel = () => {
    navigate("/facturacion/facturas_venta/lista");
  };

  if (loading || !initialData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-danger-500 text-center py-20">{error}</div>;
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Editar Factura #${initialData.id}`}
        subtitle="Modificar borrador de factura"
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
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitting={loadingUpdate}
          mode="edit"
        />
      </div>
    </PageContainer>
  );
}
