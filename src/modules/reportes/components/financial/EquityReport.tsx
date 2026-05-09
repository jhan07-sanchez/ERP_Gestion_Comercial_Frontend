import { IconScale } from '@tabler/icons-react';

interface Props {
  data: number;
}

export function EquityReport({ data }: Props) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-10 rounded-[40px] bg-success-600 text-white shadow-2xl shadow-success-100 overflow-hidden relative group">
         <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-1000" />
         <IconScale className="mb-6 text-success-100" size={48} />
         <h3 className="text-5xl font-black mb-2">{formatCurrency(data)}</h3>
         <p className="text-[12px] font-black uppercase tracking-[0.4em] text-success-100">Patrimonio Neto del Negocio</p>
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-primary-100 shadow-sm relative">
         <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-1 bg-success-500 rounded-full mb-4" />
            <h4 className="text-lg font-black text-primary-900 uppercase tracking-widest">Resumen de Capital</h4>
            <p className="text-sm text-primary-500 max-w-md leading-relaxed">
               Este valor representa la inversión neta del propietario y las utilidades acumuladas tras deducir todas las obligaciones de los activos totales.
            </p>
         </div>
      </div>
    </div>
  );
}
