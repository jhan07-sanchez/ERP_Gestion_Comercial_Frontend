import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Input, Badge, PageContainer, PageHeader } from "@/shared/components/ui";
import { Loader } from "@/shared/components/Loader";
import { useCajaActions } from "../hooks/useCajaActions";
import { useCajaStore } from "../store/caja.store";
import { CajaService } from "../services/cajaService";
import { useAlert } from "@/shared/components/alerts";
import { formatCurrency } from "@/shared/utils/formatters";
import type { SesionCaja } from "../types/Caja.types";
import {
  IconLock,
  IconArrowLeft,
  IconAlertTriangle,
  IconCheck,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";

export default function CajaCierrePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert, confirm } = useAlert();
  const { fetchDetalleCompleto, cerrarCaja, loadingCerrar, loadingDetalle } =
    useCajaActions();
  const clearSesion = useCajaStore((state) => state.clearSesion);

  const sesionId = Number(id);

  const [sesion, setSesion] = useState<SesionCaja | null>(null);
  const [montoContado, setMontoContado] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // ── Cargar sesión ────────────────────────────────────────────
  useEffect(() => {
    if (!sesionId) return;
    let mounted = true;

    const load = async () => {
      const data = await fetchDetalleCompleto(sesionId);
      if (data && mounted) {
        if (data.estado !== "ABIERTA") {
          showAlert("Sesión cerrada", "warning", {
            description: "Esta sesión ya fue cerrada.",
          });
          navigate(`/caja/sesion/${sesionId}`);
          return;
        }
        setSesion(data);
      }
    };

    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesionId]);

  // ── Cálculos derivados ──────────────────────────────────────
  const resumen = useMemo(() => {
    if (!sesion) return null;
    return CajaService.generarResumen(sesion);
  }, [sesion]);

  const montoContadoNum = parseFloat(montoContado) || 0;
  const saldoEsperado = resumen?.saldoEsperado ?? 0;
  const diferencia = CajaService.calcularDiferencia(montoContadoNum, saldoEsperado);
  const clasificacion = CajaService.clasificarDiferencia(diferencia);

  const analisis = useMemo(() => {
    if (!montoContado || montoContadoNum === 0) return null;
    return CajaService.analizarDiscrepancia(diferencia, saldoEsperado);
  }, [montoContado, montoContadoNum, diferencia, saldoEsperado]);

  // ── Submit ───────────────────────────────────────────────────
  const handleCerrar = async () => {
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
            description: "Esta sesión de caja ya fue cerrada por otra persona o pestaña.",
          });
          clearSesion();
          navigate("/caja/lista");
          return;
        }
        sesionParaValidar = sesionActualizada;
      } else {
        showAlert("Conexión demorada", "info", {
          description: "La verificación JIT está tardando. Procediendo con el cierre de caja...",
        });
      }

      const validacion = CajaService.validarCierre(sesionParaValidar, montoContadoNum);
      if (!validacion.valido) {
        showAlert("Validación", "warning", {
          description: validacion.errores.join(". "),
        });
        return;
      }

      const confirmMsg =
        clasificacion === "EXACTO"
          ? "El arqueo coincide. ¿Confirmas el cierre de caja?"
          : `Hay una diferencia de ${formatCurrency(Math.abs(diferencia))} (${clasificacion}). ¿Confirmas el cierre de caja?`;

      const ok = await confirm("Confirmar Cierre de Caja", confirmMsg, "warning");
      if (!ok) return;

      const exito = await cerrarCaja(sesionId, {
        monto_contado: montoContadoNum,
        observaciones: observaciones.trim(),
      });

      if (exito) {
        clearSesion();
        showAlert("Caja cerrada", "success", {
          description: "La sesión de caja ha sido cerrada exitosamente.",
        });
        navigate("/caja/lista");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Loading ─────────────────────────────────────────────────
  if (loadingDetalle || !sesion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <PageContainer maxWidth="md">
      <PageHeader
        title="Cierre de Caja"
        subtitle={`${sesion.caja_nombre ?? "Caja"} — Sesión #${sesion.id}`}
        icon={<IconLock size={24} />}
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

      {/* Resumen de la sesión */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard label="Saldo Inicial" value={formatCurrency(resumen?.montoInicial ?? 0)} color="blue" />
        <SummaryCard label="Ingresos" value={formatCurrency(resumen?.totalIngresos ?? 0)} color="emerald" />
        <SummaryCard label="Egresos" value={formatCurrency(resumen?.totalEgresos ?? 0)} color="rose" />
        <SummaryCard label="Saldo Esperado" value={formatCurrency(saldoEsperado)} color="indigo" highlighted />
      </div>

      {/* Formulario de cierre */}
      <Card className="shadow-lg border-primary-100">
        <Card.Header>
          <Card.Title>Datos de Cierre</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-6">
          {/* Monto contado */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-primary-700">
              Monto Contado (Efectivo Físico) <span className="text-danger-500">*</span>
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
              Ingrese el total de dinero contado físicamente en caja.
            </p>
          </div>

          {/* Diferencia dinámica */}
          {montoContado && (
            <div
              className={`p-4 rounded-xl border-2 transition-all ${
                clasificacion === "EXACTO"
                  ? "bg-emerald-50 border-emerald-200"
                  : clasificacion === "SOBRANTE"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-rose-50 border-rose-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold uppercase tracking-wider opacity-70">
                  Diferencia
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

              {/* Análisis de discrepancia */}
              {analisis && clasificacion !== "EXACTO" && (
                <div className="mt-3 pt-3 border-t border-current/10 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <IconAlertTriangle size={14} className="opacity-60" />
                    <span className="text-xs font-bold uppercase">
                      Severidad: {analisis.severidad}
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
              Observaciones de Cierre (Opcional)
            </label>
            <textarea
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Notas sobre el cierre de caja..."
              className="
                block w-full px-4 py-2.5 
                border border-primary-300 rounded-button 
                text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all
              "
              maxLength={500}
            />
          </div>
        </Card.Content>

        <Card.Footer className="flex flex-col sm:flex-row justify-end gap-3 p-6 bg-primary-50/50">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => navigate(-1)}
            disabled={loadingCerrar}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            className="w-full sm:w-auto shadow-lg shadow-rose-200"
            onClick={handleCerrar}
            disabled={loadingCerrar || isVerifying || !montoContado}
            isLoading={loadingCerrar || isVerifying}
          >
            <IconLock size={18} />
            {loadingCerrar || isVerifying ? "Cerrando..." : "Cerrar Caja"}
          </Button>
        </Card.Footer>
      </Card>
    </PageContainer>
  );
}

// ── Sub-componente: Summary Card ────────────────────────────
function SummaryCard({
  label,
  value,
  color,
  highlighted,
}: {
  label: string;
  value: string;
  color: string;
  highlighted?: boolean;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    rose: "bg-rose-50 border-rose-100 text-rose-700",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
  };

  return (
    <div className={`${colorMap[color]} border rounded-xl p-4 shadow-sm`}>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{label}</p>
      <p className={`text-lg font-black tabular-nums mt-1 ${highlighted ? "scale-105 origin-left" : ""}`}>
        {value}
      </p>
    </div>
  );
}
