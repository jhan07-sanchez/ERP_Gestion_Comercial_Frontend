// src/modules/dashboard/components/AlertList.tsx
import {
    IconAlertTriangle,
    IconAlertCircle,
    IconInfoCircle,
    IconClock,
    IconChevronRight
} from "@tabler/icons-react";
import type { SystemAlert } from "../types";
import { useNavigate } from "react-router-dom";

interface AlertListProps {
    alerts: SystemAlert[];
}

export function AlertList({ alerts }: AlertListProps) {
    const navigate = useNavigate();

    if (alerts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <IconInfoCircle size={48} stroke={1} className="mb-2 opacity-20" />
                <p className="text-sm font-medium">No hay alertas del sistema</p>
            </div>
        );
    }

    const getSeverityStyles = (severity: SystemAlert['severidad']) => {
        switch (severity) {
            case 'critica':
                return {
                    container: "bg-red-50 border-red-100 hover:border-red-200",
                    iconContainer: "bg-red-100 text-red-600",
                    icon: <IconAlertCircle size={20} />,
                    badge: "bg-red-200 text-red-800",
                    title: "text-red-900"
                };
            case 'media':
            case 'advertencia':
                return {
                    container: "bg-amber-50 border-amber-100 hover:border-amber-200",
                    iconContainer: "bg-amber-100 text-amber-600",
                    icon: <IconAlertTriangle size={20} />,
                    badge: "bg-amber-200 text-amber-800",
                    title: "text-amber-900"
                };
            case 'informacion':
            case 'baja':
            default:
                return {
                    container: "bg-blue-50 border-blue-100 hover:border-blue-200",
                    iconContainer: "bg-blue-100 text-blue-600",
                    icon: <IconInfoCircle size={20} />,
                    badge: "bg-blue-200 text-blue-800",
                    title: "text-blue-900"
                };
        }
    };

    const formatAlertTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleString('es-CO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch {
            return dateStr;
        }
    };

    const handleDetailClick = (alert: SystemAlert) => {
        if (alert.type === 'sale') {
            navigate(`/ventas/${alert.id}/detalle`);
        } else {
            navigate(`/productos/${alert.id}/editar`);
        }
    };

    return (
        <div className="space-y-3">
            {alerts.map((alert) => {
                const styles = getSeverityStyles(alert.severidad);

                return (
                    <div
                        key={alert.id}
                        className={`group p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 cursor-default ${styles.container}`}
                    >
                        <div className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-110 ${styles.iconContainer}`}>
                            {styles.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <h4 className={`text-sm font-black uppercase tracking-tight truncate ${styles.title}`}>
                                    {alert.title}
                                </h4>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 shrink-0">
                                    <IconClock size={12} />
                                    {formatAlertTime(alert.timestamp)}
                                </div>
                            </div>

                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                {alert.message}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${styles.badge}`}>
                                    Nivel {alert.severidad}
                                </span>

                                <button
                                    onClick={() => handleDetailClick(alert)}
                                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    VER DETALLE
                                    <IconChevronRight size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
