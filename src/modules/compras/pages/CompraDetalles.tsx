import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Card, Table} from "@/shared/components/ui";
import { useCompras } from "../hooks/useCompras";
import type { CompraDetail } from "../types";
import {
  formatCurrency,
  formatNumber,
  numberClass,
  formatPercentage,
  formatDateTime,
} from "@/shared/utils/formatters";
import { Badge } from "@/shared/components/ui/Badge";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import { useAlert } from "@/shared/components/alerts";
import { PagoCompraModal } from "../components/PagoCompraModal";
import type { MetodoPago, EstadoCompra } from "../types";

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
  const { isCajaAbierta } = useCajaStore();
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
      } catch (err) {
        console.error(err);
        navigate("/compras");
      } finally {
        setLoading(false);
      }
    };

    loadCompra();
  }, [id, getCompra, navigate]);

  // ─── Auto-abrir modal si viene de creación ─────────────────────────────
  useEffect(() => {
    if (compra && searchParams.get("abrirPago") === "true") {
      if (compra.estado !== "COMPLETADA" && (compra.saldo_pendiente ?? compra.total) > 0) {
        setIsPagoModalOpen(true);
      }
      // Limpiar el parámetro de la URL
      navigate(window.location.pathname, { replace: true });
    }
  }, [compra, searchParams, navigate]);

  const handlePagoSubmit = async (metodo: MetodoPago, montoPagar: number, referencia: string) => {
    if (!compra) return;

    const result = await registrarPago(compra.id, {
      metodo_pago: metodo,
      monto: montoPagar,
      referencia,
    });

    if (result) {
      // Recargar la compra para obtener los detalles actualizados del backend
      const updatedCompra = await getCompra(compra.id);
      setCompra(updatedCompra);
      setIsPagoModalOpen(false);
      showAlert("Pago Registrado", "success", { description: "El pago de la compra se ha procesado correctamente" });
    }
  };

  if (loading || !compra) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando compra...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate("/compras")}>
            ← Volver
          </Button>

          <div>
            <h1 className="text-3xl font-bold font-mono">Compra #{compra.numero_compra}</h1>
            <p className="text-gray-600">Información completa de la compra</p>
          </div>
        </div>
        
        {/* Acciones contextuales */}
        <div className="flex gap-2">
          {(compra.estado === "PENDIENTE" || compra.estado === "PARCIAL") && (
            <Button
              variant="success"
              onClick={() => setIsPagoModalOpen(true)}
            >
              Registrar Pago
            </Button>
          )}
        </div>
      </div>

      {/* ── Info Financiera (Grandes Tarjetas) ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-2 border-purple-100 shadow-lg transform transition hover:scale-[1.02]">
          <Card.Content className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <span className="text-purple-600 text-xs font-bold uppercase tracking-wider">Total de la Compra</span>
              <span className="text-3xl font-black text-purple-700">{formatCurrency(compra.total)}</span>
              <Badge variant="info" className="mt-2 text-[10px] uppercase font-bold tracking-tighter">Monto Total</Badge>
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-white border-2 border-green-100 shadow-lg transform transition hover:scale-[1.02]">
          <Card.Content className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <span className="text-green-600 text-xs font-bold uppercase tracking-wider">Monto Pagado</span>
              <span className="text-3xl font-black text-green-700">{formatCurrency(compra.total - (compra.saldo_pendiente ?? compra.total))}</span>
              <Badge variant="success" className="mt-2">Abonado</Badge>
            </div>
          </Card.Content>
        </Card>

        <Card className={`bg-white border-2 shadow-lg transform transition hover:scale-[1.02] ${(compra.saldo_pendiente ?? compra.total) > 0 ? 'border-orange-100' : 'border-purple-100'}`}>
          <Card.Content className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <span className={`${(compra.saldo_pendiente ?? compra.total) > 0 ? 'text-orange-600' : 'text-purple-600'} text-xs font-bold uppercase tracking-wider`}>Saldo Pendiente</span>
              <span className={`text-3xl font-black ${(compra.saldo_pendiente ?? compra.total) > 0 ? 'text-orange-700' : 'text-purple-700'}`}>
                {formatCurrency(compra.saldo_pendiente ?? compra.total)}
              </span>
              <Badge variant={(compra.saldo_pendiente ?? compra.total) > 0 ? "warning" : "success"} className="mt-2">
                {(compra.saldo_pendiente ?? compra.total) > 0 ? "Por Pagar" : "Completado"}
              </Badge>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Información general */}
      <Card>
        <Card.Content className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Proveedor</h3>
            <p>
              <strong>Nombre:</strong> {compra.proveedor_info.nombre}
            </p>
            <p>
              <strong>Documento:</strong> {compra.proveedor_info.documento}
            </p>
            <p>
              <strong>Teléfono:</strong> {compra.proveedor_info.telefono}
            </p>
            <p>
              <strong>Email:</strong> {compra.proveedor_info.email}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Información Compra</h3>
            <p>
              <strong>Fecha:</strong> {compra.fecha}
            </p>
            <p>
              <strong>Estado Actual:</strong> <Badge variant={estadoVariantMap[compra.estado] || "gray"}>{compra.estado}</Badge>
            </p>
            <p>
              <strong>Total: </strong>
              {""}
              <span className={numberClass}>
                {formatCurrency(compra.total)}
              </span>
            </p>
            <p>
              <strong>Total productos: </strong> {""}
              <span className={numberClass}>
                {formatNumber(compra.total_productos)}
              </span>
            </p>
            <p>
              <strong>Total unidades: </strong>
              {""}
              <span className={numberClass}>
                {formatNumber(compra.total_unidades)}
              </span>
            </p>
            <p>
              <strong>Registrado por:</strong> {compra.usuario_nombre}
            </p>
            <p>
              <strong>Email usuario:</strong> {compra.usuario_email}
            </p>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="space-y-2">
          <h3 className="font-semibold text-lg">Margen Potencial</h3>

          <p>
            <strong>Valor compra: </strong>
            <span className={numberClass}>
              {formatCurrency(compra.margen_potencial.valor_compra)}
            </span>
          </p>

          <p>
            <strong>Valor venta potencial: </strong>
            <span className={numberClass}>
              {formatCurrency(compra.margen_potencial.valor_venta_potencial)}
            </span>
          </p>

          <p className="text-green-600 font-semibold">
            <strong>Ganancia potencial: </strong>
            <span className={numberClass}>
              {formatCurrency(compra.margen_potencial.ganancia_potencial)}
            </span>
          </p>

          <p>
            <strong>Margen %: </strong>{" "}
            <span className={numberClass}>
              {formatPercentage(compra.margen_potencial.margen_porcentaje)}
            </span>
          </p>
        </Card.Content>
      </Card>

      {/* Productos */}
      <Card>
        <Card.Content>
          <h2 className="text-xl font-semibold mb-4">Productos</h2>

          <Table>
            <thead>
              <tr>
                <th className="text-center">Código</th>
                <th>Producto</th>
                <th className="text-center">Cantidad</th>
                <th className="text-center">Precio compra</th>
                <th className="text-center">Subtotal</th>
                <th className="text-center">Ganancia unitaria</th>
                <th className="text-center">Ganancia total</th>
                <th className="text-center">Margen %</th>
              </tr>
            </thead>

            <tbody>
              {compra.detalles.map((d) => (
                <tr key={d.id}>
                  <td className="font-mono text-center">{d.producto}</td>
                  <td className="text-center">{d.producto_nombre}</td>
                  <td className={`text-center ${formatNumber}`}>
                    {d.cantidad}
                  </td>
                  <td className={`text-center ${numberClass}`}>
                    {formatCurrency(d.precio_compra)}
                  </td>

                  <td className={`text-center ${numberClass}`}>
                    {formatCurrency(d.subtotal)}
                  </td>

                  <td className={`text-green-600 text-center ${numberClass}`}>
                    {formatCurrency(d.margen_potencial.ganancia_unitaria)}
                  </td>

                  <td
                    className={`text-green-600 font-semibold text-center ${numberClass}`}
                  >
                    {formatCurrency(d.margen_potencial.ganancia_total)}
                  </td>

                  <td className={`text-center ${numberClass}`}>
                    {formatPercentage(d.margen_potencial.margen_porcentaje)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Content>
      </Card>

      {/* ── Pagos ─────────────────────────────────────────────────────── */}
      <Card>
        <Card.Header>
          <Card.Title>Historial de Pagos</Card.Title>
        </Card.Header>
        <Card.Content>
          {compra.pagos && compra.pagos.length > 0 ? (
            <Table>
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    ID Pago
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Fecha
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Método
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Referencia
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Registrado Por
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody>
                {compra.pagos.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm text-gray-600">
                      #{p.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {formatDateTime(p.fecha)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {p.metodo_pago_display || p.metodo_pago}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {p.referencia || "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {p.usuario_nombre}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold text-green-600 ${numberClass}`}
                    >
                      {formatCurrency(p.monto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-4">No se han registrado pagos para esta compra.</p>
          )}
        </Card.Content>
      </Card>

      {/* ── Modal de Pago ─────────────────────────────────────────────── */}
      <PagoCompraModal
        isOpen={isPagoModalOpen}
        onClose={() => setIsPagoModalOpen(false)}
        onConfirm={handlePagoSubmit}
        total={compra.total}
        saldoPendiente={compra.saldo_pendiente ?? compra.total}
        submitting={loadingPago}
        isCajaAbierta={isCajaAbierta}
      />
    </div>
  );
}
