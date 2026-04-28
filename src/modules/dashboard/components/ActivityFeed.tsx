// src/modules/dashboard/components/ActivityFeed.tsx
import {
    IconShoppingCart,
    IconUserPlus,
    IconClipboardList,
    IconPackage,
    IconCircleCheck,
    IconCircleX,
    IconInfoCircle,
    IconChevronRight
} from "@tabler/icons-react";
import type { RecentActivity } from "../types";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "@/shared/utils";

interface ActivityFeedProps {
    activities: RecentActivity[];
    limit?: number;
}

export function ActivityFeed({ activities, limit }: ActivityFeedProps) {
    const navigate = useNavigate();

    // Solo mostramos las actividades según el límite
    const topActivities = limit ? activities.slice(0, limit) : activities;

    const getActivityIcon = (type: string) => {
        const iconProps = { size: 16, stroke: 2.5 };
        const utype = type.toUpperCase();

        if (utype.includes('VENTA')) return <IconShoppingCart {...iconProps} className="text-accent-600" />;
        if (utype.includes('CLIENTE')) return <IconUserPlus {...iconProps} className="text-success-600" />;
        if (utype.includes('COMPRA') || utype.includes('ORDEN')) return <IconClipboardList {...iconProps} className="text-warning-600" />;
        if (utype.includes('PRODUCTO') || utype.includes('INVENTARIO')) return <IconPackage {...iconProps} className="text-accent-600" />;
        if (utype.includes('USUARIO')) return <IconUserPlus {...iconProps} className="text-purple-600" />;

        return <IconInfoCircle {...iconProps} className="text-primary-400" />;
    };

    const getStatusIcon = (estado: RecentActivity['estado']) => {
        switch (estado) {
            case 'success': return <IconCircleCheck size={14} className="text-success-500" />;
            case 'warning': return <IconCircleX size={14} className="text-warning-500" />;
            case 'error': return <IconCircleX size={14} className="text-danger-500" />;
            default: return <IconInfoCircle size={14} className="text-accent-500" />;
        }
    };



    const handleActivityClick = (activity: RecentActivity) => {
        if (activity.type === 'sale') {
            navigate(`/ventas/${activity.id}/detalle`);
        } else if (activity.type === 'order') {
            navigate(`/compras/${activity.id}/detalles`);
        } else if (activity.type === 'product') {
            navigate(`/productos/${activity.id}/editar`);
        } else if (activity.type === 'customer') {
            navigate(`/clientes/${activity.id}/editar`);
        }
    };

    if (topActivities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-primary-400">
                <IconClipboardList size={48} stroke={1} className="mb-2 opacity-20" />
                <p className="text-sm font-medium">No hay actividad reciente</p>
            </div>
        );
    }

    return (
        <div className="relative pl-6">
            {/* Línea vertical del feed */}
            <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-primary-100"></div>

            <div className="space-y-8">
                {topActivities.map((activity) => (
                    <div key={`${activity.type}-${activity.id}`} className="relative group">
                        {/* Punto/Icono en la línea */}
                        <div className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center z-10 transition-colors
              ${activity.estado === 'success' ? 'border-success-100 group-hover:border-success-500' :
                                activity.estado === 'warning' ? 'border-warning-100 group-hover:border-warning-500' :
                                    'border-accent-100 group-hover:border-accent-500'}`}
                        >
                            {getActivityIcon(activity.type)}
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                                    {formatDateTime(activity.timestamp)}
                                </span>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-50 border border-primary-100">
                                    {getStatusIcon(activity.estado)}
                                    <span className="text-[10px] font-black uppercase text-primary-500 tracking-tighter">
                                        {activity.estado}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <p className="text-sm font-semibold text-primary-800 leading-tight">
                                    {activity.descripcion}
                                </p>

                                <button
                                    onClick={() => handleActivityClick(activity)}
                                    className="shrink-0 text-accent-600 bg-accent-50/50 hover:bg-accent-100 p-1.5 rounded-lg transition-colors lg:opacity-0 lg:group-hover:opacity-100 opacity-100"
                                    title="Ver detalles"
                                >
                                    <IconChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
