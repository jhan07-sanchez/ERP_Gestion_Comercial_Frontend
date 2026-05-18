// src/modules/dashboard/components/CashWidget.tsx
import { Card, Button } from "@/shared/components/ui";
import { 
  IconWallet, 
  IconTrendingUp, 
  IconTrendingDown,
  IconClock,
  IconArrowRight
} from "@tabler/icons-react";
import type { CashStats } from "../types";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatTime } from "@/shared/utils";

interface CashWidgetProps {
  cash: CashStats;
}

export function CashWidget({ cash }: CashWidgetProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-none shadow-sm ring-1 ring-primary-100 overflow-hidden bg-white group">
      <div className="p-5 border-b border-primary-50 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center shadow-sm border border-accent-100">
                <IconWallet size={20} />
            </div>
            <div>
                <h3 className="text-sm font-black text-primary-800 uppercase tracking-tight">Caja Principal</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${cash.estado === 'abierta' ? 'bg-success-500 animate-pulse' : 'bg-primary-300'}`} />
                    <span className="text-xs opacity-80 font-black text-primary-400 uppercase tracking-widest">
                        Sesión {cash.estado}
                    </span>
                </div>
            </div>
         </div>
         <button 
            onClick={() => navigate('/caja')}
            className="p-2 rounded-lg text-primary-400 hover:bg-primary-50 hover:text-accent-600 transition-all"
         >
            <IconArrowRight size={18} />
         </button>
      </div>

      <div className="p-5 space-y-6">
        <div>
            <p className="text-xs font-black text-primary-400 uppercase tracking-widest leading-none mb-1">Saldo Disponible</p>
            <h2 className="text-3xl font-black text-primary-900 tracking-tighter">
                {formatCurrency(cash.balanceActual, true)}
            </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <div className="flex items-center gap-1 text-success-600">
                    <IconTrendingUp size={14} stroke={3} />
                    <span className="text-xs opacity-80 font-black uppercase tracking-widest">Ingresos</span>
                </div>
                <p className="text-sm font-black text-primary-800 tracking-tight">
                    +{formatCurrency(cash.ingresosDia)}
                </p>
            </div>
            <div className="space-y-1 text-right">
                <div className="flex items-center gap-1 text-danger-600 justify-end">
                    <span className="text-xs opacity-80 font-black uppercase tracking-widest">Egresos</span>
                    <IconTrendingDown size={14} stroke={3} />
                </div>
                <p className="text-sm font-black text-primary-800 tracking-tight">
                    -{formatCurrency(cash.egresosDia)}
                </p>
            </div>
        </div>

        <div className="h-1 w-full bg-primary-100 rounded-full overflow-hidden flex shadow-inner">
             <div 
                className="h-full bg-success-500 transition-all duration-1000"
                style={{ width: `${(cash.ingresosDia / (cash.ingresosDia + cash.egresosDia)) * 100}%` }}
             />
             <div 
                className="h-full bg-danger-500 transition-all duration-1000"
                style={{ width: `${(cash.egresosDia / (cash.ingresosDia + cash.egresosDia)) * 100}%` }}
             />
        </div>

        <div className="pt-2">
            <Button 
                variant="secondary" 
                className="w-full h-10 rounded-xl border-primary-200 text-primary-700 font-black uppercase tracking-widest text-xs opacity-80 transition-all hover:bg-accent-50 hover:text-accent-600 hover:border-accent-100"
                onClick={() => navigate('/caja/movimientos')}
            >
                Ver Movimientos Hoy
            </Button>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-primary-50 border-t border-primary-100 flex items-center justify-between">
           <div className="flex items-center gap-1.5 text-primary-400">
               <IconClock size={12} />
               <span className="text-xs opacity-80 font-bold uppercase tracking-widest">Iniciada</span>
           </div>
           <span className="text-xs font-bold text-primary-600 tabular-nums">
                               {formatTime(cash.ultimaApertura)}
           </span>
      </div>
    </Card>
  );
}
