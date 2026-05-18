import { Card, Button } from "@shared/components/ui";
import { formatCurrency, numberClass } from "@shared/utils/formatters";
import { IconReceipt, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import type { VentaFormData, ClienteParaVenta } from "@modules/ventas/types/venta.types";

interface VentaFormResumenProps {
  value: VentaFormData;
  clienteSeleccionado: ClienteParaVenta | null;
  submitting: boolean;
  impuestoPorcentaje: number;
  permitirVentaSinStock: boolean;
  simbolo: string;
  moneda: string;
  onCancel: () => void;
}

export function VentaFormResumen({
  value,
  clienteSeleccionado,
  submitting,
  impuestoPorcentaje,
  permitirVentaSinStock,
  simbolo,
  moneda,
  onCancel,
}: VentaFormResumenProps) {
  return (
    <div className="lg:w-96 space-y-6">
      <Card className="border-none shadow-xl bg-white text-primary-900 overflow-hidden ring-1 ring-primary-200 sticky top-6">
        <div className="bg-gradient-to-br from-accent-600 to-accent-700 p-6 border-b border-accent-500/10 text-white">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <IconReceipt size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Resumen de Transacción</span>
          </div>
          <h3 className="text-xl font-bold">Total a Facturar</h3>
        </div>

        <Card.Content className="p-8 space-y-8">
          {/* Detalle del total */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-primary-500">
              <span className="text-sm font-medium">Subtotal</span>
              <span className={`font-bold text-primary-700 ${numberClass}`}>{formatCurrency(value.total || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-primary-500">
              <span className="text-sm font-medium text-accent-600">Impuestos (IVA {impuestoPorcentaje}%)</span>
              <span className={`font-bold text-accent-700 ${numberClass}`}>
                {formatCurrency((value.total || 0) * (impuestoPorcentaje / 100))}
              </span>
            </div>
            <div className="flex justify-between items-center text-primary-500">
              <span className="text-sm font-medium">Descuentos</span>
              <span className={`font-bold text-primary-700 ${numberClass}`}>{formatCurrency(0)}</span>
            </div>

            <div className="h-px bg-primary-100 my-6"></div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-black text-accent-600 uppercase tracking-widest leading-none mb-1">Total a Pagar</p>
                  <p className="text-xs text-primary-400 font-medium">{moneda} - {simbolo}</p>
                </div>
              </div>
              <div className="text-left bg-primary-50 p-4 rounded-2xl border border-primary-100">
                <p className={`text-2xl sm:text-3xl font-black text-primary-900 tracking-tighter ${numberClass} break-all`}>
                  {formatCurrency((value.total || 0) * (1 + impuestoPorcentaje / 100))}
                </p>
              </div>
            </div>
          </div>

          {/* Acciones principales */}
          <div className="space-y-4 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-accent-600 hover:bg-accent-500 text-white border-none font-black text-sm uppercase tracking-widest shadow-xl transform transition active:scale-95"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  PROCESANDO...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <IconCheck size={20} />
                  FINALIZAR VENTA
                </div>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={submitting}
              className="w-full py-4 border border-primary-100 text-primary-400 hover:text-primary-600 hover:bg-primary-50 font-bold text-xs uppercase tracking-widest transition-all"
            >
              CANCELAR OPERACIÓN
            </Button>
          </div>

          {/* Mensajes de validación visual */}
          <div className="pt-2">
            {(!clienteSeleccionado || value.cliente_id === 0) && value.detalles.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-warning-50 border border-warning-100 rounded-xl animate-pulse">
                <IconAlertCircle className="text-warning-600 shrink-0" size={16} />
                <p className="text-xs font-bold text-warning-800 leading-relaxed uppercase tracking-tighter">
                  Acción Requerida: Se debe seleccionar un cliente para finalizar la transacción.
                </p>
              </div>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Panel informativo lateral */}
      <div className="p-5 bg-accent-50/50 border border-accent-100 rounded-2xl hidden lg:block">
        <h5 className="text-xs font-black text-accent-900 uppercase tracking-widest mb-3 flex items-center gap-2">
          <IconAlertCircle size={14} /> Políticas Globales
        </h5>
        <div className="space-y-3">
          <p className="text-xs text-accent-800/70 leading-relaxed">
            <span className="font-bold text-accent-900">IVA:</span> Se aplica automáticamente el {impuestoPorcentaje}% según configuración.
          </p>
          <p className="text-xs text-accent-800/70 leading-relaxed">
            <span className="font-bold text-accent-900">STOCK:</span> {permitirVentaSinStock ? 'Permitido vender sin stock.' : 'Venta bloqueada si no hay stock.'}
          </p>
        </div>
      </div>
    </div>
  );
}
