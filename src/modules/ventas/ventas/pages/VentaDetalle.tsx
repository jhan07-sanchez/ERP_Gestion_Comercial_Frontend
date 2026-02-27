/**
 * 📄 PÁGINA: VentaDetalle
 * Detalle completo de una venta. Mismo patrón que CompraDetalles.tsx
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Card, Table, Badge } from "@/components/ui";
import { useVentas } from "../hooks/useVenta";
import { formatCurrency, formatNumber, numberClass, formatDate, formatDateTime } from "@/utils/formatters";
import type { VentaDetail, EstadoVenta, MetodoPago } from "../types/venta.types";
import { PagoModal } from "../components/PagoModal";

const estadoVariantMap: Record<EstadoVenta, "success" | "warning" | "danger"> =
{
  COMPLETADA: "success",
  PARCIAL: "warning",
  PENDIENTE: "warning",
  CANCELADA: "danger",
};

export default function VentaDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    getVenta,
    registrarPago,
    cancelarVenta,
    loadingPago,
    loadingCancelar,
  } = useVentas();

  const [venta, setVenta] = useState<VentaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);

  // ─── Cargar venta ──────────────────────────────────────────────────────
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

  // ─── Auto-abrir modal si viene de creación ─────────────────────────────
  useEffect(() => {
    if (venta && searchParams.get("abrirPago") === "true") {
      setIsPagoModalOpen(true);
      // Limpiar el parámetro de la URL
      navigate(window.location.pathname, { replace: true });
    }
  }, [venta, searchParams, navigate]);

  // ─── Pagar ─────────────────────────────────────────────────────────
  const handleAbrirPago = () => {
    setIsPagoModalOpen(true);
  };

  const handlePagoSubmit = async (metodo: MetodoPago, montoPagar: number, montoRecibido: number, vuelto: number) => {
    if (!venta) return;

    // El registrarPago retornará la venta actualizada con el nuevo historial y estado
    const result = await registrarPago(venta.id, {
      metodo_pago: metodo,
      monto: montoPagar,
      monto_recibido: montoRecibido,
      vuelto: vuelto
    });

    if (result) {
      setVenta(result);
      setIsPagoModalOpen(false);
    }
  };

  // ─── Cancelar ──────────────────────────────────────────────────────────
  const handleCancelar = async () => {
    if (!venta) return;
    const motivo = window.prompt("Motivo de la cancelación:");
    if (!motivo) {
      alert("Debes ingresar un motivo.");
      return;
    }

    const result = await cancelarVenta(venta.id, motivo);
    if (result)
      setVenta((prev) => (prev ? { ...prev, estado: "CANCELADA" } : prev));
  };

  // ─── Loading ───────────────────────────────────────────────────────────
  if (loading || !venta) {
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
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate("/ventas")}>
            ← Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Venta #{venta.id}
            </h1>
            <p className="text-gray-600 mt-1">
              Información completa de la venta
            </p>
          </div>
        </div>

        {/* Acciones contextuales */}
        <div className="flex gap-2">
          {(venta.estado === "PENDIENTE" || venta.estado === "PARCIAL") && (
            <>
              {venta.estado === "PENDIENTE" && (
                <Button onClick={() => navigate(`/ventas/${venta.id}/editar`)}>
                  Editar
                </Button>
              )}
              <Button
                variant="success"
                onClick={handleAbrirPago}
              >
                Registrar Pago
              </Button>
            </>
          )}

          {venta.estado !== "CANCELADA" && (
            <Button
              variant="danger"
              onClick={handleCancelar}
              isLoading={loadingCancelar}
            >
              Cancelar Venta
            </Button>
          )}
        </div>
      </div>

      {/* ── Info Financiera (Grandes Tarjetas) ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-2 border-blue-100 shadow-lg transform transition hover:scale-[1.02]">
          <Card.Content className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Total de la Venta</span>
              <span className="text-3xl font-black text-blue-700">{formatCurrency(venta.total)}</span>
              <Badge variant="info" className="mt-2 text-[10px] uppercase font-bold tracking-tighter">Monto Total</Badge>
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-white border-2 border-green-100 shadow-lg transform transition hover:scale-[1.02]">
          <Card.Content className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <span className="text-green-600 text-xs font-bold uppercase tracking-wider">Monto Cobrado</span>
              <span className="text-3xl font-black text-green-700">{formatCurrency(venta.total_pagado)}</span>
              <Badge variant="success" className="mt-2">Pagado</Badge>
            </div>
          </Card.Content>
        </Card>

        <Card className={`bg-white border-2 shadow-lg transform transition hover:scale-[1.02] ${venta.saldo_pendiente > 0 ? 'border-orange-100' : 'border-blue-100'}`}>
          <Card.Content className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <span className={`${venta.saldo_pendiente > 0 ? 'text-orange-600' : 'text-blue-600'} text-xs font-bold uppercase tracking-wider`}>Saldo Pendiente</span>
              <span className={`text-3xl font-black ${venta.saldo_pendiente > 0 ? 'text-orange-700' : 'text-blue-700'}`}>
                {formatCurrency(venta.saldo_pendiente)}
              </span>
              <Badge variant={venta.saldo_pendiente > 0 ? "warning" : "success"} className="mt-2">
                {venta.saldo_pendiente > 0 ? "Deuda" : "Completado"}
              </Badge>
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cliente */}
        <Card>
          <Card.Header>
            <Card.Title>Detalles del Cliente</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Nombre</span>
              <span className="font-semibold">{venta.cliente_info.nombre}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Documento</span>
              <span className="font-semibold">{venta.cliente_info.numero_documento}</span>
            </div>
            {venta.cliente_info.telefono && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Teléfono</span>
                <span className="font-semibold">{venta.cliente_info.telefono}</span>
              </div>
            )}
            {venta.cliente_info.email && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Email</span>
                <span className="font-semibold truncate max-w-[200px]">{venta.cliente_info.email}</span>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Info Venta */}
        <Card>
          <Card.Header>
            <Card.Title>Información de Venta</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Fecha de Registro</span>
              <span className="font-semibold">{formatDate(venta.fecha)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Estado Actual</span>
              <Badge variant={estadoVariantMap[venta.estado]}>{venta.estado}</Badge>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Productos/Unidades</span>
              <span className="font-semibold">{formatNumber(venta.total_productos)} prod. / {formatNumber(venta.total_unidades)} unid.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Vendedor</span>
              <span className="font-semibold text-blue-700">{venta.usuario_nombre}</span>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* ── Productos ─────────────────────────────────────────────────── */}
      <Card>
        <Card.Header>
          <Card.Title>Productos de la Venta</Card.Title>
        </Card.Header>
        <Card.Content>
          <Table>
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Código
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Producto
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">
                  Cantidad
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">
                  Precio Unit.
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {venta.detalles.map((d) => (
                <tr key={d.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm text-gray-600">
                    {d.producto_codigo}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {d.producto_nombre}
                  </td>
                  <td className={`py-3 px-4 text-center ${numberClass}`}>
                    {formatNumber(d.cantidad)}
                  </td>
                  <td className={`py-3 px-4 text-right ${numberClass}`}>
                    {formatCurrency(d.precio_unitario)}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-semibold text-green-600 ${numberClass}`}
                  >
                    {formatCurrency(d.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Total al pie */}
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td
                  colSpan={4}
                  className="py-3 px-4 text-right font-bold text-gray-900"
                >
                  TOTAL
                </td>
                <td
                  className={`py-3 px-4 text-right font-bold text-xl text-gray-900 ${numberClass}`}
                >
                  {formatCurrency(venta.total)}
                </td>
              </tr>
            </tfoot>
          </Table>
        </Card.Content>
      </Card>
      {/* ── Pagos ─────────────────────────────────────────────────────── */}
      <Card>
        <Card.Header>
          <Card.Title>Historial de Pagos</Card.Title>
        </Card.Header>
        <Card.Content>
          {venta.pagos && venta.pagos.length > 0 ? (
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
                    Registrado Por
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody>
                {venta.pagos.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm text-gray-600">
                      #{p.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {formatDateTime(p.fecha)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {p.metodo_pago_display}
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
            <p className="text-center text-gray-500 py-4">No se han registrado pagos para esta venta.</p>
          )}
        </Card.Content>
      </Card>

      {/* ── Modal de Pago ─────────────────────────────────────────────── */}
      <PagoModal
        isOpen={isPagoModalOpen}
        onClose={() => setIsPagoModalOpen(false)}
        onConfirm={handlePagoSubmit}
        total={venta.total}
        saldoPendiente={venta.saldo_pendiente}
        submitting={loadingPago}
      />
    </div>
  );
}
