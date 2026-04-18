// src/modules/dashboard/components/KPIGrid.tsx
import { Card } from '@/shared/components/ui';
import type { KPIStats } from '../types';
import { 
  IconReportMoney, 
  IconUsers, 
  IconClipboardList, 
  IconBoxSeam,
  IconArrowUpRight,
  IconArrowDownRight,
  IconMinus
} from '@tabler/icons-react';

interface AdvancedKPICardProps {
  title: string;
  value: string | number;
  comparison: {
    percentage: number;
    trend: 'up' | 'down' | 'stable';
    label: string;
  };
  target?: number;
  numericValue?: number;
  icon: React.ReactNode;
  variant: 'blue' | 'emerald' | 'amber' | 'rose';
}

function AdvancedKPICard({
  title,
  value,
  comparison,
  target,
  numericValue,
  icon,
  variant
}: AdvancedKPICardProps) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50 border-blue-100 ring-blue-500",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100 ring-emerald-500",
    amber: "text-amber-600 bg-amber-50 border-amber-100 ring-amber-500",
    rose: "text-rose-600 bg-rose-50 border-rose-100 ring-rose-500",
  };

  const trendColors = {
    up: "text-emerald-600 bg-emerald-50",
    down: "text-rose-600 bg-rose-50",
    stable: "text-slate-500 bg-slate-50",
  };

  const progress = target && numericValue ? Math.min(Math.round((numericValue / target) * 100), 100) : null;

  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-100 overflow-hidden group hover:ring-blue-100 hover:shadow-md transition-all">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className={`p-2.5 rounded-xl border ${colorMap[variant]} shadow-sm group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${trendColors[comparison.trend]}`}>
            {comparison.trend === 'up' && <IconArrowUpRight size={12} stroke={3} />}
            {comparison.trend === 'down' && <IconArrowDownRight size={12} stroke={3} />}
            {comparison.trend === 'stable' && <IconMinus size={12} stroke={3} />}
            {comparison.percentage}%
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tight">{comparison.label}</p>
        </div>

        {progress !== null && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-slate-400">Progreso a Meta</span>
              <span className="text-slate-700">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  variant === 'rose' ? 'bg-rose-500' : 
                  variant === 'amber' ? 'bg-amber-500' : 
                  variant === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className={`h-1 w-full opacity-10 bg-current ${colorMap[variant].split(' ')[0]}`} />
    </Card>
  );
}

interface KPIGridProps {
  kpis: KPIStats;
}

export function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AdvancedKPICard
        title="Ventas Totales"
        value={`$${kpis.totalSales.toLocaleString('es-CO')}`}
        numericValue={kpis.totalSales}
        target={kpis.salesTarget}
        comparison={kpis.salesComparison}
        icon={<IconReportMoney size={20} />}
        variant="blue"
      />
      <AdvancedKPICard
        title="Nuevos Clientes"
        value={kpis.newCustomers}
        numericValue={kpis.newCustomers}
        target={kpis.customersTarget}
        comparison={kpis.customersComparison}
        icon={<IconUsers size={20} />}
        variant="emerald"
      />
      <AdvancedKPICard
        title="Pedidos Pendientes"
        value={kpis.pendingOrders}
        comparison={kpis.ordersComparison}
        icon={<IconClipboardList size={20} />}
        variant="amber"
      />
      <AdvancedKPICard
        title="Stock Crítico"
        value={kpis.lowStockProducts}
        comparison={{
            trend: kpis.stockTrend,
            percentage: kpis.criticalStockCount > 0 ? 100 : 0,
            label: `${kpis.criticalStockCount} agotados`
        }}
        icon={<IconBoxSeam size={20} />}
        variant="rose"
      />
    </div>
  );
}
