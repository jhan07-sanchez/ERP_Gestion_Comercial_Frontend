import { IconBuildingBank } from '@tabler/icons-react';
import type { BalanceGeneralData } from '../../types/reportes.types';

interface Props {
  data: BalanceGeneralData['activos'];
}

export function AssetsReport({ data }: Props) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-10 rounded-[40px] bg-primary-900 text-white shadow-2xl shadow-primary-200 overflow-hidden relative group">
         <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-1000" />
         <IconBuildingBank className="mb-6 text-primary-300" size={48} />
         <h3 className="text-5xl font-black mb-2">{formatCurrency(data.total)}</h3>
         <p className="text-[12px] font-black uppercase tracking-[0.4em] text-primary-400">Total Activos Consolidados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-primary-100 shadow-sm hover:border-primary-300 transition-all">
          <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-4">Efectivo y Equivalentes</p>
          <p className="text-3xl font-black text-primary-900">{formatCurrency(data.disponible)}</p>
          <div className="mt-4 h-1.5 w-full bg-primary-50 rounded-full overflow-hidden">
             <div className="h-full bg-primary-900 rounded-full" style={{ width: `${(data.disponible / data.total) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-primary-100 shadow-sm hover:border-primary-300 transition-all">
          <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-4">Inventarios de Mercancía</p>
          <p className="text-3xl font-black text-primary-900">{formatCurrency(data.inventarios)}</p>
          <div className="mt-4 h-1.5 w-full bg-primary-50 rounded-full overflow-hidden">
             <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(data.inventarios / data.total) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
