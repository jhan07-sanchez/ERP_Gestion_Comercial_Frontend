import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Badge, PageContainer, PageHeader, Table } from "@/shared/components/ui";
import { Loader } from "@/shared/components/Loader";
import { IconLock, IconCalculator, IconCash, IconArrowLeft } from "@tabler/icons-react";
import { useCajaActions } from "../hooks/useCajaActions";
import { getEstadoSesionLabel, type SesionCaja } from "../types/Caja.types";
import { CajaService } from "../services/cajaService";
import { formatCurrency, formatDate, formatRelativeDate } from "../../../shared/utils/formatters";

export default function CajaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchDetalleCompleto } = useCajaActions();
  const sesionId = Number(id);

  const [cajaDetalle, setCajaDetalle] = useState<SesionCaja | null>(null);
  const [movimientos, setMovimientos] = useState<Array<{ id: number; es_ingreso: boolean; tipo: string; descripcion: string; monto: number; fecha: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sesionId) return;
    let mounted = true;
    const loadDetalle = async () => {
      try {
        const data = await fetchDetalleCompleto(sesionId);
        if (data && mounted) {
          setCajaDetalle(data);
          setMovimientos((data.movimientos || []).map(mov => ({
            id: mov.id,
            es_ingreso: mov.tipo?.includes('INGRESO') ?? false,
            tipo: mov.tipo,
            descripcion: mov.descripcion || '',
            monto: typeof mov.monto === 'string' ? parseFloat(mov.monto) : mov.monto,
            fecha: mov.fecha
          })));
        }
      } catch (err) {
        console.error(err);
        if (mounted) navigate("/caja");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadDetalle();
    return () => { mounted = false; };
  }, [sesionId, fetchDetalleCompleto, navigate]);

  if (loading || !cajaDetalle) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  const datosResumen = CajaService.generarResumen(cajaDetalle);
  const permisos = CajaService.obtenerPermisosOperacion(cajaDetalle);

  return (
    <PageContainer>
      <PageHeader
        title={`${cajaDetalle?.caja_nombre ?? 'Caja'} #${cajaDetalle?.id ?? ''}`}
        subtitle={`Abierta por ${cajaDetalle.usuario_nombre} - ${formatRelativeDate(cajaDetalle.fecha_apertura, !!cajaDetalle.fecha_cierre)}`}
        icon={<IconCash size={24} />}
        backButton={
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2 h-10 w-10 flex items-center justify-center rounded-xl"
          >
            <IconArrowLeft size={20} />
          </Button>
        }
        actions={
          <Badge variant={cajaDetalle.estado === "ABIERTA" ? "success" : "gray"} className="text-sm px-3 py-1">
            {getEstadoSesionLabel(cajaDetalle.estado)}
          </Badge>
        }
      />

      {/* Resumen - KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Monto Inicial" value={formatCurrency(datosResumen.montoInicial)} color="blue" />
        <KPICard label="Total Ingresos" value={formatCurrency(datosResumen.totalIngresos)} color="emerald" />
        <KPICard label="Total Egresos" value={formatCurrency(datosResumen.totalEgresos)} color="rose" />
        <KPICard label="Saldo Esperado" value={formatCurrency(datosResumen.saldoEsperado)} color="indigo" isHighlighted />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Detalles */}
        <Card className="xl:col-span-1 shadow-sm border-primary-100">
          <Card.Header>
            <Card.Title>Detalles de la Sesión</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4">
            <DetailItem label="Caja" value={cajaDetalle?.caja_nombre ?? ''} />
            <DetailItem label="Usuario" value={cajaDetalle?.usuario_nombre ?? ''} />
            <DetailItem label="Abierta" value={cajaDetalle?.fecha_apertura ? formatDate(cajaDetalle.fecha_apertura, false) : ''} />
            <DetailItem 
              label="Cerrada" 
              value={cajaDetalle.fecha_cierre ? formatDate(cajaDetalle.fecha_cierre, false) : "Sesión abierta"} 
            />
            <div className="pt-2">
              <p className="text-xs text-primary-400 font-bold uppercase mb-1">Observaciones</p>
              <p className="text-sm text-primary-900 bg-primary-50 p-3 rounded-xl border border-primary-100 italic">
                {cajaDetalle.observaciones_apertura || "Sin observaciones"}
              </p>
            </div>
          </Card.Content>
        </Card>

        {/* Movimientos */}
        <Card className="xl:col-span-2 shadow-sm border-primary-100 overflow-hidden">
          <Card.Header className="flex flex-row items-center justify-between">
            <Card.Title>Movimientos ({movimientos.length})</Card.Title>
          </Card.Header>
          <Card.Content className="p-0">
            {movimientos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-primary-400 font-medium italic">No hay movimientos registrados</p>
              </div>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Tipo</Table.Head>
                    <Table.Head>Descripción</Table.Head>
                    <Table.Head className="text-right">Monto</Table.Head>
                    <Table.Head className="hidden sm:table-cell">Hora</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {movimientos.map((mov) => (
                    <Table.Row key={mov.id} hover>
                      <Table.Cell>
                        <Badge variant={mov.es_ingreso ? "success" : "danger"} className="text-[10px] uppercase font-bold">
                          {mov.tipo}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="max-w-[200px] truncate font-medium text-primary-700">
                        {mov.descripcion}
                      </Table.Cell>
                      <Table.Cell className={`text-right font-bold ${mov.es_ingreso ? "text-emerald-600" : "text-rose-600"}`}>
                        {mov.es_ingreso ? "+" : "-"} {formatCurrency(mov.monto)}
                      </Table.Cell>
                      <Table.Cell className="hidden sm:table-cell text-xs text-primary-400 font-medium">
                        {formatDate(mov.fecha, true)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-primary-100">
        {permisos.puedeCerrar && (
          <Button 
            onClick={() => navigate(`/caja/sesion/${sesionId}/cerrar`)}
            variant="danger"
            className="w-full sm:w-auto shadow-lg shadow-rose-100"
          >
            <IconLock size={18} />
            Cerrar Caja
          </Button>
        )}
        {permisos.puedeRegistrarArqueo && (
          <Button 
            onClick={() => navigate(`/caja/sesion/${sesionId}/arqueo`)}
            variant="secondary"
            className="w-full sm:w-auto shadow-lg shadow-primary-100"
          >
            <IconCalculator size={18} />
            Registrar Arqueo
          </Button>
        )}
      </div>
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
        <p className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</p>
        <p className={`text-2xl font-black tabular-nums transition-all ${isHighlighted ? 'scale-105 origin-left' : ''}`}>
          {value}
        </p>
      </Card.Content>
    </Card>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-primary-50 last:border-0">
      <span className="text-xs text-primary-400 font-bold uppercase tracking-wider">{label}</span>
      <span className="text-sm text-primary-900 font-semibold">{value}</span>
    </div>
  );
}

