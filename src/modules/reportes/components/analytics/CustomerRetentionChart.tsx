import { Card } from '@/shared/components/ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { CustomerAnalyticsData } from '../../types/analytics.types';

interface CustomerRetentionChartProps {
  data: CustomerAnalyticsData[];
}

export function CustomerRetentionChart({ data }: CustomerRetentionChartProps) {
  return (
    <Card className="p-6 border-none shadow-sm ring-1 ring-primary-100 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-sm font-black text-primary-800 uppercase tracking-tight">Retención de Clientes</h3>
        <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">Nuevos vs Recurrentes vs Inactivos</p>
      </div>
      <div className="flex-1 w-full min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="mes" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 600 }}
            />
            <Legend 
               iconType="circle" 
               wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '20px' }}
            />
            <Bar name="Recurrentes" dataKey="recurrentes" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={32} />
            <Bar name="Nuevos" dataKey="nuevos" stackId="a" fill="#3b82f6" />
            <Bar name="Inactivos" dataKey="inactivos" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
