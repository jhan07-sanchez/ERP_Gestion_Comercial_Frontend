import { Card } from '@shared/components/ui';
import type { ProductPerformanceData } from '../../types/analytics.types';
import { formatCurrency } from '@shared/utils';

interface TopProductsProps {
  topProducts: ProductPerformanceData[];
  lowRotation: ProductPerformanceData[];
}

export function TopProductsAnalysis({ topProducts, lowRotation }: TopProductsProps) {
  return (
    <Card className="p-6 border-none shadow-sm ring-1 ring-primary-100 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-sm font-black text-primary-800 uppercase tracking-tight">Análisis de Productos</h3>
        <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">Rendimiento e inventario por rotación</p>
      </div>
      
      <div className="space-y-6 flex-1">
        {/* Top Productos */}
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-primary-50 pb-2">
            <h4 className="text-xs font-black text-success-600 uppercase tracking-widest">Top Ventas (Estrellas)</h4>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-primary-50 text-primary-500 font-black text-xs flex items-center justify-center group-hover:bg-accent-50 group-hover:text-accent-600 transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-900 line-clamp-1">{p.nombre}</p>
                    <p className="text-xs text-primary-400">{p.ventas} un. • Stock: {p.stockActual}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-primary-800">{formatCurrency(p.ingresos)}</p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className={`text-xs opacity-80 font-bold ${p.tendencia >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                      {p.tendencia >= 0 ? '↑' : '↓'} {Math.abs(p.tendencia)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Baja Rotación */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3 border-b border-primary-50 pb-2">
             <h4 className="text-xs font-black text-danger-600 uppercase tracking-widest">Alerta: Baja Rotación (Perros)</h4>
          </div>
          <div className="space-y-3">
            {lowRotation.map((p, i) => (
              <div key={i} className="flex items-center justify-between group opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-lg bg-danger-50 text-danger-500 font-black text-xs flex items-center justify-center">
                    !
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-900 line-clamp-1">{p.nombre}</p>
                    <p className="text-xs text-primary-400">{p.ventas} un. • Stock Intacto: {p.stockActual}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-primary-800">{formatCurrency(p.ingresos)}</p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="text-xs opacity-80 font-bold text-danger-600">
                      ↓ {Math.abs(p.tendencia)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
