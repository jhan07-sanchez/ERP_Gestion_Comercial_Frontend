import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Input,
  Badge,
  Table,
  PageContainer,
  PageHeader,
} from "@/shared/components/ui";
import { Loader } from "@/shared/components/Loader";
import { useCajaActions } from "../hooks/useCajaActions";
import { useCajaStore } from "../store/caja.store";
import { metodosPagoAPI, movimientosAPI } from "../api/Caja.api";
import { CajaService } from "../services/cajaService";
import { useAlert } from "@/shared/components/alerts";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import {
  getTipoMovimientoLabel,
  TIPOS_MOVIMIENTO_MANUALES,
  type SesionCaja,
  type MetodoPago,
  type MovimientoCaja,
  type TipoMovimiento,
} from "../types/Caja.types";
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconPlus,
  IconFilter,
  IconReceipt,
} from "@tabler/icons-react";

export default function CajaMovimientosPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { fetchDetalleCompleto, registrarMovimiento, loadingMovimiento, loadingDetalle } =
    useCajaActions();
  const clearSesion = useCajaStore((state) => state.clearSesion);

  const sesionId = Number(id);

  const [sesion, setSesion] = useState<SesionCaja | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [loadingMovs, setLoadingMovs] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Filtro
  const [filtroTipo, setFiltroTipo] = useState<string>("TODOS");

  // Formulario
  const [showForm, setShowForm] = useState(false);
  const [formTipo, setFormTipo] = useState<TipoMovimiento>("INGRESO_MANUAL");
  const [formMonto, setFormMonto] = useState("");
  const [formDescripcion, setFormDescripcion] = useState("");
  const [formMetodoPago, setFormMetodoPago] = useState("");

  // ── Cargar datos ─────────────────────────────────────────────
  const cargarMovimientos = useCallback(async () => {
    setLoadingMovs(true);
    try {
      const resp = await movimientosAPI.getMovimientos({
        sesion: sesionId,
        page_size: 100,
      });
      setMovimientos(resp.results ?? []);
    } catch {
      console.error("Error cargando movimientos");
    } finally {
      setLoadingMovs(false);
    }
  }, [sesionId]);

  useEffect(() => {
    if (!sesionId) return;
    let mounted = true;

    const load = async () => {
      const [data, metodos] = await Promise.all([
        fetchDetalleCompleto(sesionId),
        metodosPagoAPI.getMetodosPago(),
      ]);
      if (mounted) {
        if (data) setSesion(data);
        setMetodosPago(metodos);
        if (metodos?.length > 0) {
          setFormMetodoPago(String(metodos[0].id));
        }
      }
    };

    load();
    cargarMovimientos();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesionId]);

  // ── Submit movimiento ────────────────────────────────────────
  const handleRegistrar = async () => {
    if (!sesion || isVerifying) return;
    
    setIsVerifying(true);
    try {
      // JIT Validation con Timeout de 3s para evitar bloqueos
      const timeoutPromise = new Promise<"TIMEOUT">((resolve) => setTimeout(() => resolve("TIMEOUT"), 3000));
      const result = await Promise.race([fetchDetalleCompleto(sesionId), timeoutPromise]);
      
      if (result !== "TIMEOUT") {
        const sesionActualizada = result as SesionCaja | null;
        if (!sesionActualizada || sesionActualizada.estado !== "ABIERTA") {
          showAlert("Sesión Finalizada", "warning", {
            description: "Esta sesión de caja ya fue cerrada en el sistema. No se pueden registrar movimientos.",
          });
          clearSesion();
          navigate("/caja/lista");
          return;
        }
      } else {
        showAlert("Conexión demorada", "info", {
          description: "La verificación JIT está tardando. Procediendo con la operación...",
        });
      }

      const monto = parseFloat(formMonto);

      const validacion = CajaService.validarMovimiento(sesion, formTipo, monto);
      if (!validacion.valido) {
        showAlert("Validación", "warning", {
          description: validacion.errores.join(". "),
        });
        return;
      }

      if (!formDescripcion.trim()) {
        showAlert("Validación", "warning", {
          description: "La descripción es obligatoria.",
        });
        return;
      }

      if (!formMetodoPago) {
        showAlert("Validación", "warning", {
          description: "Seleccione un método de pago.",
        });
        return;
      }

      const exito = await registrarMovimiento(sesionId, {
        tipo: formTipo,
        monto: monto,
        descripcion: formDescripcion.trim(),
        metodo_pago_id: parseInt(formMetodoPago, 10),
      });

      if (exito) {
        showAlert("Movimiento registrado", "success", {
          description: `${getTipoMovimientoLabel(formTipo)} por ${formatCurrency(monto)}`,
        });
        // Reset form
        setFormMonto("");
        setFormDescripcion("");
        setShowForm(false);
        // Recargar
        cargarMovimientos();
        const updated = await fetchDetalleCompleto(sesionId);
        if (updated) setSesion(updated);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Filtrar movimientos ──────────────────────────────────────
  const movimientosFiltrados =
    filtroTipo === "TODOS"
      ? movimientos
      : movimientos.filter((m) => m.tipo === filtroTipo);

  const esIngreso = (tipo: string) =>
    tipo.includes("INGRESO") || tipo === "APERTURA";

  // ── Loading ──────────────────────────────────────────────────
  if (loadingDetalle && !sesion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  const sesionAbierta = sesion?.estado === "ABIERTA";
  const totales = sesion ? CajaService.obtenerTotales(sesion) : null;

  return (
    <PageContainer>
      <PageHeader
        title="Movimientos de Caja"
        subtitle={`${sesion?.caja_nombre ?? "Caja"} — Sesión #${sesion?.id ?? ""}`}
        icon={<IconReceipt size={24} />}
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
          sesionAbierta ? (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="shadow-md shadow-blue-200"
            >
              <IconPlus size={18} />
              Nuevo Movimiento
            </Button>
          ) : (
            <Badge variant="gray" className="text-sm px-3 py-1">
              Sesión Cerrada
            </Badge>
          )
        }
      />

      {/* KPI resumido */}
      {totales && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MiniKPI
            label="Saldo Inicial"
            value={formatCurrency(totales.montoInicial)}
            icon={<IconReceipt size={16} />}
            color="blue"
          />
          <MiniKPI
            label="Ingresos"
            value={formatCurrency(totales.totalIngresos)}
            icon={<IconArrowDownLeft size={16} />}
            color="emerald"
          />
          <MiniKPI
            label="Egresos"
            value={formatCurrency(totales.totalEgresos)}
            icon={<IconArrowUpRight size={16} />}
            color="rose"
          />
          <MiniKPI
            label="Saldo Actual"
            value={formatCurrency(totales.saldoEsperado)}
            icon={<IconReceipt size={16} />}
            color="indigo"
          />
        </div>
      )}

      {/* Formulario de nuevo movimiento */}
      {showForm && sesionAbierta && (
        <Card className="shadow-lg border-blue-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <Card.Header className="bg-blue-50/50">
            <Card.Title>Registrar Movimiento</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tipo */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-primary-700">
                  Tipo <span className="text-danger-500">*</span>
                </label>
                <select
                  value={formTipo}
                  onChange={(e) => setFormTipo(e.target.value as TipoMovimiento)}
                  className="block w-full px-4 py-2.5 border border-primary-300 rounded-button text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                >
                  {TIPOS_MOVIMIENTO_MANUALES.map((t) => (
                    <option key={t} value={t}>
                      {getTipoMovimientoLabel(t)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Método de pago */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-primary-700">
                  Método de Pago <span className="text-danger-500">*</span>
                </label>
                <select
                  value={formMetodoPago}
                  onChange={(e) => setFormMetodoPago(e.target.value)}
                  className="block w-full px-4 py-2.5 border border-primary-300 rounded-button text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                >
                  {metodosPago.map((mp) => (
                    <option key={mp.id} value={mp.id}>
                      {mp.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Monto */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-primary-700">
                  Monto <span className="text-danger-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formMonto}
                  onChange={(e) => setFormMonto(e.target.value)}
                  className="bg-primary-50/30"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-primary-700">
                  Descripción <span className="text-danger-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Motivo del movimiento..."
                  value={formDescripcion}
                  onChange={(e) => setFormDescripcion(e.target.value)}
                  maxLength={200}
                />
              </div>
            </div>
          </Card.Content>
          <Card.Footer className="flex justify-end gap-3 p-4 bg-primary-50/30">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowForm(false)}
              disabled={loadingMovimiento}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleRegistrar}
              disabled={loadingMovimiento || isVerifying || !formMonto || !formDescripcion.trim()}
              isLoading={loadingMovimiento || isVerifying}
            >
              Registrar
            </Button>
          </Card.Footer>
        </Card>
      )}

      {/* Filtros + Historial */}
      <Card className="overflow-hidden border-primary-100 shadow-sm">
        <Card.Header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Card.Title>
            Historial de Movimientos ({movimientosFiltrados.length})
          </Card.Title>
          <div className="flex items-center gap-2">
            <IconFilter size={16} className="text-primary-400" />
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="text-xs px-3 py-1.5 border border-primary-200 rounded-lg bg-white focus:ring-1 focus:ring-blue-200"
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="APERTURA">Apertura</option>
              <option value="INGRESO_VENTA">Ingreso por Venta</option>
              <option value="INGRESO_MANUAL">Ingreso Manual</option>
              <option value="EGRESO_COMPRA">Egreso por Compra</option>
              <option value="EGRESO_GASTO">Egreso por Gasto</option>
              <option value="EGRESO_RETIRO">Retiro</option>
            </select>
          </div>
        </Card.Header>
        <Card.Content className="p-0">
          {loadingMovs ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : movimientosFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <IconReceipt size={40} className="text-primary-200 mx-auto mb-3" />
              <p className="text-primary-400 font-medium">
                No hay movimientos registrados
              </p>
            </div>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Tipo</Table.Head>
                  <Table.Head>Descripción</Table.Head>
                  <Table.Head className="text-right">Monto</Table.Head>
                  <Table.Head className="hidden sm:table-cell">Usuario</Table.Head>
                  <Table.Head className="hidden md:table-cell">Fecha</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {movimientosFiltrados.map((mov) => {
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
                          {ingreso ? (
                            <IconArrowDownLeft size={12} className="mr-1" />
                          ) : (
                            <IconArrowUpRight size={12} className="mr-1" />
                          )}
                          {getTipoMovimientoLabel(mov.tipo)}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="max-w-[200px] truncate font-medium text-primary-700">
                        {mov.descripcion}
                      </Table.Cell>
                      <Table.Cell
                        className={`text-right font-bold tabular-nums ${
                          ingreso ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {ingreso ? "+" : "-"} {formatCurrency(monto)}
                      </Table.Cell>
                      <Table.Cell className="hidden sm:table-cell text-xs text-primary-500">
                        {mov.usuario_nombre ?? "—"}
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
    </PageContainer>
  );
}

// ── Sub-componente: Mini KPI ────────────────────────────────
function MiniKPI({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    rose: "bg-rose-50 border-rose-100 text-rose-700",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
  };

  return (
    <div className={`${colorMap[color]} border rounded-xl p-3 shadow-sm flex items-center gap-3`}>
      <div className="opacity-60">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
          {label}
        </p>
        <p className="text-sm font-black tabular-nums">{value}</p>
      </div>
    </div>
  );
}
