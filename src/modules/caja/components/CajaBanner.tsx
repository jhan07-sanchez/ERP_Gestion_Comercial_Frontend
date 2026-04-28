import { useNavigate } from 'react-router-dom';
import { useCajaStore } from '../store/caja.store';
import { IconAlertTriangle, IconLock, IconLockOpen, IconArrowRight } from '@tabler/icons-react';

export const CajaBanner = () => {
    const { sesionActiva } = useCajaStore();
    const navigate = useNavigate();

    if (sesionActiva !== null) {
        return (
            <div className="bg-success-50 border-b border-success-100 px-6 py-2 flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                    <div className="bg-success-100 p-1.5 rounded-full text-success-600">
                        <IconLockOpen size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-success-800 uppercase tracking-wider">Caja Abierta</span>
                        <span className="text-[11px] text-success-600 font-medium">
                            Sesión activa en: {sesionActiva?.caja_nombre || 'Caja Principal'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/caja')}
                    className="flex items-center gap-1.5 text-xs font-bold text-success-700 hover:text-success-800 transition-colors group"
                >
                    Gestionar Caja
                    <IconArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-warning-50 border-b border-warning-100 px-6 py-2 flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
                <div className="bg-warning-100 p-1.5 rounded-full text-warning-600">
                    <IconLock size={16} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-warning-800 uppercase tracking-wider">Caja Cerrada</span>
                    <span className="text-[11px] text-warning-600 font-medium">
                        Debes abrir una caja para registrar ventas o compras.
                    </span>
                </div>
            </div>

            <button
                onClick={() => navigate('/caja')}
                className="flex items-center gap-1.5 text-xs font-bold text-warning-700 hover:text-warning-800 transition-colors group"
            >
                <IconAlertTriangle size={14} className="text-warning-500" />
                Abrir Caja Ahora
                <IconArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
};
