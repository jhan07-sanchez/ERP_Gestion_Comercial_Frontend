import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer, PageHeader, Button, Card, Table } from "@/shared/components/ui";
import { IconArrowLeft, IconCheck, IconX, IconPrinter, IconFileInvoice } from "@tabler/icons-react";
import { useAlert } from "@/shared/components/alerts";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { FacturaStatusBadge } from "../components/FacturaStatusBadge";
import { notasDebitoAPI } from "../api";
import { useNotaDebitoActions } from "../hooks/useNotaDebitoActions";
import type { NotaDebito } from "../types/notaDebito.types";
import { AnularNotaDebitoModal } from "../components/NotasDebito/AnularNotaDebitoModal";

export default function NotaDebitoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { emitirNota, anularNota, isSubmitting } = useNotaDebitoActions();

  const [nota, setNota] = useState<NotaDebito | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnularModalOpen, setIsAnularModalOpen] = useState(false);

  const fetchDetalle = async () => {
    setIsLoading(true);
    try {
      const data = await notasDebitoAPI.getNotaById(Number(id));
      setNota(data);
    } catch {
      showAlert("Error", "error", { description: "No se pudo cargar el detalle de la nota de débito." });
      navigate("/facturacion/notas_debito/lista");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetalle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4" />
          <p className="text-primary-600 font-medium">Cargando detalles...</p>
        </div>
      </PageContainer>
    );
  }

  if (!nota) return null;

  const handleEmitir = async () => {
    const success = await emitirNota(nota.id);
    if (success) {
      fetchDetalle();
    }
  };

  const handleAnularConfirm = async (motivo: string) => {
    const success = await anularNota(nota.id, { motivo });
    if (success) {
      setIsAnularModalOpen(false);
      fetchDetalle();
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Nota de Débito ${nota.numero || `#Borrador-${nota.id}`}`}
        subtitle={`Factura Origen: ${nota.factura_numero || `#${nota.factura}`}`}
        icon={<IconFileInvoice size={24} />}
        backButton={
          <Button variant="ghost" onClick={() => navigate("/facturacion/notas_debito/lista")} className="mb-4">
            <IconArrowLeft size={18} className="mr-2" />
            Volver
          </Button>
        }
        actions={
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="secondary" onClick={() => window.print()}>
              <IconPrinter size={18} className="mr-2" />
              Imprimir
            </Button>
            {nota.estado === "BORRADOR" && (
              <Button onClick={handleEmitir} disabled={isSubmitting}>
                <IconCheck size={18} className="mr-2" />
                {isSubmitting ? "Emitiendo..." : "Emitir Nota"}
              </Button>
            )}
            {nota.estado === "EMITIDA" && (
              <Button variant="danger" onClick={() => setIsAnularModalOpen(true)} disabled={isSubmitting}>
                <IconX size={18} className="mr-2" />
                Anular
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-primary-900">Líneas de la Nota de Débito</h3>
            </Card.Header>
            <Card.Content className="p-0 overflow-x-auto">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Código</Table.Head>
                    <Table.Head>Descripción</Table.Head>
                    <Table.Head className="text-right">Cant.</Table.Head>
                    <Table.Head className="text-right">Precio</Table.Head>
                    <Table.Head className="text-right">Dcto</Table.Head>
                    <Table.Head className="text-right">Impuestos</Table.Head>
                    <Table.Head className="text-right">Total</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {nota.detalles?.map((linea) => (
                    <Table.Row key={linea.id}>
                      <Table.Cell className="text-sm font-mono">{linea.producto_codigo}</Table.Cell>
                      <Table.Cell className="font-medium text-gray-800">{linea.producto_nombre}</Table.Cell>
                      <Table.Cell className="text-right">{linea.cantidad}</Table.Cell>
                      <Table.Cell className="text-right">{formatCurrency(linea.precio_unitario)}</Table.Cell>
                      <Table.Cell className="text-right text-danger-600">{formatCurrency(linea.descuento || 0)}</Table.Cell>
                      <Table.Cell className="text-right text-gray-500">{formatCurrency(linea.impuestos_linea || 0)}</Table.Cell>
                      <Table.Cell className="text-right font-bold text-gray-900">{formatCurrency(linea.total_linea || linea.subtotal)}</Table.Cell>
                    </Table.Row>
                  ))}
                  {(!nota.detalles || nota.detalles.length === 0) && (
                    <Table.Row>
                      <Table.Cell colSpan={5} className="text-center py-6 text-gray-500">
                        No hay detalles registrados.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-primary-900">Resumen</h3>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estado</span>
                <FacturaStatusBadge estado={nota.estado} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fecha Emisión</span>
                <span className="font-medium">{formatDate(nota.fecha_emision)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Usuario Responsable</span>
                <span className="font-medium">{nota.creado_por_nombre || "Sistema"}</span>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(nota.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-danger-600">
                  <span>Descuentos</span>
                  <span>-{formatCurrency(nota.descuento_total || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Impuestos</span>
                  <span>{formatCurrency(nota.impuestos_total || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-black text-primary-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatCurrency(nota.total)}</span>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg font-bold text-primary-900">Motivo</h3>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-700 whitespace-pre-wrap">{nota.motivo}</p>
            </Card.Content>
          </Card>
        </div>
      </div>

      <AnularNotaDebitoModal
        isOpen={isAnularModalOpen}
        onClose={() => setIsAnularModalOpen(false)}
        onConfirm={handleAnularConfirm}
        isLoading={isSubmitting}
      />
    </PageContainer>
  );
}
