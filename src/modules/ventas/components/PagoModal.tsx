import React, { useState } from 'react';
import { Button } from "@shared/components/ui";
import { Modal } from "@shared/components/Modal";
import { formatCurrency, formatNumberInput, parseNumberInput, formatNumber } from "@shared/utils/formatters";
import type { MetodoPago } from "@modules/ventas/types/venta.types";
import {
    IconCash,
    IconCreditCard,
    IconBuildingBank,
    IconDeviceMobile,
    IconBook,
    IconX,
    IconCurrencyDollar,
    IconCheck
} from '@tabler/icons-react';

interface PagoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (metodo: MetodoPago, monto: number, montoRecibido: number, vuelto: number) => void;
    total: number;
    saldoPendiente?: number; // Para pagos parciales
    submitting?: boolean;
    isCajaAbierta?: boolean;
}

export function PagoModal({ isOpen, onClose, onConfirm, total, saldoPendiente, submitting = false, isCajaAbierta = true }: PagoModalProps) {
    const [metodo, setMetodo] = useState<MetodoPago>("EFECTIVO");
    const [montoPagarTexto, setMontoPagarTexto] = useState<string>("");
    const [montoPagar, setMontoPagar] = useState<number>(0);
    const [formatoMonto, setFormatoMonto] = useState<string>("");
    const [montoNumerico, setMontoNumerico] = useState<number>(0);

    const maxPagar = saldoPendiente !== undefined ? saldoPendiente : total;

    // Reseteamos formulario cuando se cierra/abre (evitando setState in effect)
    // Se recomienda usar la prop key={id} en el componente padre para resetear estado si es complejo,
    // pero para este modal simple reseteamos en el useEffect con cuidado o al cerrar.

    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

    // Resetear formulario cuando se abre (evitando useEffect síncrono para mejor rendimiento y cumplir con ESLint)
    if (isOpen && !prevIsOpen) {
        setPrevIsOpen(true);
        setMetodo("EFECTIVO");
        setMontoPagar(maxPagar);
        setMontoPagarTexto(formatNumber(maxPagar));
        setMontoNumerico(0);
        setFormatoMonto("");
    } else if (!isOpen && prevIsOpen) {
        setPrevIsOpen(false);
    }

    if (!isOpen) return null;

    const esEfectivo = metodo === "EFECTIVO";
    const esCredito = metodo === "CREDITO";

    // Vuelto (Solo aplica si es efectivo y el cliente da más para cubrir su pago parcial/total)
    const vuelto = esEfectivo && montoNumerico > montoPagar ? montoNumerico - montoPagar : 0;

    // Validaciones
    const montoPagarValido = montoPagar > 0 && montoPagar <= maxPagar;
    const montoRecibidoValido = esEfectivo ? montoNumerico >= montoPagar : true;
    const esValido = montoPagarValido && montoRecibidoValido && (!esCredito || montoPagar > 0);

    const handleMontoPagarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const formatted = formatNumberInput(val);
        setMontoPagarTexto(formatted);

        const raw = parseNumberInput(formatted);
        const numeric = parseFloat(raw);
        setMontoPagar(isNaN(numeric) ? 0 : numeric);
    };

    const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const formatted = formatNumberInput(val);
        setFormatoMonto(formatted);

        const raw = parseNumberInput(formatted);
        const numeric = parseFloat(raw);
        setMontoNumerico(isNaN(numeric) ? 0 : numeric);
    };

    const setDineroRapido = (cantidad: number) => {
        const formatted = formatNumberInput(cantidad.toString());
        setFormatoMonto(formatted);
        setMontoNumerico(cantidad);
    };

    const metodosDisponibles: { value: MetodoPago; label: string; icon: React.ReactNode }[] = [
        { value: "EFECTIVO", label: "Efectivo", icon: <IconCash size={24} /> },
        { value: "TARJETA", label: "Tarjeta", icon: <IconCreditCard size={24} /> },
        { value: "TRANSFERENCIA", label: "Transfer.", icon: <IconBuildingBank size={24} /> },
        { value: "YAPE", label: "Yape", icon: <IconDeviceMobile size={24} /> },
        { value: "PLIN", label: "Plin", icon: <IconDeviceMobile size={24} /> },
        { value: "CREDITO", label: "Crédito", icon: <IconBook size={24} /> },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Procesar Pago">
            <div className="space-y-8 flex-1">
                    {/* Alerta de Caja Cerrada */}
                    {!isCajaAbierta && (
                        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-xl relative flex items-center gap-3">
                            <IconX className="w-6 h-6 shrink-0" />
                            <div className="flex-1">
                                <strong className="block font-bold">Caja Cerrada</strong>
                                <span className="block sm:inline text-sm">Debe abrir una sesión de caja antes de registrar el pago.</span>
                            </div>
                        </div>
                    )}

                    {/* Saldo a Pagar Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-accent-600 to-accent-700 rounded-2xl p-6 shadow-lg shadow-accent-200">
                        <div className="absolute -right-4 -top-4 text-white/10 rotate-12">
                            <IconCash size={120} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-accent-100 uppercase tracking-widest mb-1 opacity-80">
                                Total a Pagar
                            </p>
                            <p className="text-4xl font-black text-white">
                                {formatCurrency(maxPagar)}
                            </p>
                        </div>
                    </div>

                    {/* Selector de Método de Pago */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-1 bg-accent-500 rounded-full"></div>
                            <label className="text-sm font-bold text-primary-700 uppercase tracking-wider">Método de Pago</label>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {metodosDisponibles.map((m) => (
                                <button
                                    key={m.value}
                                    type="button"
                                    onClick={() => setMetodo(m.value)}
                                    disabled={submitting}
                                    className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200
                                        ${metodo === m.value
                                            ? 'border-accent-500 bg-accent-50 text-accent-700 shadow-md transform scale-102'
                                            : 'border-primary-100 bg-white text-primary-400 hover:border-accent-200 hover:bg-primary-50 hover:text-primary-600'
                                        }`}
                                >
                                    <div className={`mb-2 p-2 rounded-xl transition-colors ${metodo === m.value ? 'bg-accent-100' : 'bg-primary-50 group-hover:bg-accent-50'}`}>
                                        {m.icon}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-tight">{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Monto a Pagar AHORA */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-primary-700 uppercase tracking-wider flex items-center gap-2">
                                <IconCurrencyDollar size={16} />
                                Monto a abonar
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={montoPagarTexto}
                                    onChange={handleMontoPagarChange}
                                    placeholder="0.00"
                                    disabled={submitting}
                                    className={`w-full px-5 py-4 text-2xl font-bold text-right border-2 rounded-2xl focus:ring-0 transition-all outline-none
                                        ${montoPagar > maxPagar
                                            ? 'border-danger-400 bg-danger-50 text-danger-700'
                                            : 'border-primary-100 bg-primary-50 focus:border-accent-500 focus:bg-white text-primary-800'
                                        }`}
                                />
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-400 font-bold text-lg">
                                    $
                                </div>
                            </div>
                            {montoPagar > maxPagar && (
                                <p className="text-xs text-danger-500 font-bold ml-1">Excede el saldo pendiente</p>
                            )}
                        </div>

                        {/* Calculadora de Vuelto (Solo Efectivo) */}
                        {esEfectivo && (
                            <div className="space-y-4 pt-2 animate-in slide-in-from-top-4 duration-300">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-primary-700 uppercase tracking-wider">Monto Recibido</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formatoMonto}
                                            onChange={handleMontoChange}
                                            placeholder="0.00"
                                            disabled={submitting}
                                            className="w-full px-5 py-4 text-2xl font-bold text-right border-2 border-primary-100 bg-primary-50 rounded-2xl focus:ring-0 focus:border-accent-500 focus:bg-white transition-all outline-none"
                                        />
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-400 font-bold text-lg">
                                            $
                                        </div>
                                    </div>
                                </div>

                                {/* Botones rápidos */}
                                <div className="flex flex-wrap gap-2 justify-end">
                                    {[10, 20, 50, 100].map(val => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => setDineroRapido(val)}
                                            disabled={submitting}
                                            className="px-4 py-2 text-xs font-bold text-primary-600 bg-primary-100 rounded-xl hover:bg-accent-500 hover:text-white transition-all transform active:scale-95"
                                        >
                                            ${val}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setDineroRapido(montoPagar)}
                                        disabled={submitting || !montoPagarValido}
                                        className="px-4 py-2 text-xs font-bold text-accent-600 bg-accent-100 rounded-xl hover:bg-accent-600 hover:text-white transition-all transform active:scale-95"
                                    >
                                        EXACTO
                                    </button>
                                </div>

                                {/* Resultado del Vuelto */}
                                <div className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all duration-300
                                    ${montoNumerico > 0 && montoRecibidoValido
                                        ? 'bg-success-50 border-success-100 shadow-sm'
                                        : montoNumerico > 0 && !montoRecibidoValido
                                            ? 'bg-danger-50 border-danger-100'
                                            : 'bg-primary-50 border-primary-100 opacity-60'}`}
                                >
                                    <div className="flex flex-col">
                                        <span className={`text-xs uppercase font-black ${montoNumerico > 0 && !montoRecibidoValido ? 'text-danger-400' : 'text-success-500'}`}>
                                            Cambio / Vuelto
                                        </span>
                                        <span className="text-primary-600 font-bold">A entregar</span>
                                    </div>
                                    <span className={`text-3xl font-black ${montoNumerico > 0 && !montoRecibidoValido ? 'text-danger-600' : 'text-success-600'}`}>
                                        {montoNumerico > 0 && montoRecibidoValido ? formatCurrency(vuelto) : formatCurrency(0)}
                                    </span>
                                </div>

                                {montoNumerico > 0 && !montoRecibidoValido && (
                                    <p className="text-xs text-danger-500 text-center font-bold animate-pulse">
                                        El pago es insuficiente para cubrir los {formatCurrency(montoPagar)}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 pt-5 border-t border-primary-100 flex flex-col sm:flex-row gap-3 shrink-0">
                <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs h-auto"
                    onClick={onClose}
                    disabled={submitting}
                >
                    Cancelar
                </Button>
                <Button
                    type="button"
                    className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs h-auto shadow-lg transition-all
                        ${(esValido && isCajaAbierta) ? 'bg-accent-600 hover:bg-accent-700 shadow-accent-200' : 'bg-primary-200'}`}
                    onClick={() => onConfirm(metodo, montoPagar, esEfectivo ? montoNumerico : montoPagar, esEfectivo ? vuelto : 0)}
                    disabled={!esValido || submitting || !isCajaAbierta}
                    isLoading={submitting}
                >
                    <div className="flex items-center justify-center gap-2">
                        {esValido && !submitting && <IconCheck size={18} />}
                        Confirmar Pago
                    </div>
                </Button>
            </div>
        </Modal>
    );
}
