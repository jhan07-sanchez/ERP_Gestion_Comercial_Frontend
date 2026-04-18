// src/modules/dashboard/components/AlertsPanel.tsx
import { Card, Badge } from "@/shared/components/ui";
import { 
  IconAlertTriangle, 
  IconBoxSeam, 
  IconArrowRight,
  IconShoppingCartPlus
} from "@tabler/icons-react";
import type { SystemAlert } from "../types";
import { useNavigate } from "react-router-dom";

interface AlertsPanelProps {
  alerts: SystemAlert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const navigate = useNavigate();

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Alertas Críticas</h3>
        <Badge variant={alerts.length > 5 ? "danger" : "warning"} className="font-extrabold tracking-widest px-2 shadow-sm">
          {alerts.length} PENDIENTES
        </Badge>
      </div>

      <div className="space-y-3">
        {alerts.slice(0, 4).map((alert) => (
          <Card key={alert.id} className="border-none shadow-sm ring-1 ring-slate-100 p-4 bg-white/60 backdrop-blur-sm group hover:ring-rose-200 transition-all">
            <div className="flex gap-4">
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${
                alert.severidad === 'critica' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {alert.type === 'product' ? <IconBoxSeam size={20} /> : <IconAlertTriangle size={20} />}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <h4 className="text-[13px] font-black text-slate-900 leading-tight uppercase tracking-tight">{alert.title}</h4>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 leading-normal">{alert.message}</p>
                
                {alert.actionable && (
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => navigate(`/compras/nueva?producto_id=${alert.id}`)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                    >
                      <IconShoppingCartPlus size={12} />
                      Reabastecer
                    </button>
                    <button 
                      onClick={() => navigate(`/productos/${alert.id}/editar`)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                    >
                      Ver Producto
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {alerts.length > 4 && (
        <button className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2">
          Ver todas las notificaciones
          <IconArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
