import { IconTrendingUp, IconTrendingDown, IconChartBar } from '@tabler/icons-react';
import type { FlujoCajaData } from '../../types/reportes.types';

interface Props {
  data: FlujoCajaData;
  mode: 'entradas' | 'salidas' | 'balance';
}

export function CashFlowSubReport({ data, mode }: Props) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  const configs = {
    entradas: {
      title: "Entradas de Efectivo",
      value: data.entradas,
      color: "text-success-600",
      bg: "bg-success-50",
      icon: <IconTrendingUp size={48} className="text-success-500 mb-6" />
    },
    salidas: {
      title: "Salidas de Efectivo",
      value: data.salidas,
      color: "text-danger-600",
      bg: "bg-danger-50",
      icon: <IconTrendingDown size={48} className="text-danger-500 mb-6" />
    },
    balance: {
      title: "Saldo Neto de Tesorería",
      value: data.balance,
      color: "text-primary-900",
      bg: "bg-primary-50",
      icon: <IconChartBar size={48} className="text-primary-900 mb-6" />
    }
  };

  const current = configs[mode];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`p-10 rounded-[40px] ${current.bg} border border-primary-100 shadow-xl overflow-hidden relative group`}>
         {current.icon}
         <h3 className={`text-5xl font-black mb-2 ${current.color}`}>{formatCurrency(current.value)}</h3>
         <p className="text-xs font-black uppercase tracking-[0.4em] text-primary-400">{current.title}</p>
      </div>

      <div className="bg-white rounded-[32px] border border-primary-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-primary-50">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-primary-400">Fecha</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-primary-400">Concepto</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-primary-400 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50">
            {data.detalle
              .filter(m => {
                if (mode === 'entradas') return ['APERTURA', 'INGRESO_VENTA', 'INGRESO_MANUAL'].includes(m.tipo);
                if (mode === 'salidas') return ['EGRESO_COMPRA', 'EGRESO_GASTO', 'EGRESO_RETIRO'].includes(m.tipo);
                return true;
              })
              .map((m, i) => (
              <tr key={i} className="hover:bg-primary-50/50 transition-colors">
                <td className="px-6 py-4 text-xs font-bold text-primary-600">{new Date(m.fecha).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-xs font-black text-primary-900">{m.concepto}</td>
                <td className={`px-6 py-4 text-xs font-black text-right ${
                  ['APERTURA', 'INGRESO_VENTA', 'INGRESO_MANUAL'].includes(m.tipo) ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {formatCurrency(m.monto)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
