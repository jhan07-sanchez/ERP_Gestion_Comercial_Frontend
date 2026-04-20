import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Card, Table, Badge, PageContainer, PageHeader } from "@/shared/components/ui";
import { useVentas } from "../hooks/useVenta";
import { formatCurrency, formatNumber, formatDate, formatDateTime } from "@/shared/utils/formatters";
import type { VentaDetail, EstadoVenta, MetodoPago } from "../types/venta.types";
import { PagoModal } from "../components/PagoModal";
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import { IconReceipt, IconCash, IconArrowLeft, IconUser, IconInfoCircle, IconHistory, IconPackage, IconFileText } from "@tabler/icons-react";
import { openVentaDocumentoPdf } from "@/shared/api/documentos";

const estadoVariantMap: Record<EstadoVenta, "success" | "warning" | "danger"> = {
  COMPLETADA: "success",
  PARCIAL: "warning",
  PENDIENTE: "warning",
  CANCELADA: "danger",
};

export default function VentaDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getVenta, registrarPago, cancelarVenta, loadingPago, loadingCancelar } = useVentas();
  const { isCajaAbierta } = useCajaStore();
  const { showAlert, prompt } = useAlert();

  const [venta, setVenta] = useState<VentaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadVenta = async () => {
      try {
        const data = await getVenta(Number(id));
        setVenta(data);
      } catch (err) {
        console.error(err);
        navigate("/ventas");
      } finally {
        setLoading(false);
      }
    };
    loadVenta();
  }, [id, getVenta, navigate]);

  useEffect(() => {
    if (venta && searchParams.get("abrirPago") === "true") {
      setIsPagoModalOpen(true);
      navigate(window.location.pathname, { replace: true });
    }
  }, [venta, searchParams, navigate]);

  const handleAbrirPago = () => setIsPagoModalOpen(true);

  const handlePagoSubmit = async (metodo: MetodoPago, montoPagar: number, montoRecibido: number, vuelto: number) => {
    if (!venta) return;
    const result = await registrarPago(venta.id, {
      metodo_pago: metodo,
      monto: montoPagar,
      monto_recibido: montoRecibido,
      vuelto: vuelto
    });

    if (result) {
      setVenta(result);
      setIsPagoModalOpen(false);
      const docMsg = result.documento
        ? ` Documento ${result.documento.numero_interno} (${result.documento.tipo_display}) generado.`
        : "";
      showAlert("Pago Registrado", "success", {
        description: `El pago se ha procesado correctamente.${docMsg}`,
      });
    }
  };

  const handleCancelar = async () => {
    if (!venta) return;
    const motivo = await prompt("Cancelar Venta", "Por favor, ingresa el motivo de la cancelación:", "");
    if (motivo === null) return;
    if (!motivo.trim()) {
      showAlert("Validación", "warning", { description: "Debes ingresar un motivo para cancelar la venta." });
      return;
    }
    const result = await cancelarVenta(venta.id, motivo);
    if (result) {
      showAlert("Venta Cancelada", "success", { description: "La venta ha sido cancelada exitosamente." });
      setVenta((prev) => (prev ? { ...prev, estado: "CANCELADA" } : prev));
    }
  };

  if (loading || !venta) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-primary-600 font-medium">Cargando detalle de venta...</p>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={venta.numero_documento || `Venta #${venta.id}`}
        subtitle={`Registrada el ${formatDate(venta.fecha)} por ${venta.usuario_nombre}`}
        icon={<IconReceipt size={24} />}
        backButton={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/ventas")}
            className="p-2 h-10 w-10 flex items-center justify-center rounded-xl"
          >
            <IconArrowLeft size={20} />
          </Button>
        }
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {(venta.estado === "PENDIENTE" || venta.estado === "PARCIAL") && (
              <Button
                variant="success"
                onClick={handleAbrirPago}
                className="shadow-lg shadow-emerald-100 flex-1 sm:flex-none"
                disabled={!isCajaAbierta}
              >
                <IconCash size={18} />
                <span className="ml-2">Registrar Pago</span>
              </Button>
            )}
            {venta.estado !== "CANCELADA" && (
              <Button
                variant="danger"
                onClick={handleCancelar}
                isLoading={loadingCancelar}
                className="flex-1 sm:flex-none"
              >
                Anular Venta
              </Button>
            )}
          </div>
        }
      />

      {venta.estado === "COMPLETADA" && venta.documento && (
        <Card className="border-emerald-200 bg-emerald-50/40 shadow-sm">
          <Card.Content className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                <IconFileText size={22} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Documento generado
                </p>
                <p className="text-sm font-semibold text-emerald-950">
                  {venta.documento.tipo_display} — {venta.documento.numero_interno}
                </p>
                <p className="text-xs text-emerald-700/80 mt-0.5">
                  Ref. operación: {venta.documento.referencia_operacion || "—"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 border-emerald-300 bg-white hover:bg-emerald-50"
              onClick={() =>
                openVentaDocumentoPdf(venta.id, venta.tipo_documento).catch(() =>
                  showAlert("Error", "error", { description: "No se pudo abrir el PDF del documento." }),
                )
              }
            >
              <IconFileText size={18} className="mr-2" />
              Ver factura / ticket
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard label="Total Venta" value={formatCurrency(venta.total)} color="blue" />
        <KPICard label="Monto Pagado" value={formatCurrency(venta.total_pagado)} color="emerald" />
        <KPICard
          label="Saldo Pendiente"
          value={formatCurrency(venta.saldo_pendiente)}
          color={venta.saldo_pendiente > 0 ? "rose" : "indigo"}
          isHighlighted={venta.saldo_pendiente > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm border-primary-100">
            <Card.Header className="pb-2 border-b border-primary-50">
              <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-wider text-xs">
                <IconUser size={16} />
                <span>Cliente</span>
              </div>
            </Card.Header>
            <Card.Content className="pt-4 space-y-3">
              <DetailItem label="Nombre" value={venta.cliente_info.nombre} />
              <DetailItem label="Documento" value={venta.cliente_info.numero_documento} />
              {venta.cliente_info.telefono && <DetailItem label="Teléfono" value={venta.cliente_info.telefono} />}
              {venta.cliente_info.email && <DetailItem label="Email" value={venta.cliente_info.email} />}
            </Card.Content>
          </Card>

          <Card className="shadow-sm border-primary-100">
            <Card.Header className="pb-2 border-b border-primary-50">
              <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-wider text-xs">
                <IconInfoCircle size={16} />
                <span>Estado de Venta</span>
              </div>
            </Card.Header>
            <Card.Content className="pt-4 space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-primary-400 font-bold uppercase">Estado</span>
                <Badge variant={estadoVariantMap[venta.estado]}>{venta.estado}</Badge>
              </div>
              <DetailItem label="Productos" value={`${formatNumber(venta.total_productos)} ítems`} />
              <DetailItem label="Unidades" value={`${formatNumber(venta.total_unidades)} total`} />
              <DetailItem label="Vendedor" value={venta.usuario_nombre} />
            </Card.Content>
          </Card>
        </div>

        {/* Tables */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-primary-100 overflow-hidden">
            <Card.Header className="bg-primary-50/30 border-b border-primary-100 py-3">
              <div className="flex items-center gap-2 text-primary-700 font-bold uppercase tracking-wider text-xs">
                <IconPackage size={18} />
                <span>Artículos</span>
              </div>
            </Card.Header>
            <Card.Content className="p-0">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Producto</Table.Head>
                    <Table.Head className="text-center">Cant.</Table.Head>
                    <Table.Head className="text-right hidden sm:table-cell">Precio</Table.Head>
                    <Table.Head className="text-right">Subtotal</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {venta.detalles.map((d) => (
                    <Table.Row key={d.id}>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="font-bold text-primary-900 leading-tight">{d.producto_nombre}</span>
                          <span className="text-[10px] text-primary-400 font-mono hidden sm:inline">{d.producto_codigo}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-center font-bold text-primary-700">{formatNumber(d.cantidad)}</Table.Cell>
                      <Table.Cell className="text-right text-primary-600 hidden sm:table-cell">{formatCurrency(d.precio_unitario)}</Table.Cell>
                      <Table.Cell className="text-right font-black text-primary-900">{formatCurrency(d.subtotal)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Card.Content>
          </Card>

          <Card className="shadow-sm border-primary-100 overflow-hidden">
            <Card.Header className="bg-primary-50/30 border-b border-primary-100 py-3">
              <div className="flex items-center gap-2 text-primary-700 font-bold uppercase tracking-wider text-xs">
                <IconHistory size={18} />
                <span>Historial de Pagos</span>
              </div>
            </Card.Header>
            <Card.Content className="p-0">
              {venta.pagos && venta.pagos.length > 0 ? (
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.Head className="hidden sm:table-cell">Fecha</Table.Head>
                      <Table.Head>Método</Table.Head>
                      <Table.Head className="text-right">Monto</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {venta.pagos.map((p) => (
                      <Table.Row key={p.id}>
                        <Table.Cell className="hidden sm:table-cell text-xs text-primary-500">
                          <div className="flex flex-col">
                            <span>{formatDate(p.fecha)}</span>
                            <span className="opacity-60">{formatDateTime(p.fecha).split(' ')[1]}</span>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <span className="font-bold text-emerald-700 text-xs">{p.metodo_pago_display}</span>
                            <span className="text-[10px] text-primary-400">Por {p.usuario_nombre}</span>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="text-right font-black text-emerald-600">{formatCurrency(p.monto)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                <div className="p-8 text-center bg-gray-50 flex flex-col items-center">
                  <IconCash size={32} className="text-primary-200 mb-2" />
                  <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">Sin pagos registrados</p>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>

      <PagoModal
        isOpen={isPagoModalOpen}
        onClose={() => setIsPagoModalOpen(false)}
        onConfirm={handlePagoSubmit}
        total={venta.total}
        saldoPendiente={venta.saldo_pendiente}
        submitting={loadingPago}
        isCajaAbierta={isCajaAbierta}
      />
    </PageContainer>
  );
}

function KPICard({ label, value, color, isHighlighted }: { label: string; value: string; color: string; isHighlighted?: boolean }) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    rose: "bg-rose-50 border-rose-100 text-rose-700",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
  };

  return (
    <Card className={`${colorClasses[color]} border shadow-sm`}>
      <Card.Content className="p-5 flex flex-col justify-center gap-1">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 leading-none">{label}</p>
        <p className={`text-2xl font-black tabular-nums transition-all ${isHighlighted ? 'scale-105 origin-left text-rose-800' : ''}`}>
          {value}
        </p>
      </Card.Content>
    </Card>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-primary-50 last:border-0 last:pb-0">
      <span className="text-[10px] text-primary-400 font-bold uppercase tracking-wider">{label}</span>
      <span className="text-sm text-primary-900 font-semibold truncate ml-4">{value}</span>
    </div>
  );
}

