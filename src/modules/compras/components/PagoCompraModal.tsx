import React, { useState } from 'react';
import { Button } from "@/shared/components/ui";
import { formatCurrency, formatNumberInput, parseNumberInput, formatNumber } from "@/shared/utils/formatters";
import type { MetodoPago } from "../types/compra.types";
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

interface PagoCompraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (metodo: MetodoPago, monto: number, referencia: string) => void;
    total: number;
    saldoPendiente?: number; 
    submitting?: boolean;
    isCajaAbierta?: boolean;
}

export function PagoCompraModal({ isOpen, onClose, onConfirm, total, saldoPendiente, submitting = false, isCajaAbierta = true }: PagoCompraModalProps) {
    const [metodo, setMetodo] = useState<MetodoPago>("EFECTIVO");
    const [montoPagarTexto, setMontoPagarTexto] = useState<string>("");
    const [montoPagar, setMontoPagar] = useState<number>(0);
    const [referencia, setReferencia] = useState<string>("");

    const maxPagar = saldoPendiente !== undefined ? saldoPendiente : total;

    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

    if (isOpen && !prevIsOpen) {
        setPrevIsOpen(true);
        setMetodo("EFECTIVO");
        setMontoPagar(maxPagar);
        setMontoPagarTexto(formatNumber(maxPagar));
        setReferencia("");
    } else if (!isOpen && prevIsOpen) {
        setPrevIsOpen(false);
    }

    if (!isOpen) return null;

    const montoPagarValido = montoPagar > 0 && montoPagar <= maxPagar;
    const esValido = montoPagarValido;

    const handleMontoPagarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const formatted = formatNumberInput(val);
        setMontoPagarTexto(formatted);

        const raw = parseNumberInput(formatted);
        const numeric = parseFloat(raw);
        setMontoPagar(isNaN(numeric) ? 0 : numeric);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Registrar Pago a Proveedor</h2>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Módulo de Compras</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                    >
                        <IconX size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Alerta de Caja Cerrada */}
                    {!isCajaAbierta && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative flex items-center gap-3">
                            <IconX className="w-6 h-6 shrink-0" />
                            <div className="flex-1">
                                <strong className="block font-bold">Caja Cerrada</strong>
                                <span className="block sm:inline text-sm">Debe abrir una sesión de caja antes de registrar un pago.</span>
                            </div>
                        </div>
                    )}

                    {/* Saldo a Pagar Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 shadow-lg shadow-purple-200">
                        <div className="absolute -right-4 -top-4 text-white/10 rotate-12">
                            <IconCash size={120} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-purple-100 uppercase tracking-widest mb-1 opacity-80">
                                Total Deuda
                            </p>
                            <p className="text-4xl font-black text-white">
                                {formatCurrency(maxPagar)}
                            </p>
                        </div>
                    </div>

                    {/* Selector de Método de Pago */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-1 bg-purple-500 rounded-full"></div>
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Método de Pago</label>
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
                                            ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md transform scale-102'
                                            : 'border-gray-100 bg-white text-gray-400 hover:border-purple-200 hover:bg-gray-50 hover:text-gray-600'
                                        }`}
                                >
                                    <div className={`mb-2 p-2 rounded-xl transition-colors ${metodo === m.value ? 'bg-purple-100' : 'bg-gray-50 group-hover:bg-purple-50'}`}>
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
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
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
                                        ${montoPagar > maxPagar || montoPagar <= 0
                                            ? 'border-red-400 bg-red-50 text-red-700'
                                            : 'border-gray-100 bg-gray-50 focus:border-purple-500 focus:bg-white text-gray-800'
                                        }`}
                                />
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                                    $
                                </div>
                            </div>
                            {montoPagar > maxPagar && (
                                <p className="text-xs text-red-500 font-bold ml-1">Excede el saldo pendiente ({formatCurrency(maxPagar)})</p>
                            )}
                        </div>

                        {/* Referencia */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Referencia (Opcional)</label>
                            <input
                                type="text"
                                value={referencia}
                                onChange={(e) => setReferencia(e.target.value)}
                                placeholder="Ej: Factura 001-232, Transferencia 987654"
                                disabled={submitting}
                                className="w-full px-4 py-3 border-2 border-gray-100 bg-gray-50 rounded-xl focus:border-purple-500 focus:bg-white transition-all outline-none text-gray-800"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-white border-t border-gray-100 flex flex-col sm:flex-row gap-3 shrink-0">
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
                            ${(esValido && isCajaAbierta) ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'bg-gray-200'}`}
                        onClick={() => onConfirm(metodo, montoPagar, referencia)}
                        disabled={!esValido || submitting || !isCajaAbierta}
                        isLoading={submitting}
                    >
                        <div className="flex items-center justify-center gap-2">
                            {esValido && !submitting && <IconCheck size={18} />}
                            Registrar Pago
                        </div>
                    </Button>
                </div>

            </div>
        </div>
    );
}
