import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/shared/components/ui";
import { formatCurrency, formatNumberInput, parseNumberInput, formatNumber } from "@/shared/utils/formatters";
import type { MetodoPago } from "@/modules/caja/types/Caja.types";
import { metodosPagoAPI } from "@/modules/caja/api/Caja.api";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import {
    IconCash, IconCreditCard, IconBuildingBank,
    IconDeviceMobile, IconBook, IconX,
    IconCurrencyDollar, IconCheck, IconAlertTriangle,
    IconInfoCircle, IconLoader2,
} from '@tabler/icons-react';

interface PagoCompraModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** onConfirm recibe el NOMBRE del método (para el backend) */
    onConfirm: (metodoPagoNombre: string, monto: number, referencia: string) => void;
    total: number;
    saldoPendiente?: number;
    submitting?: boolean;
}

// Mapa de iconos por nombre de método
const ICONO_METODO: Record<string, React.ReactNode> = {
    EFECTIVO:      <IconCash size={22} />,
    TARJETA:       <IconCreditCard size={22} />,
    TRANSFERENCIA: <IconBuildingBank size={22} />,
    YAPE:          <IconDeviceMobile size={22} />,
    PLIN:          <IconDeviceMobile size={22} />,
    'CRÉDITO':     <IconBook size={22} />,
};

export function PagoCompraModal({
    isOpen,
    onClose,
    onConfirm,
    total,
    saldoPendiente,
    submitting = false,
}: PagoCompraModalProps) {
    const { sesionActiva } = useCajaStore();

    // Estado del modal
    const [metodos, setMetodos]           = useState<MetodoPago[]>([]);
    const [loadingMetodos, setLoadingMetodos] = useState(false);
    const [metodoSeleccionado, setMetodoSeleccionado] = useState<MetodoPago | null>(null);
    const [montoPagarTexto, setMontoPagarTexto] = useState('');
    const [montoPagar, setMontoPagar]     = useState(0);
    const [referencia, setReferencia]     = useState('');

    const maxPagar = saldoPendiente !== undefined ? saldoPendiente : total;

    // Cargar métodos de pago cuando se abre el modal
    useEffect(() => {
        if (!isOpen) return;

        let active = true;

        // Utilizamos setTimeout para diferir la actualización de estado a la macro-tarea (macro-task)
        // en lugar de hacerlo síncronamente en el effect, evitando rendered en cascada. (Fix react-hooks/set-state-in-effect)
        const init = setTimeout(() => {
            if (!active) return;
            
            setLoadingMetodos(true);
            setMontoPagarTexto(formatNumber(maxPagar));
            setMontoPagar(maxPagar);
            setReferencia('');

            metodosPagoAPI.getMetodosPago()
                .then((lista) => {
                    if (!active) return;
                    setMetodos(lista);
                    const defaultMetodo =
                        lista.find(m => m.nombre === 'EFECTIVO') ||
                        lista.find(m => m.tipo === 'CONTADO') ||
                        lista[0];
                    if (defaultMetodo) setMetodoSeleccionado(defaultMetodo);
                })
                .catch(() => {
                    if (active) setMetodos([]);
                })
                .finally(() => {
                    if (active) setLoadingMetodos(false);
                });
        }, 0);

        return () => {
            active = false;
            clearTimeout(init);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]); 

    // ── Derivados ────────────────────────────────────────────
    const esCredito = metodoSeleccionado?.tipo === 'CREDITO';
    const esContado = metodoSeleccionado?.tipo === 'CONTADO';
    const isCajaAbierta = !!sesionActiva;

    // Saldo de caja del store (actualizado en la última hidratación)
    const saldoCaja = sesionActiva?.saldo_esperado
        ? parseFloat(String(sesionActiva.saldo_esperado))
        : 0;

    // Validaciones
    const montoPagarValido = montoPagar > 0 && montoPagar <= maxPagar;
    const fondosInsuficientes = esContado && montoPagar > saldoCaja;
    const requiereCajaAbierta = esContado && !isCajaAbierta;

    const puedeConfirmar =
        montoPagarValido &&
        !!metodoSeleccionado &&
        !fondosInsuficientes &&
        !requiereCajaAbierta;

    // Mensaje informativo según tipo
    const mensajeTipo = useMemo(() => {
        if (!metodoSeleccionado) return null;
        if (esCredito) return {
            tipo: 'info' as const,
            texto: 'Esta compra se registrará como crédito. Se creará una Cuenta por Pagar al proveedor. No afecta la caja.',
        };
        if (esContado && isCajaAbierta) return {
            tipo: 'success' as const,
            texto: `Se descontará ${formatCurrency(montoPagar)} de la caja. Saldo disponible: ${formatCurrency(saldoCaja)}.`,
        };
        return null;
    }, [metodoSeleccionado, esCredito, esContado, isCajaAbierta, montoPagar, saldoCaja]);

    // ── Handlers ─────────────────────────────────────────────
    const handleMontoPagarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumberInput(e.target.value);
        setMontoPagarTexto(formatted);
        const raw = parseNumberInput(formatted);
        setMontoPagar(isNaN(parseFloat(raw)) ? 0 : parseFloat(raw));
    };

    const handleConfirmar = () => {
        if (!puedeConfirmar || !metodoSeleccionado) return;
        onConfirm(metodoSeleccionado.nombre, montoPagar, referencia);
    };

    // Agrupar métodos por tipo para mostrar separados
    const metodosContado = metodos.filter(m => m.tipo === 'CONTADO');
    const metodosCredito = metodos.filter(m => m.tipo === 'CREDITO');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">

                {/* ── Header ── */}
                <div className="px-6 py-4 bg-gradient-to-r from-primary-50 to-white border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-primary-800">Registrar Pago</h2>
                        <p className="text-xs text-primary-400 font-medium mt-0.5">Compra al proveedor</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="p-2 rounded-full hover:bg-primary-100 text-primary-400 transition-colors"
                    >
                        <IconX size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto flex-1">

                    {/* ── Alerta: caja cerrada (solo para CONTADO) ── */}
                    {requiereCajaAbierta && (
                        <div className="bg-danger-50 border border-danger-200 rounded-xl p-3 flex items-start gap-3">
                            <IconAlertTriangle size={18} className="text-danger-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-danger-700 font-medium">
                                Caja cerrada. Para pagos en efectivo/tarjeta debes abrir una sesión de caja.
                                O selecciona <strong>Crédito</strong> para diferir el pago.
                            </p>
                        </div>
                    )}

                    {/* ── Fondos insuficientes ── */}
                    {fondosInsuficientes && !requiereCajaAbierta && (
                        <div className="bg-warning-50 border border-warning-200 rounded-xl p-3 flex items-start gap-3">
                            <IconAlertTriangle size={18} className="text-warning-500 shrink-0 mt-0.5" />
                            <div className="text-sm text-warning-700">
                                <p className="font-bold">Fondos insuficientes en caja</p>
                                <p>Saldo disponible: <strong>{formatCurrency(saldoCaja)}</strong></p>
                                <p className="mt-1 opacity-80">
                                    Reduce el monto o usa <strong>Crédito</strong> para diferir el pago.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Card total deuda ── */}
                    <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-2xl p-5 text-white">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">
                            Saldo Pendiente
                        </p>
                        <p className="text-3xl font-black tabular-nums">
                            {formatCurrency(maxPagar)}
                        </p>
                    </div>

                    {/* ── Selector de método ── */}
                    {loadingMetodos ? (
                        <div className="flex items-center justify-center py-6 gap-2 text-primary-400">
                            <IconLoader2 size={20} className="animate-spin" />
                            <span className="text-sm">Cargando métodos de pago...</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* CONTADO */}
                            {metodosContado.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-success-400 inline-block"></span>
                                        Pago inmediato (Contado)
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {metodosContado.map((m) => (
                                            <MetodoBtn
                                                key={m.id}
                                                metodo={m}
                                                seleccionado={metodoSeleccionado?.id === m.id}
                                                onSelect={setMetodoSeleccionado}
                                                icon={ICONO_METODO[m.nombre] ?? <IconCash size={22} />}
                                                disabled={submitting}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CRÉDITO */}
                            {metodosCredito.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-400 inline-block"></span>
                                        Pago diferido (Crédito)
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {metodosCredito.map((m) => (
                                            <MetodoBtn
                                                key={m.id}
                                                metodo={m}
                                                seleccionado={metodoSeleccionado?.id === m.id}
                                                onSelect={setMetodoSeleccionado}
                                                icon={ICONO_METODO[m.nombre] ?? <IconBook size={22} />}
                                                disabled={submitting}
                                                variant="blue"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Mensaje informativo por tipo ── */}
                    {mensajeTipo && (
                        <div className={`rounded-xl p-3 flex items-start gap-2.5 text-sm font-medium
                            ${mensajeTipo.tipo === 'info'
                                ? 'bg-accent-50 border border-accent-100 text-accent-700'
                                : 'bg-success-50 border border-success-100 text-success-700'
                            }`}
                        >
                            <IconInfoCircle size={16} className="shrink-0 mt-0.5" />
                            <p>{mensajeTipo.texto}</p>
                        </div>
                    )}

                    {/* ── Monto ── */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary-700 flex items-center gap-1.5">
                            <IconCurrencyDollar size={16} />
                            Monto a {esCredito ? 'registrar como crédito' : 'abonar'}
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 font-bold text-lg pointer-events-none">
                                $
                            </span>
                            <input
                                type="text"
                                value={montoPagarTexto}
                                onChange={handleMontoPagarChange}
                                disabled={submitting}
                                className={`w-full pl-8 pr-4 py-4 text-2xl font-bold text-right border-2 rounded-2xl outline-none transition-colors
                                    ${(montoPagar > maxPagar || montoPagar <= 0)
                                        ? 'border-danger-300 bg-danger-50 text-danger-700'
                                        : fondosInsuficientes
                                            ? 'border-warning-300 bg-warning-50 text-warning-700'
                                            : 'border-primary-100 bg-primary-50 focus:border-primary-400 text-primary-800'
                                    }`}
                            />
                        </div>
                        {montoPagar > maxPagar && (
                            <p className="text-xs text-danger-500 font-bold">
                                Excede el saldo pendiente ({formatCurrency(maxPagar)})
                            </p>
                        )}
                    </div>

                    {/* ── Referencia ── */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary-700">
                            Referencia <span className="text-primary-400 font-normal">(opcional)</span>
                        </label>
                        <input
                            type="text"
                            value={referencia}
                            onChange={(e) => setReferencia(e.target.value)}
                            placeholder="Ej: Factura 001-232, Transferencia #987654"
                            disabled={submitting}
                            className="w-full px-4 py-3 border-2 border-primary-100 bg-primary-50 rounded-xl focus:border-primary-300 transition-colors outline-none text-primary-800 text-sm"
                        />
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="p-5 border-t bg-primary-50 flex gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        className="flex-1 rounded-2xl"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        className={`flex-1 rounded-2xl font-bold transition-all
                            ${esCredito
                                ? 'bg-accent-600 hover:bg-accent-700 shadow-accent-100'
                                : 'bg-primary-800 hover:bg-primary-900 shadow-primary-100'
                            } shadow-lg`}
                        onClick={handleConfirmar}
                        disabled={!puedeConfirmar || submitting}
                        isLoading={submitting}
                    >
                        {!submitting && <IconCheck size={16} className="mr-1" />}
                        {esCredito ? 'Registrar como Crédito' : 'Confirmar Pago'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ── Sub-componente: Botón de método ─────────────────────────
interface MetodoBtnProps {
    metodo: MetodoPago;
    seleccionado: boolean;
    onSelect: (m: MetodoPago) => void;
    icon: React.ReactNode;
    disabled: boolean;
    variant?: 'green' | 'blue';
}

function MetodoBtn({ metodo, seleccionado, onSelect, icon, disabled, variant = 'green' }: MetodoBtnProps) {
    const selectedCls = variant === 'blue'
        ? 'border-accent-500 bg-accent-50 text-accent-700'
        : 'border-primary-700 bg-primary-50 text-primary-800';
    const hoverCls = variant === 'blue'
        ? 'hover:border-accent-200 hover:bg-accent-50/50'
        : 'hover:border-primary-300 hover:bg-primary-50';

    return (
        <button
            type="button"
            onClick={() => onSelect(metodo)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center
                ${seleccionado ? selectedCls : `border-primary-100 bg-white text-primary-400 ${hoverCls}`}`}
        >
            <div className={`p-1.5 rounded-lg ${seleccionado ? 'bg-white shadow-sm' : 'bg-primary-50'}`}>
                {icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight leading-tight">
                {metodo.nombre}
            </span>
        </button>
    );
}
