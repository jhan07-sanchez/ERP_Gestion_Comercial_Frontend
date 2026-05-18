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
      light: 'bg-accent-50 text-accent-600',
      bold: 'bg-accent-600 text-white',
      border: 'border-accent-100',
      gradient: 'from-accent-600 to-accent-700'
    },
    success: {
      light: 'bg-success-50 text-success-600',
      bold: 'bg-success-600 text-white',
      border: 'border-success-100',
      gradient: 'from-success-600 to-success-700'
    },
    warning: {
      light: 'bg-warning-50 text-warning-600',
      bold: 'bg-warning-600 text-white',
      border: 'border-warning-100',
      gradient: 'from-warning-600 to-warning-700'
    },
    danger: {
      light: 'bg-danger-50 text-danger-600',
      bold: 'bg-danger-600 text-white',
      border: 'border-danger-100',
      gradient: 'from-danger-600 to-danger-700'
    }
  };

  const styles = variantMap[variant];
  const badgeVariant = trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'gray';

  return (
    <Card hover className="overflow-hidden border-none shadow-sm ring-1 ring-primary-100 group">
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
            <h3 className="text-2xl 2xl:text-3xl font-black text-primary-900 tracking-tighter mb-1 truncate" title={value.toString()}>
              {value}
            </h3>
            <p className="text-xs font-black text-primary-400 uppercase tracking-widest">
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