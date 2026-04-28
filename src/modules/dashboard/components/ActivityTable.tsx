// src/modules/dashboard/components/ActivityTable.tsx
import { Card, Badge } from "@/shared/components/ui";
import { 
  IconUser, 
  IconChevronRight
} from "@tabler/icons-react";
import type { RecentActivity } from "../types";
import { useNavigate } from "react-router-dom";

interface ActivityTableProps {
  activities: RecentActivity[];
}

export function ActivityTable({ activities }: ActivityTableProps) {
  const navigate = useNavigate();

  const getStatusBadge = (estado: RecentActivity['estado']) => {
    switch (estado) {
      case 'success': return <Badge variant="success" size="sm" className="font-black">COMPLETADO</Badge>;
      case 'warning': return <Badge variant="warning" size="sm" className="font-black">ALERTA</Badge>;
      case 'error': return <Badge variant="danger" size="sm" className="font-black">ERROR</Badge>;
      default: return <Badge variant="info" size="sm" className="font-black">INFO</Badge>;
    }
  };

  const getModuleColor = (modulo: string) => {
    const m = modulo.toLowerCase();
    if (m.includes('vent')) return 'text-accent-600 bg-accent-50';
    if (m.includes('inv') || m.includes('prod')) return 'text-purple-600 bg-purple-50';
    if (m.includes('caja')) return 'text-success-600 bg-success-50';
    if (m.includes('crm') || m.includes('client')) return 'text-accent-600 bg-accent-50';
    return 'text-primary-600 bg-primary-50';
  };

  return (
    <Card className="border-none shadow-sm ring-1 ring-primary-100 overflow-hidden bg-white">
      <div className="p-5 border-b border-primary-50 flex items-center justify-between">
         <div>
            <h3 className="text-sm font-black text-primary-800 uppercase tracking-tight">Registro de Actividad</h3>
            <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Logs recientes del sistema</p>
         </div>
         <button 
            onClick={() => navigate('/auditoria/lista')}
            className="text-[10px] font-black text-accent-600 hover:underline uppercase tracking-widest"
         >
            Ver Todo
         </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary-50/50 border-b border-primary-100">
              <th className="px-5 py-3 text-[10px] font-black text-primary-400 uppercase tracking-widest">Usuario</th>
              <th className="px-5 py-3 text-[10px] font-black text-primary-400 uppercase tracking-widest">Acción / Evento</th>
              <th className="px-5 py-3 text-[10px] font-black text-primary-400 uppercase tracking-widest">Módulo</th>
              <th className="px-5 py-3 text-[10px] font-black text-primary-400 uppercase tracking-widest text-center">Estado</th>
              <th className="px-5 py-3 text-[10px] font-black text-primary-400 uppercase tracking-widest text-right">Fecha</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50">
            {activities.map((activity) => (
              <tr key={`${activity.type}-${activity.id}`} className="hover:bg-primary-50/50 transition-colors group">
                <td className="px-5 py-4 whitespace-nowrap">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 border border-primary-200">
                        <IconUser size={16} />
                      </div>
                      <span className="text-xs font-bold text-primary-700">{activity.usuario}</span>
                   </div>
                </td>
                <td className="px-5 py-4">
                   <p className="text-xs font-semibold text-primary-800 line-clamp-1">{activity.descripcion}</p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                   <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${getModuleColor(activity.modulo)}`}>
                      {activity.modulo}
                   </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-center">
                   {getStatusBadge(activity.estado)}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-right">
                   <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-primary-700">{activity.fecha}</span>
                      <span className="text-[9px] font-black text-primary-400 tabular-nums">
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>
                </td>
                <td className="px-5 py-4 text-right">
                   <button className="p-1.5 rounded-lg text-primary-400 hover:text-accent-600 hover:bg-white border border-transparent hover:border-accent-100 transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                      <IconChevronRight size={16} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

