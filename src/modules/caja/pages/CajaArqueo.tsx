import { useEffect, useState, useMemo } from "react";
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
import { CajaService } from "../services/cajaService";
import { useAlert } from "@/shared/components/alerts";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import { getTipoArqueoLabel, type SesionCaja, type ArqueoCaja } from "../types/Caja.types";
import {
  IconArrowLeft,
  IconCalculator,
  IconCheck,
  IconAlertTriangle,
  IconMinus,
  IconPlus,
  IconClipboardList,
} from "@tabler/icons-react";

export default function CajaArqueoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { fetchDetalleCompleto, registrarArqueo, loadingArqueo, loadingDetalle } =
    useCajaActions();
  const clearSesion = useCajaStore((state) => state.clearSesion);

  const sesionId = Number(id);

  const [sesion, setSesion] = useState<SesionCaja | null>(null);
  const [montoContado, setMontoContado] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // ── Cargar datos ─────────────────────────────────────────────
  useEffect(() => {
    if (!sesionId) return;
    let mounted = true;

    const load = async () => {
      const data = await fetchDetalleCompleto(sesionId);
      if (data && mounted) setSesion(data);
    };

    load();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesionId]);

  // ── Cálculos ────────────────────────────────────────────────
  const saldoEsperado = useMemo(() => {
    if (!sesion) return 0;
    return CajaService.obtenerTotales(sesion).saldoEsperado;
  }, [sesion]);

  const montoContadoNum = parseFloat(montoContado) || 0;
  const diferencia = CajaService.calcularDiferencia(montoContadoNum, saldoEsperado);
  const clasificacion = CajaService.clasificarDiferencia(diferencia);

  const analisis = useMemo(() => {
    if (!montoContado || montoContadoNum === 0) return null;
    return CajaService.analizarDiscrepancia(diferencia, saldoEsperado);
  }, [montoContado, montoContadoNum, diferencia, saldoEsperado]);

  // ── Submit ──────────────────────────────────────────────────
  const handleRegistrar = async () => {
    if (!sesion || isVerifying) return;

    setIsVerifying(true);
    try {
      // JIT Validation con Timeout de 3s para evitar bloqueos
      const timeoutPromise = new Promise<"TIMEOUT">((resolve) => setTimeout(() => resolve("TIMEOUT"), 3000));
      const result = await Promise.race([fetchDetalleCompleto(sesionId), timeoutPromise]);
      
      let sesionParaValidar = sesion;

      if (result !== "TIMEOUT") {
        const sesionActualizada = result as SesionCaja | null;
        if (!sesionActualizada || sesionActualizada.estado !== "ABIERTA") {
          showAlert("Sesión Finalizada", "warning", {
            description: "Esta sesión de caja ya fue cerrada en el sistema. No se pueden registrar arqueos.",
          });
          clearSesion();
          navigate("/caja/lista");
          return;
        }
        sesionParaValidar = sesionActualizada;
      } else {
        showAlert("Conexión demorada", "info", {
          description: "La verificación JIT está tardando. Procediendo con la operación...",
        });
      }

      const validacion = CajaService.validarArqueo(sesionParaValidar, montoContadoNum);
      if (!validacion.valido) {
        showAlert("Validación", "warning", {
          description: validacion.errores.join(". "),
        });
        return;
      }

      const exito = await registrarArqueo(sesionId, {
        monto_contado: montoContadoNum,
        observaciones: observaciones.trim(),
      });

      if (exito) {
        showAlert("Arqueo registrado", "success", {
          description:
            clasificacion === "EXACTO"
              ? "¡El conteo coincide con el sistema!"
              : `Diferencia de ${formatCurrency(Math.abs(diferencia))} (${clasificacion})`,
        });
        // Recargar para obtener el nuevo arqueo
        setMontoContado("");
        setObservaciones("");
        const updated = await fetchDetalleCompleto(sesionId);
        if (updated) setSesion(updated);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Loading ─────────────────────────────────────────────────
  if (loadingDetalle && !sesion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  const arqueos: ArqueoCaja[] = sesion?.arqueos ?? [];

  return (
    <PageContainer maxWidth="lg">
      <PageHeader
        title="Arqueo de Caja"
        subtitle={`${sesion?.caja_nombre ?? "Caja"} — Sesión #${sesion?.id ?? ""}`}
        icon={<IconCalculator size={24} />}
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
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Formulario de arqueo */}
        <div className="space-y-6">
          {/* Saldo del sistema */}
          <Card className="border-accent-100 shadow-sm">
            <Card.Content className="p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-500 mb-1">
                Saldo Esperado (Sistema)
              </p>
              <p className="text-3xl font-black text-accent-700 tabular-nums">
                {formatCurrency(saldoEsperado)}
              </p>
              <p className="text-xs text-primary-400 mt-1">
                Calculado: Monto Inicial + Ingresos − Egresos
              </p>
            </Card.Content>
          </Card>

          {/* Formulario */}
          <Card className="shadow-lg border-primary-100">
            <Card.Header>
              <Card.Title>Conteo Físico</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-5">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-primary-700">
                  Monto Contado <span className="text-danger-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={montoContado}
                  onChange={(e) => setMontoContado(e.target.value)}
                  className="bg-primary-50/30 text-lg font-semibold"
                />
                <p className="text-xs text-primary-400">
                  Total de dinero contado físicamente en caja.
                </p>
              </div>

              {/* Resultado dinámico */}
              {montoContado && (
                <div
                  className={`p-4 rounded-xl border-2 transition-all ${
                    clasificacion === "EXACTO"
                      ? "bg-success-50 border-success-200"
                      : clasificacion === "SOBRANTE"
                        ? "bg-warning-50 border-warning-200"
                        : "bg-danger-50 border-danger-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold uppercase tracking-wider opacity-70">
                      Resultado
                    </span>
                    <Badge
                      variant={
                        clasificacion === "EXACTO"
                          ? "success"
                          : clasificacion === "SOBRANTE"
                            ? "warning"
                            : "danger"
                      }
                      className="text-xs font-bold"
                    >
                      {clasificacion === "EXACTO" && <IconCheck size={14} className="mr-1" />}
                      {clasificacion === "SOBRANTE" && <IconPlus size={14} className="mr-1" />}
                      {clasificacion === "FALTANTE" && <IconMinus size={14} className="mr-1" />}
                      {clasificacion}
                    </Badge>
                  </div>
                  <p className="text-2xl font-black tabular-nums">
                    {diferencia >= 0 ? "+" : ""}
                    {formatCurrency(diferencia)}
                  </p>

                  {analisis && clasificacion !== "EXACTO" && (
                    <div className="mt-3 pt-3 border-t border-current/10 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <IconAlertTriangle size={14} className="opacity-60" />
                        <span className="text-xs font-bold uppercase">
                          Severidad: {analisis.severidad} — Error: {analisis.porcentaje}%
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1">Posibles causas:</p>
                        <ul className="text-xs list-disc list-inside space-y-0.5 opacity-80">
                          {analisis.causasProbables.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1">Acciones recomendadas:</p>
                        <ul className="text-xs list-disc list-inside space-y-0.5 opacity-80">
                          {analisis.accionesRecomendadas.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Observaciones */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-primary-700">
                  Observaciones (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Notas sobre el arqueo..."
                  className="
                    block w-full px-4 py-2.5 
                    border border-primary-300 rounded-button 
                    text-sm bg-white focus:ring-2 focus:ring-accent-100 focus:border-accent-500 transition-all
                  "
                  maxLength={500}
                />
              </div>
            </Card.Content>
            <Card.Footer className="flex justify-end gap-3 p-4 bg-primary-50/30">
              <Button
                variant="secondary"
                onClick={() => navigate(-1)}
                disabled={loadingArqueo}
              >
                Volver
              </Button>
              <Button
                onClick={handleRegistrar}
                disabled={loadingArqueo || isVerifying || !montoContado}
                isLoading={loadingArqueo || isVerifying}
                className="shadow-lg shadow-accent-200"
              >
                <IconClipboardList size={18} />
                Registrar Arqueo
              </Button>
            </Card.Footer>
          </Card>
        </div>

        {/* Historial de arqueos */}
        <Card className="overflow-hidden border-primary-100 shadow-sm h-fit">
          <Card.Header>
            <Card.Title>Historial de Arqueos ({arqueos.length})</Card.Title>
          </Card.Header>
          <Card.Content className="p-0">
            {arqueos.length === 0 ? (
              <div className="text-center py-16">
                <IconCalculator size={40} className="text-primary-200 mx-auto mb-3" />
                <p className="text-primary-400 font-medium">
                  No se han realizado arqueos
                </p>
              </div>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Tipo</Table.Head>
                    <Table.Head className="text-right">Contado</Table.Head>
                    <Table.Head className="text-right">Esperado</Table.Head>
                    <Table.Head className="text-right">Diferencia</Table.Head>
                    <Table.Head className="hidden sm:table-cell">Fecha</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {arqueos.map((arq) => {
                    const contado = parseFloat(arq.monto_contado);
                    const esperado = parseFloat(arq.monto_esperado);
                    const diff = parseFloat(arq.diferencia ?? "0");
                    const clasif = CajaService.clasificarDiferencia(diff);

                    return (
                      <Table.Row key={arq.id} hover>
                        <Table.Cell>
                          <Badge variant="info" className="text-[10px] uppercase font-bold">
                            {getTipoArqueoLabel(arq.tipo)}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell className="text-right font-bold tabular-nums text-primary-700">
                          {formatCurrency(contado)}
                        </Table.Cell>
                        <Table.Cell className="text-right tabular-nums text-primary-500">
                          {formatCurrency(esperado)}
                        </Table.Cell>
                        <Table.Cell
                          className={`text-right font-bold tabular-nums ${
                            clasif === "EXACTO"
                              ? "text-success-600"
                              : clasif === "SOBRANTE"
                                ? "text-warning-600"
                                : "text-danger-600"
                          }`}
                        >
                          {diff >= 0 ? "+" : ""}
                          {formatCurrency(diff)}
                        </Table.Cell>
                        <Table.Cell className="hidden sm:table-cell text-xs text-primary-400 font-medium">
                          {formatDate(arq.fecha, true)}
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
    </PageContainer>
  );
}
