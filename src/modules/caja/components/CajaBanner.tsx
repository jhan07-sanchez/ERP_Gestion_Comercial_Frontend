import { useNavigate } from 'react-router-dom';
import { useCajaStore } from '../store/caja.store';
import { IconAlertTriangle, IconLock, IconLockOpen, IconArrowRight } from '@tabler/icons-react';

export const CajaBanner = () => {
    const { sesionActiva } = useCajaStore();
    const navigate = useNavigate();

    if (sesionActiva !== null) {
        return (
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-2 flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600">
                        <IconLockOpen size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Caja Abierta</span>
                        <span className="text-[11px] text-emerald-600 font-medium">
                            Sesión activa en: {sesionActiva?.caja_nombre || 'Caja Principal'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/caja')}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors group"
                >
                    Gestionar Caja
                    <IconArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-2 flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-1.5 rounded-full text-amber-600">
                    <IconLock size={16} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Caja Cerrada</span>
                    <span className="text-[11px] text-amber-600 font-medium">
                        Debes abrir una caja para registrar ventas o compras.
                    </span>
                </div>
            </div>

            <button
                onClick={() => navigate('/caja')}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors group"
            >
                <IconAlertTriangle size={14} className="text-amber-500" />
                Abrir Caja Ahora
                <IconArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
};
