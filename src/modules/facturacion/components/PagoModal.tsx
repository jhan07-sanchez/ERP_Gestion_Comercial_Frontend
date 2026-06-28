import React from 'react';
import { Button } from "@shared/components/ui";
import { Modal } from "@shared/components/Modal";
import { formatCurrency, formatNumberInput, parseNumberInput } from "@shared/utils/formatters";
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
import { usePagoModal } from '../hooks/usePagoModal';

interface PagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (metodo: string, monto: number, montoRecibido: number, vuelto: number) => void;
  total: number;
  saldoPendiente?: number;
  submitting?: boolean;
  isCajaAbierta?: boolean;
}

export function PagoModal({ isOpen, onClose, onConfirm, total, saldoPendiente, submitting = false, isCajaAbierta = true }: PagoModalProps) {
  
  const {
    metodo,
    setMetodo,
    montoPagar,
    setMontoPagar,
    montoRecibido,
    setMontoRecibido,
    maxPagar,
    esEfectivo,
    vuelto,
    montoPagarValido,
    montoRecibidoValido,
    esValido
  } = usePagoModal(total, saldoPendiente);

  if (!isOpen) return null;

  const handleMontoPagarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const formatted = formatNumberInput(val);
    const raw = parseNumberInput(formatted);
    const numeric = parseFloat(raw);
    setMontoPagar(isNaN(numeric) ? 0 : numeric);
  };

  const handleMontoRecibidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const formatted = formatNumberInput(val);
    const raw = parseNumberInput(formatted);
    const numeric = parseFloat(raw);
    setMontoRecibido(isNaN(numeric) ? 0 : numeric);
  };

  const metodosDisponibles: { value: string; label: string; icon: React.ReactNode }[] = [
    { value: "EFECTIVO", label: "Efectivo", icon: <IconCash size={24} /> },
    { value: "TARJETA", label: "Tarjeta", icon: <IconCreditCard size={24} /> },
    { value: "TRANSFERENCIA", label: "Transfer.", icon: <IconBuildingBank size={24} /> },
    { value: "YAPE", label: "Yape", icon: <IconDeviceMobile size={24} /> },
    { value: "PLIN", label: "Plin", icon: <IconDeviceMobile size={24} /> },
    { value: "CREDITO", label: "Crédito", icon: <IconBook size={24} /> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Procesar Pago de Factura">
      <div className="space-y-8 flex-1">
        {!isCajaAbierta && (
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-xl relative flex items-center gap-3">
            <IconX className="w-6 h-6 shrink-0" />
            <div className="flex-1">
              <strong className="block font-bold">Caja Cerrada</strong>
              <span className="block sm:inline text-sm">Debe abrir una sesión de caja antes de registrar el pago.</span>
            </div>
          </div>
        )}

        <div className="relative overflow-hidden bg-gradient-to-br from-accent-600 to-accent-700 rounded-2xl p-6 shadow-lg shadow-accent-200">
          <div className="absolute -right-4 -top-4 text-white/10 rotate-12">
            <IconCash size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-accent-100 uppercase tracking-widest mb-1 opacity-80">Total a Pagar</p>
            <p className="text-4xl font-black text-white">{formatCurrency(maxPagar)}</p>
          </div>
        </div>

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
                className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${metodo === m.value ? 'border-accent-500 bg-accent-50 text-accent-700 shadow-md transform scale-102' : 'border-primary-100 bg-white text-primary-400 hover:border-accent-200 hover:bg-primary-50 hover:text-primary-600'}`}
              >
                <div className={`mb-2 p-2 rounded-xl transition-colors ${metodo === m.value ? 'bg-accent-100' : 'bg-primary-50 group-hover:bg-accent-50'}`}>{m.icon}</div>
                <span className="text-xs font-bold uppercase tracking-tight">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-primary-700 uppercase tracking-wider flex items-center gap-2"><IconCurrencyDollar size={16} />Monto a abonar</label>
            <div className="relative group">
              <input
                type="number"
                value={montoPagar || ""}
                onChange={handleMontoPagarChange}
                placeholder="0.00"
                disabled={submitting}
                className={`w-full px-5 py-4 text-2xl font-bold text-right border-2 rounded-2xl focus:ring-0 transition-all outline-none ${!montoPagarValido ? 'border-danger-400 bg-danger-50 text-danger-700' : 'border-primary-100 bg-primary-50 focus:border-accent-500 focus:bg-white text-primary-800'}`}
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-400 font-bold text-lg">$</div>
            </div>
            {!montoPagarValido && <p className="text-xs text-danger-500 font-bold ml-1">Excede el saldo pendiente o es inválido</p>}
          </div>

          {esEfectivo && (
            <div className="space-y-4 pt-2 animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-3">
                <label className="text-sm font-bold text-primary-700 uppercase tracking-wider">Monto Recibido</label>
                <div className="relative">
                  <input
                    type="number"
                    value={montoRecibido || ""}
                    onChange={handleMontoRecibidoChange}
                    placeholder="0.00"
                    disabled={submitting}
                    className="w-full px-5 py-4 text-2xl font-bold text-right border-2 border-primary-100 bg-primary-50 rounded-2xl focus:ring-0 focus:border-accent-500 focus:bg-white transition-all outline-none"
                  />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-400 font-bold text-lg">$</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                {[10, 20, 50, 100].map(val => (
                  <button key={val} type="button" onClick={() => setMontoRecibido(val)} disabled={submitting} className="px-4 py-2 text-xs font-bold text-primary-600 bg-primary-100 rounded-xl hover:bg-accent-500 hover:text-white transition-all transform active:scale-95">${val}</button>
                ))}
                <button type="button" onClick={() => setMontoRecibido(montoPagar)} disabled={submitting || !montoPagarValido} className="px-4 py-2 text-xs font-bold text-accent-600 bg-accent-100 rounded-xl hover:bg-accent-600 hover:text-white transition-all transform active:scale-95">EXACTO</button>
              </div>

              <div className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 ${montoRecibido > 0 && montoRecibidoValido ? 'bg-success-50 border-success-100 shadow-sm' : montoRecibido > 0 && !montoRecibidoValido ? 'bg-danger-50 border-danger-100' : 'bg-primary-50 border-primary-100 opacity-60'}`}>
                <div className="flex flex-col">
                  <span className={`text-xs uppercase font-black ${montoRecibido > 0 && !montoRecibidoValido ? 'text-danger-400' : 'text-success-500'}`}>Cambio / Vuelto</span>
                  <span className="text-primary-600 font-bold">A entregar</span>
                </div>
                <span className={`text-3xl font-black ${montoRecibido > 0 && !montoRecibidoValido ? 'text-danger-600' : 'text-success-600'}`}>{montoRecibido > 0 && montoRecibidoValido ? formatCurrency(vuelto) : formatCurrency(0)}</span>
              </div>

              {montoRecibido > 0 && !montoRecibidoValido && <p className="text-xs text-danger-500 text-center font-bold animate-pulse">El pago es insuficiente para cubrir los {formatCurrency(montoPagar)}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-primary-100 flex flex-col sm:flex-row gap-3 shrink-0">
        <Button type="button" variant="secondary" className="flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs h-auto" onClick={onClose} disabled={submitting}>Cancelar</Button>
        <Button type="button" className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs h-auto shadow-lg transition-all ${(esValido && isCajaAbierta) ? 'bg-accent-600 hover:bg-accent-700 shadow-accent-200' : 'bg-primary-200'}`} onClick={() => onConfirm(metodo, montoPagar, esEfectivo ? montoRecibido : montoPagar, esEfectivo ? vuelto : 0)} disabled={!esValido || submitting || !isCajaAbierta} isLoading={submitting}>
          <div className="flex items-center justify-center gap-2">{esValido && !submitting && <IconCheck size={18} />} Confirmar Pago</div>
        </Button>
      </div>
    </Modal>
  );
}
