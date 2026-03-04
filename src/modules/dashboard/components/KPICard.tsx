// src/modules/dashboard/components/KPICard.tsx
import { Card, Badge } from '@/shared/components/ui';

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
  // Configuración de colores por variante
  const variantMap = {
    primary: {
      light: 'bg-blue-50 text-blue-600',
      bold: 'bg-blue-600 text-white',
      border: 'border-blue-100',
      gradient: 'from-blue-600 to-blue-700'
    },
    success: {
      light: 'bg-emerald-50 text-emerald-600',
      bold: 'bg-emerald-600 text-white',
      border: 'border-emerald-100',
      gradient: 'from-emerald-600 to-emerald-700'
    },
    warning: {
      light: 'bg-amber-50 text-amber-600',
      bold: 'bg-amber-600 text-white',
      border: 'border-amber-100',
      gradient: 'from-amber-600 to-amber-700'
    },
    danger: {
      light: 'bg-red-50 text-red-600',
      bold: 'bg-red-600 text-white',
      border: 'border-red-100',
      gradient: 'from-red-600 to-red-700'
    }
  };

  const styles = variantMap[variant];
  const badgeVariant = trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'gray';

  return (
    <Card hover className="overflow-hidden border-none shadow-sm ring-1 ring-gray-100 group">
      <Card.Content className="p-0">
        <div className="flex flex-col">
          {/* Header con Icono y Trend */}
          <div className="p-5 flex items-start justify-between">
            <div className={`p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-sm ${styles.light}`}>
              {icon}
            </div>

            {trend && percentage !== undefined && (
              <Badge variant={badgeVariant} size="sm" className="font-black tracking-tighter shadow-sm">
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {trend === 'stable' && '→'}
                {' '}
                {percentage}%
              </Badge>
            )}
          </div>

          {/* Valor y Título */}
          <div className="px-5 pb-5">
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-1">
              {value}
            </h3>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
              {title}
            </p>
          </div>

          {/* Footer decorativo con gradiente sutil */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${styles.gradient} opacity-20`}></div>
        </div>
      </Card.Content>
    </Card>
  );
}

export default KPICard;