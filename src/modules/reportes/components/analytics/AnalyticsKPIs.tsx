import { KPICard } from '@modules/dashboard/components/KPICard';
import { formatCurrency, formatPercentage } from '@shared/utils';
import type { TrendMetric } from '../../types/analytics.types';
import type { ReactNode } from 'react';

interface KPIMetricDef {
  title: string;
  metric: TrendMetric;
  type: 'currency' | 'number' | 'percentage' | 'time';
  icon: ReactNode;
  variant: 'primary' | 'success' | 'warning' | 'danger';
}

interface AnalyticsKPIsProps {
  metrics: KPIMetricDef[];
}

export function AnalyticsKPIs({ metrics }: AnalyticsKPIsProps) {
  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'currency': return formatCurrency(value);
      case 'percentage': return formatPercentage(value);
      case 'time': return `${value} min`;
      default: return value.toLocaleString('es-CO');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
      {metrics.map((m, idx) => (
        <KPICard
          key={idx}
          title={m.title}
          value={formatValue(m.metric.value, m.type)}
          trend={m.metric.trend === 0 ? 'stable' : m.metric.isPositive ? 'up' : 'down'}
          percentage={Math.abs(m.metric.trend)}
          icon={m.icon}
          variant={m.variant}
        />
      ))}
    </div>
  );
}
