import type { RecentActivityItem } from '../types/dashboard.types';
import { Card } from '@shared/components/ui';
import { IconCash, IconShoppingCart, IconTruckDelivery } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@shared/utils/formatters';

interface RecentActivityProps {
  actividad: RecentActivityItem[];
}

export function RecentActivity({ actividad }: RecentActivityProps) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-primary-100 h-full">
      <Card.Content className="p-5">
        <h3 className="text-sm font-bold text-primary-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {actividad.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                item.tipo === 'venta' ? 'bg-success-50 text-success-600' :
                item.tipo === 'compra' ? 'bg-accent-50 text-accent-600' :
                'bg-primary-50 text-primary-600'
              }`}>
                {item.tipo === 'venta' && <IconShoppingCart size={18} />}
                {item.tipo === 'compra' && <IconTruckDelivery size={18} />}
                {item.tipo === 'caja_movimiento' && <IconCash size={18} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary-900">{item.descripcion}</p>
                <p className="text-xs text-primary-400">
                  {formatDistanceToNow(new Date(item.fecha), { locale: es, addSuffix: true })}
                </p>
              </div>
              {item.monto !== undefined && (
                <div className={`text-sm font-bold ${item.monto >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {item.monto > 0 ? '+' : ''}{formatCurrency(item.monto)}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
