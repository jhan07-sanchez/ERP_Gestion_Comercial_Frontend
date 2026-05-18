import { Card } from '@shared/components/ui';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { SalesTrendData } from '../../types/analytics.types';
import { formatCurrency } from '@shared/utils';

interface SalesTrendChartProps {
  data: SalesTrendData[];
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  return (
    <Card className="p-6 border-none shadow-sm ring-1 ring-primary-100 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-sm font-black text-primary-800 uppercase tracking-tight">Tendencia y Proyección</h3>
        <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">Comparativa histórica y estimación</p>
      </div>
      <div className="flex-1 w-full min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAnterior" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="fecha" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 600 }}
              formatter={(value: number | string | undefined) => [formatCurrency(Number(value) || 0), '']}
            />
            <Legend 
               iconType="circle" 
               wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '20px' }}
            />
            <Area 
              name="Período Actual"
              type="monotone" 
              dataKey="actual" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorActual)" 
            />
            <Area 
              name="Período Anterior"
              type="monotone" 
              dataKey="anterior" 
              stroke="#94a3b8" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorAnterior)" 
            />
            {data[0]?.proyectado !== undefined && (
              <Area 
                name="Proyectado"
                type="monotone" 
                dataKey="proyectado" 
                stroke="#f59e0b" 
                strokeWidth={2}
                strokeDasharray="3 3"
                fill="none" 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
