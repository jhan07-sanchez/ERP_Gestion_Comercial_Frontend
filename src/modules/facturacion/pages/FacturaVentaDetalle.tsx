import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer, PageHeader, Button, Card, Table } from "@/shared/components/ui";
import { useFacturaDetail } from "../hooks/useFacturaDetail";
import { useFacturaActions } from "../hooks/useFacturaActions";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { FacturaStatusBadge } from "../components/FacturaStatusBadge";
import { PagoModal } from "../components/PagoModal";
import { IconArrowLeft, IconReceipt, IconCash, IconPrinter, IconEdit, IconX } from "@tabler/icons-react";
import type { FacturaDetail } from "../types";
import { useAlert } from "@/shared/components/alerts";
import { Loader } from "@/shared/components/Loader";
import { useCajaStore } from "@/modules/caja/store/caja.store";

export default function FacturaVentaDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert, prompt } = useAlert();
  const { getFactura, loading, error } = useFacturaDetail();
  const { emitirFactura, anularFactura, registrarPago, loadingEmitir, loadingAnular, loadingPago } = useFacturaActions();
  const { isCajaAbierta } = useCajaStore();

  const [factura, setFactura] = useState<FacturaDetail | null>(null);
  const [showPagoModal, setShowPagoModal] = useState(false);

  const loadFactura = async () => {
    if (id) {
      const data = await getFactura(Number(id));
      setFactura(data);
    }
  };

  useEffect(() => {
    loadFactura();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEmitir = async () => {
    if (!id) return;
    const success = await emitirFactura(Number(id));
    if (success) {
      showAlert("Éxito", "success", { description: "Factura emitida correctamente." });
      loadFactura();
    }
  };

  const handleAnular = async () => {
    if (!id) return;
    const motivo = await prompt("Anular Factura", "Ingrese el motivo:", "");
    if (motivo === null) return;
    if (!motivo.trim()) {
      showAlert("Validación", "warning", { description: "El motivo es requerido." });
      return;
    }
    const success = await anularFactura(Number(id), { motivo });
    if (success) {
      showAlert("Éxito", "success", { description: "Factura anulada." });
      loadFactura();
    }
  };

  const handlePago = async (metodoId: number, monto: number) => {
    if (!id) return;
    const success = await registrarPago(Number(id), { metodo_pago_id: metodoId, monto });
    if (success) {
      showAlert("Pago Registrado", "success", { description: "El pago se guardó correctamente." });
      setShowPagoModal(false);
      loadFactura();
    }
  };

  if (loading || !factura) {
    return <div className="flex justify-center items-center h-96"><Loader /></div>;
  }

  if (error) {
    return <div className="text-center py-20 text-danger-500">{error}</div>;
  }

  const isBorrador = factura.estado === "BORRADOR";
  const canPay = factura.estado === "EMITIDA" || factura.estado === "PARCIAL" || factura.estado === "VENCIDA";

  return (
    <PageContainer>
      <PageHeader
        title={`Factura ${factura.numero || "#" + factura.id}`}
        subtitle={`Cliente: ${factura.cliente_nombre}`}
        icon={<IconReceipt size={24} />}
        backButton={
          <Button
            variant="ghost"
            onClick={() => navigate("/facturacion/facturas_venta/lista")}
            className="mb-4"
          >
            <IconArrowLeft size={18} className="mr-2" />
            Volver
          </Button>
        }
        actions={
          <div className="flex gap-2">
            {isBorrador && (
              <>
                <Button
                  onClick={() =>
                    navigate(`/facturacion/facturas_venta/${factura.id}/editar`)
                  }
                  variant="secondary"
                >
                  <IconEdit size={18} className="mr-2" />
                  Editar
                </Button>
                <Button onClick={handleEmitir} isLoading={loadingEmitir}>
                  <IconReceipt size={18} className="mr-2" />
                  Emitir
                </Button>
              </>
            )}
            {canPay && factura.saldo_pendiente > 0 && (
              <Button
                onClick={() => setShowPagoModal(true)}
                className="bg-success-600 hover:bg-success-700"
              >
                <IconCash size={18} className="mr-2" />
                Registrar Pago
              </Button>
            )}
            {factura.estado !== "ANULADA" && (
              <Button
                onClick={handleAnular}
                variant="danger"
                isLoading={loadingAnular}
              >
                <IconX size={18} className="mr-2" />
                Anular
              </Button>
            )}
            <Button variant="secondary">
              <IconPrinter size={18} className="mr-2" />
              Imprimir
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Detalles de Productos</Card.Title>
            </Card.Header>
            <Card.Content className="p-0">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Código</Table.Head>
                    <Table.Head>Producto</Table.Head>
                    <Table.Head className="text-center">Cant.</Table.Head>
                    <Table.Head className="text-right">Precio</Table.Head>
                    <Table.Head className="text-right">Subtotal</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {factura.detalles.map((d) => (
                    <Table.Row key={d.id}>
                      <Table.Cell className="font-mono text-xs text-primary-500">
                        {d.producto_codigo}
                      </Table.Cell>
                      <Table.Cell className="font-bold text-primary-900">
                        {d.producto_nombre}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        {d.cantidad}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {formatCurrency(d.precio_unitario)}
                      </Table.Cell>
                      <Table.Cell className="text-right font-bold text-primary-900">
                        {formatCurrency(d.subtotal)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <Card.Content className="p-6">
              <div className="mb-4">
                <span className="text-xs font-bold uppercase text-primary-400 block mb-1">
                  Estado
                </span>
                <FacturaStatusBadge estado={factura.estado} />
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-primary-500">Subtotal</span>
                  <span className="font-bold">
                    {formatCurrency(factura.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-primary-500">Impuestos</span>
                  <span className="font-bold text-accent-600">
                    {formatCurrency(factura.impuestos_total)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-bold text-primary-900">Total</span>
                  <span className="text-2xl font-black">
                    {formatCurrency(factura.total)}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-primary-500">
                    Saldo Pendiente
                  </span>
                  <span className="font-bold text-orange-600">
                    {formatCurrency(factura.saldo_pendiente)}
                  </span>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Información</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase text-primary-400 block">
                  Cliente
                </span>
                <p className="font-medium text-primary-900">
                  {factura.cliente_nombre}
                </p>
                <p className="text-sm text-primary-500">
                  Doc: {factura.cliente_documento}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-primary-400 block">
                  Fechas
                </span>
                <p className="text-sm">
                  Emisión:{" "}
                  {factura.fecha_emision
                    ? formatDate(factura.fecha_emision)
                    : "-"}
                </p>
                <p className="text-sm">
                  Vencimiento:{" "}
                  {factura.fecha_vencimiento
                    ? formatDate(factura.fecha_vencimiento)
                    : "-"}
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      <PagoModal
        isOpen={showPagoModal}
        onClose={() => setShowPagoModal(false)}
        onConfirm={handlePago}
        total={factura.total}
        saldoPendiente={factura.saldo_pendiente}
        submitting={loadingPago}
        isCajaAbierta={isCajaAbierta}
      />
    </PageContainer>
  );
}
