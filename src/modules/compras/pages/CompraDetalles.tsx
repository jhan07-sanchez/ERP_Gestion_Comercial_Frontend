import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Card, Table, Badge, PageContainer, PageHeader } from "@/shared/components/ui";
import { useCompras } from "../hooks/useCompras";
import type { CompraDetail, MetodoPago, EstadoCompra } from "../types";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDateTime,
  formatDate,
} from "@/shared/utils/formatters";
import { useAlert } from "@/shared/components/alerts";
import { PagoCompraModal } from "../components/PagoCompraModal";
import {
  IconShoppingCart,
  IconArrowLeft,
  IconCash,
  IconCheck,
  IconPackage,
  IconUser,
  IconInfoCircle,
  IconTrendingUp,
  IconHistory,
  IconAlertCircle,
  IconFileText,
} from "@tabler/icons-react";
import { openCompraDocumentoPdf } from "@/shared/api/documentos";

const estadoVariantMap: Record<EstadoCompra, "success" | "warning" | "danger" | "gray"> = {
  COMPLETADA: "success",
  PARCIAL: "warning",
  PENDIENTE: "gray",
  ANULADA: "danger",
};

export default function CompraDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getCompra, registrarPago, loadingPago } = useCompras();
  const { showAlert } = useAlert();

  const [compra, setCompra] = useState<CompraDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadCompra = async () => {
      try {
        const data = await getCompra(Number(id));
        setCompra(data);
      } catch {
        navigate("/compras");
      } finally {
        setLoading(false);
      }
    };
    loadCompra();
  }, [id, getCompra, navigate]);

  useEffect(() => {
    if (compra && searchParams.get("abrirPago") === "true") {
      if (compra.estado !== "COMPLETADA" && (compra.saldo_pendiente ?? compra.total) > 0) {
        setIsPagoModalOpen(true);
      }
      navigate(window.location.pathname, { replace: true });
    }
  }, [compra, searchParams, navigate]);

  const handlePagoSubmit = async (
    metodoPagoNombre: string,  // 🆕 recibe el NOMBRE (string)
    montoPagar: number,
    referencia: string
  ) => {
    if (!compra) return;
    const result = await registrarPago(compra.id, {
      metodo_pago: metodoPagoNombre as MetodoPago,  // el backend espera el nombre
      monto: montoPagar,
      referencia,
    });

    if (result) {
      const updatedCompra = await getCompra(compra.id);
      setCompra(updatedCompra);
      setIsPagoModalOpen(false);
      showAlert("Pago Registrado", "success", {
        description: "El pago ha sido procesado correctamente.",
      });
    }
  };

  if (loading || !compra) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-primary-600 font-medium">Cargando detalles de compra...</p>
        </div>
      </PageContainer>
    );
  }

  const montoPagado = compra.total - (compra.saldo_pendiente ?? compra.total);
  const saldoPendiente = compra.saldo_pendiente ?? (compra.estado === "COMPLETADA" ? 0 : compra.total);

  return (
    <PageContainer>
      <PageHeader
        title={`Compra #${compra.numero_compra}`}
        subtitle="Información completa de la compra al proveedor"
        icon={<IconShoppingCart size={24} />}
        backButton={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/compras")}
            className="p-2 h-10 w-10 flex items-center justify-center rounded-xl"
          >
            <IconArrowLeft size={20} />
          </Button>
        }
        actions={
          (compra.estado === "PENDIENTE" || compra.estado === "PARCIAL") && (
            <Button
              variant="success"
              onClick={() => setIsPagoModalOpen(true)}
              className="w-full sm:w-auto shadow-lg shadow-green-100"
            >
              <IconCash size={18} className="mr-2" />
              Registrar Pago
            </Button>
          )
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPIItem
          label="Total Compra"
          value={formatCurrency(compra.total)}
          variant="primary"
          icon={<IconShoppingCart size={20} />}
          badge="Monto Final"
        />
        <KPIItem
          label="Monto Pagado"
          value={formatCurrency(montoPagado)}
          variant="success"
          icon={<IconCheck size={20} />}
          badge="Abonado"
        />
        <KPIItem
          label="Saldo Pendiente"
          value={formatCurrency(saldoPendiente)}
          variant={saldoPendiente > 0 ? "warning" : "success"}
          icon={<IconAlertCircle size={20} />}
          badge={saldoPendiente > 0 ? "Por Pagar" : "Completado"}
        />
      </div>

      {compra.documento && (
        <Card className="border-emerald-200 bg-emerald-50/40 shadow-sm">
          <Card.Content className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                <IconFileText size={22} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Documento de compra
                </p>
                <p className="text-sm font-semibold text-emerald-950">
                  {compra.documento.tipo_display} — {compra.documento.numero_interno}
                </p>
                <p className="text-xs text-emerald-700/80 mt-0.5">
                  Ref. operación: {compra.documento.referencia_operacion || "—"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 border-emerald-300 bg-white hover:bg-emerald-50"
              onClick={() =>
                openCompraDocumentoPdf(compra.id).catch(() =>
                  showAlert("Error", "error", { description: "No se pudo abrir el PDF del documento." }),
                )
              }
            >
              <IconFileText size={18} className="mr-2" />
              Ver documento PDF
            </Button>
          </Card.Content>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detalles Principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-primary-100 divide-y divide-primary-50">
            <Card.Header className="bg-primary-50/30 py-3">
              <Card.Title className="text-sm font-bold flex items-center gap-2 text-primary-900">
                <IconPackage size={18} className="text-primary-500" />
                PRODUCTOS ADQUIRIDOS
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-0 overflow-x-auto">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Producto</Table.Head>
                    <Table.Head className="text-center">Cant.</Table.Head>
                    <Table.Head className="text-right">Precio</Table.Head>
                    <Table.Head className="text-right hidden md:table-cell">Subtotal</Table.Head>
                    <Table.Head className="text-right hidden sm:table-cell">Margen %</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {compra.detalles.map((d) => (
                    <Table.Row key={d.id} className="hover:bg-primary-50/20">
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="font-bold text-primary-900">{d.producto_nombre}</span>
                          <span className="text-[10px] font-mono text-primary-400">Cod: {d.producto}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-center font-bold text-primary-700">{d.cantidad}</Table.Cell>
                      <Table.Cell className="text-right font-medium">{formatCurrency(d.precio_compra)}</Table.Cell>
                      <Table.Cell className="text-right font-bold hidden md:table-cell text-primary-900">
                        {formatCurrency(d.subtotal)}
                      </Table.Cell>
                      <Table.Cell className="text-right hidden sm:table-cell">
                        <Badge variant="info" className="text-[10px]">
                          {formatPercentage(d.margen_potencial.margen_porcentaje)}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Card.Content>
          </Card>

          {/* Historial de Pagos */}
          <Card className="shadow-sm border-primary-100 divide-y divide-primary-50">
            <Card.Header className="bg-primary-50/30 py-3">
              <Card.Title className="text-sm font-bold flex items-center gap-2 text-primary-900">
                <IconHistory size={18} className="text-primary-500" />
                HISTORIAL DE PAGOS
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-0">
              {compra.pagos && compra.pagos.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.Head>Fecha</Table.Head>
                        <Table.Head className="hidden sm:table-cell">Método</Table.Head>
                        <Table.Head className="text-right">Monto</Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {compra.pagos.map((p) => (
                        <Table.Row key={p.id}>
                          <Table.Cell>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-primary-900">{formatDateTime(p.fecha)}</span>
                              <span className="text-[10px] text-primary-400 sm:hidden">{p.metodo_pago_display || p.metodo_pago}</span>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="hidden sm:table-cell text-xs text-primary-600 font-medium">
                            {p.metodo_pago_display || p.metodo_pago}
                          </Table.Cell>
                          <Table.Cell className="text-right font-black text-green-600">
                            {formatCurrency(p.monto)}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              ) : (
                <div className="p-8 text-center text-primary-400 text-sm font-medium">
                  No se han registrado pagos para esta compra.
                </div>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <Card className="shadow-sm border-primary-100 overflow-hidden">
            <Card.Header className="bg-primary-900 py-3">
              <Card.Title className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                <IconUser size={16} />
                Proveedor
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-4 space-y-4">
              <DetailItem label="Nombre" value={compra.proveedor_info.nombre ?? "—"} />
              <DetailItem label="Documento" value={compra.proveedor_info.documento ?? "—"} />
              <DetailItem label="Teléfono" value={compra.proveedor_info.telefono ?? "—"} />
              <DetailItem label="Email" value={compra.proveedor_info.email ?? "—"} border={false} />
            </Card.Content>
          </Card>

          <Card className="shadow-sm border-primary-100 overflow-hidden">
            <Card.Header className="bg-primary-50 py-3 border-b border-primary-100">
              <Card.Title className="text-xs font-bold text-primary-900 flex items-center gap-2 uppercase tracking-widest">
                <IconInfoCircle size={16} />
                Detalles Compra
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-4 space-y-4">
              <DetailItem label="Fecha Registro" value={formatDate(compra.fecha)} />
              <div className="py-2 flex justify-between items-center border-b border-primary-50">
                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-tighter">Estado</span>
                <Badge variant={estadoVariantMap[compra.estado] || "gray"} className="text-[10px] uppercase font-bold tracking-tighter">
                  {compra.estado}
                </Badge>
              </div>
              <DetailItem label="Unidades Totales" value={formatNumber(compra.total_unidades)} />
              <DetailItem label="Registrado por" value={compra.usuario_nombre ?? "—"} border={false} />
            </Card.Content>
          </Card>

          <Card className="shadow-sm border-primary-100 overflow-hidden bg-primary-50/30">
            <Card.Header className="bg-white py-3 border-b border-primary-100">
              <Card.Title className="text-xs font-bold text-primary-900 flex items-center gap-2 uppercase tracking-widest">
                <IconTrendingUp size={16} className="text-green-500" />
                Margen Estimado
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-4 space-y-4">
              <DetailItem label="Costo Total" value={formatCurrency(compra.margen_potencial.valor_compra)} />
              <DetailItem label="Venta Potencial" value={formatCurrency(compra.margen_potencial.valor_venta_potencial)} />
              <div className="py-2 flex justify-between items-center bg-green-50 px-2 rounded-lg">
                <span className="text-[10px] font-bold text-green-600 uppercase">Ganancia Est.</span>
                <span className="font-black text-green-700">{formatCurrency(compra.margen_potencial.ganancia_potencial)}</span>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      <PagoCompraModal
        isOpen={isPagoModalOpen}
        onClose={() => setIsPagoModalOpen(false)}
        onConfirm={handlePagoSubmit}
        total={compra.total}
        saldoPendiente={compra.saldo_pendiente ?? (compra.estado === "COMPLETADA" ? 0 : compra.total)}
        submitting={loadingPago}
      // 🗑️ isCajaAbierta eliminado — el modal lo lee del store directamente
      />
    </PageContainer>
  );
}

function KPIItem({ label, value, variant = "primary", icon, badge }: {
  label: string;
  value: string;
  variant?: "primary" | "success" | "warning" | "danger";
  icon: React.ReactNode;
  badge?: string;
}) {
  const colors = {
    primary: "border-primary-100 text-primary-600 bg-primary-50/20",
    success: "border-green-100 text-green-600 bg-green-50/20",
    warning: "border-amber-100 text-amber-600 bg-amber-50/20",
    danger: "border-rose-100 text-rose-600 bg-rose-50/20",
  }[variant];

  const textColors = {
    primary: "text-primary-700",
    success: "text-green-700",
    warning: "text-amber-700",
    danger: "text-rose-700",
  }[variant];

  return (
    <Card className={`overflow-hidden border-2 cursor-default transition-all duration-300 hover:shadow-md ${colors}`}>
      <Card.Content className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 rounded-lg bg-white shadow-sm border border-inherit">
            {icon}
          </div>
          {badge && (
            <span className={`text-[10px] font-black uppercase tracking-widest opacity-70`}>{badge}</span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 truncate">{label}</p>
          <p className={`text-2xl font-black tracking-tight ${textColors}`}>{value}</p>
        </div>
      </Card.Content>
    </Card>
  );
}

function DetailItem({ label, value, border = true }: { label: string; value: string | number; border?: boolean }) {
  return (
    <div className={`py-2 flex justify-between items-start gap-4 ${border ? 'border-b border-primary-50' : ''}`}>
      <span className="text-[10px] font-bold text-primary-400 uppercase tracking-tighter shrink-0 pt-0.5">{label}</span>
      <span className="text-xs font-bold text-primary-900 text-right leading-tight">{value || "—"}</span>
    </div>
  );
}

