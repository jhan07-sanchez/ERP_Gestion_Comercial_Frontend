import { Card } from '@shared/components/ui';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { CategoryPerformanceData } from '../../types/analytics.types';
import { formatCurrency } from '@shared/utils';

interface CategoryPerformanceProps {
  data: CategoryPerformanceData[];
}

export function CategoryPerformanceChart({ data }: CategoryPerformanceProps) {
  // Colores corporativos y variaciones
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6'];

  return (
    <Card className="p-6 border-none shadow-sm ring-1 ring-primary-100 flex flex-col h-full">
      <div className="mb-2">
        <h3 className="text-sm font-black text-primary-800 uppercase tracking-tight">Ventas por Categoría</h3>
        <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">Distribución de ingresos</p>
      </div>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="ingresos"
              nameKey="categoria"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 600 }}
               formatter={(value: number | string | undefined) => [formatCurrency(Number(value) || 0), 'Ingresos']}
            />
            <Legend 
               layout="vertical" 
               verticalAlign="middle" 
               align="right"
               iconType="circle"
               wrapperStyle={{ fontSize: '11px', fontWeight: 700 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
