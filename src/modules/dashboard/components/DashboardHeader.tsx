// src/modules/dashboard/components/DashboardHeader.tsx
import { 
  IconPlus, 
  IconShoppingCart, 
  IconUserPlus, 
  IconFileInvoice, 
  IconLayoutDashboard,
  IconSettingsAutomation,
  IconRefresh
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  mode: 'executive' | 'operational';
  onModeChange: (mode: 'executive' | 'operational') => void;
  onRefresh: () => void;
  lastSync?: string;
}

export function DashboardHeader({ 
  mode, 
  onModeChange, 
  onRefresh,
  lastSync 
}: DashboardHeaderProps) {
  const navigate = useNavigate();

  const quickActions = [
    { label: "Nueva Venta", icon: <IconShoppingCart size={16} />, path: "/ventas/nueva", color: "bg-accent-600" },
    { label: "Nueva Factura", icon: <IconFileInvoice size={16} />, path: "/facturacion/nueva", color: "bg-accent-600" },
    { label: "Nuevo Cliente", icon: <IconUserPlus size={16} />, path: "/clientes/nuevo", color: "bg-success-600" },
    { label: "Registrar Compra", icon: <IconPlus size={16} />, path: "/compras/nueva", color: "bg-primary-800" },
  ];

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Título y Modo */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h1 className="text-2xl font-black text-primary-900 tracking-tight">
                Dashboard {mode === 'executive' ? 'Ejecutivo' : 'Operativo'}
             </h1>
             <div className="flex p-1 bg-primary-100 rounded-xl border border-primary-200 shadow-inner">
                <button
                  onClick={() => onModeChange('executive')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    mode === 'executive' 
                      ? 'bg-white text-accent-600 shadow-sm ring-1 ring-primary-200' 
                      : 'text-primary-500 hover:text-primary-700'
                  }`}
                >
                  <IconLayoutDashboard size={14} />
                  Ejecutivo
                </button>
                <button
                  onClick={() => onModeChange('operational')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    mode === 'operational' 
                      ? 'bg-white text-accent-600 shadow-sm ring-1 ring-primary-200' 
                      : 'text-primary-500 hover:text-primary-700'
                  }`}
                >
                  <IconSettingsAutomation size={14} />
                  Operativo
                </button>
             </div>
          </div>
          <p className="text-sm font-medium text-primary-500">
            {mode === 'executive' 
              ? 'Métricas de rendimiento financiero y tendencias de crecimiento.' 
              : 'Gestión de inventario, ventas pendientes y actividad operativa.'}
          </p>
        </div>

        {/* Sync Status */}
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest leading-none mb-1">Última Sincronización</p>
                <p className="text-xs font-bold text-primary-700 tabular-nums">
                    {(() => {
                        const date = lastSync ? new Date(lastSync) : new Date();
                        return isNaN(date.getTime()) ? new Date().toLocaleTimeString() : date.toLocaleTimeString();
                    })()}
                </p>
            </div>
            <button 
                onClick={onRefresh}
                className="p-2.5 rounded-xl bg-white border border-primary-200 text-primary-500 hover:text-accent-600 hover:border-accent-200 hover:bg-accent-50 transition-all shadow-sm group"
            >
                <IconRefresh size={20} className="group-active:rotate-180 transition-transform duration-500" />
            </button>
        </div>
      </div>

      {/* Botones de Acción Rápida */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white border border-primary-200 shadow-sm hover:shadow-md hover:border-accent-200 hover:bg-accent-50/30 transition-all group overflow-hidden relative"
          >
            <div className={`shrink-0 w-8 h-8 rounded-lg ${action.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <span className="text-[11px] font-black text-primary-700 uppercase tracking-widest">
              {action.label}
            </span>
            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-accent-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}
