import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Badge,
  Table,
  PageContainer,
  PageHeader,
} from "@/shared/components/ui";
import { Loader } from "@/shared/components/Loader";
import { useAlert } from "@/shared/components/alerts";
import { useCajaStore } from "../store/caja.store";
import { useCajaActions } from "../hooks/useCajaActions";
import { CajaService } from "../services/cajaService";
import { formatCurrency, formatDate, formatRelativeDate } from "@/shared/utils/formatters";
import { getTipoMovimientoLabel } from "../types/Caja.types";
import type { SesionCaja, MovimientoCaja } from "../types/Caja.types";
import {
  IconCash,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconWallet,
  IconLock,
  IconCalculator,
  IconReceipt,
  IconDoor,
  IconInfoCircle,
} from "@tabler/icons-react";

export default function CajaDashboardPage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { 
    sesionActiva, 
    isCajaAbierta, 
    isLoading: storeLoading, 
    isHydrated, 
    hydrateCaja,
    clearSesion
  } = useCajaStore();
  const { fetchDetalleCompleto, loadingDetalle } = useCajaActions();

  // Estado híbrido: datos inmediatos (store) + datos enriquecidos (backend)
  const [sesionCompleta, setSesionCompleta] = useState<SesionCaja | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  // ── 1. Hidratar si aún no se ha hecho ────────────────────────────
  useEffect(() => {
    if (!isHydrated && !storeLoading) {
      hydrateCaja();
    }
  }, [isHydrated, storeLoading, hydrateCaja]);

  // ── 2. Refrescar en segundo plano (Fuente de verdad) ─────────
  useEffect(() => {
    if (!sesionActiva?.id) return;
    let mounted = true;
    setIsSynced(false);

    const syncWithBackend = async () => {
      const data = await fetchDetalleCompleto(sesionActiva.id);
      
      if (!mounted) return;

      if (data) {
        // Validación de integridad: Si el backend dice que está cerrada,
        // pero nuestro frontend la creía abierta -> Bloquear operativa y limpiar store
        if (data.estado !== "ABIERTA") {
          showAlert("Sesión Finalizada", "warning", {
            description: "Esta sesión de caja ya fue cerrada en el sistema.",
          });
          clearSesion();
          navigate("/caja/lista");
          return;
        }

        setSesionCompleta(data);
        setIsSynced(true);
      } else {
        // Falló la llamada o devolvió null (ej: error 404, caja eliminada)
        // Podríamos considerar marcar isSynced = false, pero permitimos operar con datos locales
        // temporalmente. Aquí solo marcamos fin de intento de sync.
        setIsSynced(false);
      }
    };

    syncWithBackend();

    // Polling controlado cada 15 segundos solo si la pestaña está visible
    const intervalId = setInterval(() => {
      if (document.visibilityState === "visible") {
        syncWithBackend();
      }
    }, 15000);

    return () => { 
      mounted = false; 
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesionActiva?.id]);

  // ── Datos derivados (Estrategia híbrida) ────────────────────
  // 1. Mostrar datos instantáneos (sesionActiva) o 2. Datos reales (sesionCompleta)
  const dataFuente = sesionCompleta || sesionActiva;

  const resumen = useMemo(() => {
    if (!dataFuente) return null;
    return CajaService.generarResumen(dataFuente);
  }, [dataFuente]);

  const ultimos: MovimientoCaja[] = useMemo(() => {
    return (sesionCompleta?.movimientos ?? []).slice(0, 8);
  }, [sesionCompleta]);

  const esIngreso = (tipo: string) =>
    tipo.includes("INGRESO") || tipo === "APERTURA";

  // ── Loading inicial (esperar hidratación del store) ─────────
  if (!isHydrated || storeLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  // ── Sin sesión activa (Store vacío o limpiado por sync) ─────
  if (!isCajaAbierta || !sesionActiva) {
    return (
      <PageContainer maxWidth="md">
        <PageHeader
          title="Dashboard de Caja"
          subtitle="Resumen rápido de tu sesión"
          icon={<IconCash size={24} />}
        />
        <Card className="shadow-lg border-primary-100">
          <Card.Content className="text-center py-16 space-y-4">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
              <IconCash size={40} className="text-primary-300" />
            </div>
            <h3 className="text-lg font-bold text-primary-700">
              No hay sesión de caja activa
            </h3>
            <p className="text-sm text-primary-400 max-w-md mx-auto">
              Para ver el dashboard necesitas tener una caja abierta. Abre una sesión para comenzar a operar.
            </p>
            <Button
              onClick={() => navigate("/caja/lista")}
              className="shadow-lg shadow-accent-200 mt-2"
            >
              <IconDoor size={18} />
              Ir a Cajas
            </Button>
          </Card.Content>
        </Card>
      </PageContainer>
    );
  }

  const sesionId = sesionActiva.id;
  const cajaNombre = sesionCompleta?.caja_nombre || sesionActiva.caja_nombre || "Caja Activa";
  const usuarioNombre = sesionCompleta?.usuario_nombre || sesionActiva.usuario_nombre || "Usuario Actual";

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard de Caja"
        subtitle={`${cajaNombre} — ${sesionActiva.fecha_apertura ? formatRelativeDate(sesionActiva.fecha_apertura) : "Sesión activa"}`}
        icon={<IconCash size={24} />}
        actions={
          <div className="flex items-center gap-2">
            {!isSynced && loadingDetalle && (
              <Badge variant="warning" className="text-xs px-2 py-1 animate-pulse flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-warning-600 animate-ping"></span>
                Sincronizando...
              </Badge>
            )}
            {isSynced && (
              <Badge variant="success" className="text-xs px-2 py-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success-100"></span>
                Sincronizado
              </Badge>
            )}
            <Badge variant="success" className="text-sm px-3 py-1 ml-2 shadow-sm shadow-success-100">
              Sesión Abierta
            </Badge>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashKPI
          label="Saldo Inicial"
          value={formatCurrency(resumen?.montoInicial ?? 0)}
          icon={<IconWallet size={22} />}
          color="blue"
        />
        <DashKPI
          label="Total Ingresos"
          value={formatCurrency(resumen?.totalIngresos ?? 0)}
          icon={<IconArrowDownLeft size={22} />}
          color="emerald"
        />
        <DashKPI
          label="Total Egresos"
          value={formatCurrency(resumen?.totalEgresos ?? 0)}
          icon={<IconArrowUpRight size={22} />}
          color="rose"
        />
        <DashKPI
          label="Saldo Actual"
          value={formatCurrency(resumen?.saldoEsperado ?? 0)}
          icon={<IconCash size={22} />}
          color="indigo"
          highlighted
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Acciones rápidas */}
        <Card className="xl:col-span-1 shadow-sm border-primary-100">
          <Card.Header>
            <Card.Title>Acciones Rápidas</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-3">
            <ActionButton
              label="Registrar Movimiento"
              description="Ingresos y egresos manuales"
              icon={<IconReceipt size={20} />}
              color="blue"
              onClick={() => navigate(`/caja/sesion/${sesionId}/movimientos`)}
            />
            <ActionButton
              label="Arqueo de Caja"
              description="Conteo físico vs sistema"
              icon={<IconCalculator size={20} />}
              color="amber"
              onClick={() => navigate(`/caja/sesion/${sesionId}/arqueo`)}
            />
            <ActionButton
              label="Cerrar Caja"
              description="Finalizar la sesión de caja"
              icon={<IconLock size={20} />}
              color="rose"
              onClick={() => navigate(`/caja/sesion/${sesionId}/cerrar`)}
            />
            <ActionButton
              label="Ver Detalle Completo"
              description="Toda la información de la sesión"
              icon={<IconInfoCircle size={20} />}
              color="indigo"
              onClick={() => navigate(`/caja/sesion/${sesionId}`)}
            />
          </Card.Content>
        </Card>

        {/* Últimos movimientos */}
        <Card className="xl:col-span-2 overflow-hidden shadow-sm border-primary-100">
          <Card.Header className="flex flex-row items-center justify-between">
            <Card.Title>Últimos Movimientos</Card.Title>
            <Button
              size="sm"
              variant="secondary"
              className="text-xs"
              onClick={() => navigate(`/caja/sesion/${sesionId}/movimientos`)}
            >
              Ver todos
            </Button>
          </Card.Header>
          <Card.Content className="p-0">
            {loadingDetalle && ultimos.length === 0 ? (
               <div className="flex items-center justify-center py-12">
                 <Loader />
               </div>
            ) : ultimos.length === 0 ? (
              <div className="text-center py-12">
                <IconReceipt size={32} className="text-primary-200 mx-auto mb-2" />
                <p className="text-primary-400 font-medium text-sm">
                  Sin movimientos aún
                </p>
              </div>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Tipo</Table.Head>
                    <Table.Head className="hidden sm:table-cell">Descripción</Table.Head>
                    <Table.Head className="text-right">Monto</Table.Head>
                    <Table.Head className="hidden md:table-cell">Hora</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {ultimos.map((mov) => {
                    const ingreso = esIngreso(mov.tipo);
                    const monto =
                      typeof mov.monto === "string"
                        ? parseFloat(mov.monto)
                        : mov.monto;

                    return (
                      <Table.Row key={mov.id} hover>
                        <Table.Cell>
                          <Badge
                            variant={ingreso ? "success" : "danger"}
                            className="text-[10px] uppercase font-bold"
                          >
                            {getTipoMovimientoLabel(mov.tipo)}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell className="hidden sm:table-cell max-w-[200px] truncate font-medium text-primary-700">
                          {mov.descripcion}
                        </Table.Cell>
                        <Table.Cell
                          className={`text-right font-bold tabular-nums ${
                            ingreso ? "text-success-600" : "text-danger-600"
                          }`}
                        >
                          {ingreso ? "+" : "-"} {formatCurrency(monto)}
                        </Table.Cell>
                        <Table.Cell className="hidden md:table-cell text-xs text-primary-400 font-medium">
                          {formatDate(mov.fecha, true)}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Info de sesión */}
      <Card className="shadow-sm border-primary-100">
        <Card.Content className="p-4 flex flex-wrap gap-6 text-xs text-primary-500">
          <span>
            <strong className="text-primary-700">Caja:</strong>{" "}
            {cajaNombre}
          </span>
          <span>
            <strong className="text-primary-700">Usuario:</strong>{" "}
            {usuarioNombre}
          </span>
          <span>
            <strong className="text-primary-700">Apertura:</strong>{" "}
            {sesionActiva.fecha_apertura
              ? formatDate(sesionActiva.fecha_apertura, true)
              : "—"}
          </span>
          <span>
            <strong className="text-primary-700">Movimientos:</strong>{" "}
            {sesionCompleta?.movimientos?.length ?? 0}
          </span>
        </Card.Content>
      </Card>
    </PageContainer>
  );
}

// ── Sub-componente: Dashboard KPI ───────────────────────────
function DashKPI({
  label,
  value,
  icon,
  color,
  highlighted,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  highlighted?: boolean;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-accent-50 border-accent-100 text-accent-700",
    emerald: "bg-success-50 border-success-100 text-success-700",
    rose: "bg-danger-50 border-danger-100 text-danger-700",
    indigo: "bg-accent-50 border-accent-100 text-accent-700",
  };

  return (
    <Card className={`${colorMap[color]} border shadow-sm`}>
      <Card.Content className="p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="opacity-50">{icon}</div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
            {label}
          </p>
        </div>
        <p
          className={`text-2xl font-black tabular-nums ${
            highlighted ? "scale-105 origin-left" : ""
          }`}
        >
          {value}
        </p>
      </Card.Content>
    </Card>
  );
}

// ── Sub-componente: Action Button ───────────────────────────
function ActionButton({
  label,
  description,
  icon,
  color,
  onClick,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-accent-50 text-accent-600 border-accent-100 hover:bg-accent-100",
    amber: "bg-warning-50 text-warning-600 border-warning-100 hover:bg-warning-100",
    rose: "bg-danger-50 text-danger-600 border-danger-100 hover:bg-danger-100",
    indigo: "bg-accent-50 text-accent-600 border-accent-100 hover:bg-accent-100",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${colorMap[color]} group cursor-pointer`}
    >
      <div className="shrink-0 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-left">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-[11px] opacity-60">{description}</p>
      </div>
    </button>
  );
}
