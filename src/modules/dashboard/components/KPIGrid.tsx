// src/modules/dashboard/components/KPIGrid.tsx
import { Card } from '@/shared/components/ui';
import type { KPIStats } from '../types';
import { formatCurrency } from '@/shared/utils';
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
    blue: "text-accent-600 bg-accent-50 border-accent-100 ring-accent-500",
    emerald: "text-success-600 bg-success-50 border-success-100 ring-success-500",
    amber: "text-warning-600 bg-warning-50 border-warning-100 ring-warning-500",
    rose: "text-danger-600 bg-danger-50 border-danger-100 ring-danger-500",
  };

  const trendColors = {
    up: "text-success-600 bg-success-50",
    down: "text-danger-600 bg-danger-50",
    stable: "text-primary-500 bg-primary-50",
  };

  const progress = target && numericValue ? Math.min(Math.round((numericValue / target) * 100), 100) : null;

  return (
    <Card className="border-none shadow-sm ring-1 ring-primary-100 overflow-hidden group hover:ring-accent-100 hover:shadow-md transition-all">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className={`p-2.5 rounded-xl border ${colorMap[variant]} shadow-sm group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-tighter ${trendColors[comparison.trend]}`}>
            {comparison.trend === 'up' && <IconArrowUpRight size={12} stroke={3} />}
            {comparison.trend === 'down' && <IconArrowDownRight size={12} stroke={3} />}
            {comparison.trend === 'stable' && <IconMinus size={12} stroke={3} />}
            {comparison.percentage}%
          </div>
        </div>

        <div>
          <p className="text-xs font-black text-primary-400 uppercase tracking-widest leading-none mb-1">{title}</p>
          <h3 className="text-2xl font-black text-primary-900 tracking-tight">{value}</h3>
          <p className="text-xs font-bold text-primary-500 mt-1 uppercase tracking-tight">{comparison.label}</p>
        </div>

        {progress !== null && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
              <span className="text-primary-400">Progreso a Meta</span>
              <span className="text-primary-700">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-primary-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  variant === 'rose' ? 'bg-danger-500' : 
                  variant === 'amber' ? 'bg-warning-500' : 
                  variant === 'emerald' ? 'bg-success-500' : 'bg-accent-500'
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
        value={formatCurrency(kpis.totalSales)}
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
