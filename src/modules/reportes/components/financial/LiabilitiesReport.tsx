import { IconArrowDownRight } from '@tabler/icons-react';
import type { BalanceGeneralData } from '../../types/reportes.types';

interface Props {
  data: BalanceGeneralData['pasivos'];
}

export function LiabilitiesReport({ data }: Props) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-10 rounded-[40px] bg-white border-2 border-danger-100 shadow-2xl shadow-danger-50 overflow-hidden relative group">
         <IconArrowDownRight className="mb-6 text-danger-500" size={48} />
         <h3 className="text-5xl font-black mb-2 text-primary-900">{formatCurrency(data.total)}</h3>
         <p className="text-[12px] font-black uppercase tracking-[0.4em] text-danger-400">Total Pasivos y Obligaciones</p>
      </div>

      <div className="bg-danger-50/30 p-8 rounded-[32px] border border-danger-100 flex justify-between items-center">
        <div>
          <p className="text-[11px] font-black text-danger-600 uppercase tracking-wider mb-1">Cuentas por Pagar</p>
          <p className="text-sm text-danger-400 font-bold uppercase">Proveedores y Acreedores Diversos</p>
        </div>
        <p className="text-3xl font-black text-danger-600">{formatCurrency(data.cuentasPorPagar)}</p>
      </div>
      
      <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100 italic text-[11px] text-primary-400 text-center">
        "El control de pasivos es fundamental para mantener la liquidez operativa del ERP."
      </div>
    </div>
  );
}
