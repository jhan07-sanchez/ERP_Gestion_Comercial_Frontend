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
import { formatDateTime } from "@/shared/utils";

interface AlertListProps {
    alerts: SystemAlert[];
}

export function AlertList({ alerts }: AlertListProps) {
    const navigate = useNavigate();

    if (alerts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-primary-400">
                <IconInfoCircle size={48} stroke={1} className="mb-2 opacity-20" />
                <p className="text-sm font-medium">No hay alertas del sistema</p>
            </div>
        );
    }

    const getSeverityStyles = (severity: SystemAlert['severidad']) => {
        switch (severity) {
            case 'critica':
                return {
                    container: "bg-danger-50 border-danger-100 hover:border-danger-200",
                    iconContainer: "bg-danger-100 text-danger-600",
                    icon: <IconAlertCircle size={20} />,
                    badge: "bg-danger-200 text-danger-800",
                    title: "text-danger-900"
                };
            case 'media':
            case 'advertencia':
                return {
                    container: "bg-warning-50 border-warning-100 hover:border-warning-200",
                    iconContainer: "bg-warning-100 text-warning-600",
                    icon: <IconAlertTriangle size={20} />,
                    badge: "bg-warning-200 text-warning-800",
                    title: "text-warning-900"
                };
            case 'informacion':
            case 'baja':
            default:
                return {
                    container: "bg-accent-50 border-accent-100 hover:border-accent-200",
                    iconContainer: "bg-accent-100 text-accent-600",
                    icon: <IconInfoCircle size={20} />,
                    badge: "bg-accent-200 text-accent-800",
                    title: "text-accent-900"
                };
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
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary-400 shrink-0">
                                    <IconClock size={12} />
                                    {formatDateTime(alert.timestamp)}
                                </div>
                            </div>

                            <p className="text-xs text-primary-600 leading-relaxed font-medium">
                                {alert.message}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${styles.badge}`}>
                                    Nivel {alert.severidad}
                                </span>

                                <button
                                    onClick={() => handleDetailClick(alert)}
                                    className="text-[10px] font-black text-accent-600 bg-accent-50/80 hover:bg-accent-100 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors lg:opacity-0 lg:group-hover:opacity-100 opacity-100"
                                >
                                    VER DETALLE
                                    <IconChevronRight size={12} stroke={2.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
