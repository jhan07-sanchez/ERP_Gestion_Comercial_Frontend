// src/modules/dashboard/components/KPICard.tsx

import { Card, Badge } from '@/components/ui';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  percentage?: number;
  icon: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

/**
 * Componente de tarjeta KPI para el dashboard
 * Muestra una métrica clave con su tendencia
 */
export function KPICard({
  title,
  value,
  trend,
  percentage,
  icon,
  variant = 'primary',
}: KPICardProps) {
  // Determinar color del badge según la tendencia
  const badgeVariant = trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'gray';

  return (
    <Card hover>
      <Card.Content>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>

            {trend && percentage !== undefined && (
              <div className="mt-2">
                <Badge variant={badgeVariant} size="sm">
                  {trend === 'up' && '↑'}
                  {trend === 'down' && '↓'}
                  {trend === 'stable' && '→'}
                  {' '}
                  {percentage}%
                </Badge>
              </div>
            )}
          </div>

          <div className={`p-3 rounded-lg bg-${variant}-100`}>
            {icon}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}