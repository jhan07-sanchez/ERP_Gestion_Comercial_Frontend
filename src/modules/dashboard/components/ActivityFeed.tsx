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

interface ActivityFeedProps {
    activities: RecentActivity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
    const navigate = useNavigate();

    // Solo mostramos las 5 más recientes
    const topActivities = activities.slice(0, 5);

    const getActivityIcon = (type: RecentActivity['type']) => {
        const iconProps = { size: 18, stroke: 2 };

        switch (type) {
            case 'sale': return <IconShoppingCart {...iconProps} className="text-blue-600" />;
            case 'customer': return <IconUserPlus {...iconProps} className="text-emerald-600" />;
            case 'order': return <IconClipboardList {...iconProps} className="text-amber-600" />;
            case 'product': return <IconPackage {...iconProps} className="text-indigo-600" />;
            default: return <IconInfoCircle {...iconProps} className="text-gray-600" />;
        }
    };

    const getStatusIcon = (estado: RecentActivity['estado']) => {
        switch (estado) {
            case 'success': return <IconCircleCheck size={14} className="text-emerald-500" />;
            case 'warning': return <IconCircleX size={14} className="text-amber-500" />;
            case 'error': return <IconCircleX size={14} className="text-red-500" />;
            default: return <IconInfoCircle size={14} className="text-blue-500" />;
        }
    };

    const formatActivityDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
                day: 'numeric',
                month: 'long'
            }).format(date);
        } catch {
            return dateStr;
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
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <IconClipboardList size={48} stroke={1} className="mb-2 opacity-20" />
                <p className="text-sm font-medium">No hay actividad reciente</p>
            </div>
        );
    }

    return (
        <div className="relative pl-6">
            {/* Línea vertical del feed */}
            <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gray-100"></div>

            <div className="space-y-8">
                {topActivities.map((activity) => (
                    <div key={`${activity.type}-${activity.id}`} className="relative group">
                        {/* Punto/Icono en la línea */}
                        <div className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center z-10 transition-colors
              ${activity.estado === 'success' ? 'border-emerald-100 group-hover:border-emerald-500' :
                                activity.estado === 'warning' ? 'border-amber-100 group-hover:border-amber-500' :
                                    'border-blue-100 group-hover:border-blue-500'}`}
                        >
                            {getActivityIcon(activity.type)}
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {formatActivityDate(activity.timestamp)}
                                </span>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100">
                                    {getStatusIcon(activity.estado)}
                                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">
                                        {activity.estado}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <p className="text-sm font-semibold text-gray-800 leading-tight">
                                    {activity.descripcion}
                                </p>

                                <button
                                    onClick={() => handleActivityClick(activity)}
                                    className="shrink-0 text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
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
