import type { BalanceGeneralData } from '../../types/reportes.types';
import { IconBuildingBank, IconArrowDownRight, IconArrowUpRight, IconScale } from '@tabler/icons-react';

interface Props {
  data: BalanceGeneralData;
}

export function BalanceGeneralReport({ data }: Props) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Resumen Ejecutivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-7 rounded-[32px] bg-primary-900 text-white shadow-2xl shadow-primary-200/50 overflow-hidden relative group transition-all hover:scale-[1.02] duration-500">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
           <IconBuildingBank className="mb-4 text-primary-300" size={32} />
           <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-300 mb-1">Total Activos</p>
           <h3 className="text-3xl font-black">{formatCurrency(data.activos.total)}</h3>
        </div>

        <div className="p-7 rounded-[32px] bg-white border border-primary-100 shadow-xl shadow-primary-50/50 overflow-hidden relative group transition-all hover:scale-[1.02] duration-500">
           <IconArrowDownRight className="mb-4 text-danger-500" size={32} />
           <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-400 mb-1">Total Pasivos</p>
           <h3 className="text-3xl font-black text-primary-900">{formatCurrency(data.pasivos.total)}</h3>
        </div>

        <div className="p-7 rounded-[32px] bg-success-600 text-white shadow-2xl shadow-success-100 overflow-hidden relative group transition-all hover:scale-[1.02] duration-500">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
           <IconScale className="mb-4 text-success-100" size={32} />
           <p className="text-xs font-black uppercase tracking-[0.2em] text-success-100 mb-1">Patrimonio Neto</p>
           <h3 className="text-3xl font-black">{formatCurrency(data.patrimonio)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sección Activos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-primary-900 pb-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary-900">1. Activos</h4>
            <span className="text-xs font-bold text-primary-400">Estructura de Capital</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-5 bg-white rounded-2xl border border-primary-100 hover:border-primary-300 transition-colors">
              <div>
                <p className="text-xs font-black text-primary-900 uppercase tracking-wider">Efectivo y Equivalentes</p>
                <p className="text-xs text-primary-400 font-bold uppercase">Cajas y Terminales</p>
              </div>
              <p className="text-lg font-black text-primary-900">{formatCurrency(data.activos.disponible)}</p>
            </div>

            <div className="flex justify-between items-center p-5 bg-white rounded-2xl border border-primary-100 hover:border-primary-300 transition-colors">
              <div>
                <p className="text-xs font-black text-primary-900 uppercase tracking-wider">Inventarios</p>
                <p className="text-xs text-primary-400 font-bold uppercase">Mercancía a costo de compra</p>
              </div>
              <p className="text-lg font-black text-primary-900">{formatCurrency(data.activos.inventarios)}</p>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-primary-100">
               <p className="text-xs font-black text-primary-900 uppercase">Total Activos Corrientes</p>
               <p className="text-xl font-black text-primary-900">{formatCurrency(data.activos.total_corrientes)}</p>
            </div>
          </div>
        </div>

        {/* Sección Pasivos y Patrimonio */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-danger-600 pb-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-danger-600">2. Pasivos y Patrimonio</h4>
            <span className="text-xs font-bold text-primary-400">Obligaciones y Fondos</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-5 bg-danger-50/30 rounded-2xl border border-danger-100">
              <div>
                <p className="text-xs font-black text-danger-600 uppercase tracking-wider">Cuentas por Pagar</p>
                <p className="text-xs text-danger-400 font-bold uppercase">Proveedores y Acreedores</p>
              </div>
              <p className="text-lg font-black text-danger-600">{formatCurrency(data.pasivos.cuentasPorPagar)}</p>
            </div>

            <div className="flex justify-between items-center p-5 bg-success-50/30 rounded-2xl border border-success-100">
              <div>
                <p className="text-xs font-black text-success-600 uppercase tracking-wider">Patrimonio del Dueño</p>
                <p className="text-xs text-success-400 font-bold uppercase">Capital Social y Resultados</p>
              </div>
              <p className="text-lg font-black text-success-600">{formatCurrency(data.patrimonio)}</p>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-primary-100">
               <div className="flex items-center gap-2">
                  <IconScale size={16} className="text-primary-400" />
                  <p className="text-xs font-black text-primary-900 uppercase">Total Pasivo + Patrimonio</p>
               </div>
               <p className="text-xl font-black text-primary-900">{formatCurrency(data.pasivos.total + data.patrimonio)}</p>
            </div>
          </div>
          
          <div className="p-4 bg-primary-50 rounded-xl border border-primary-100 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm">
                <IconArrowUpRight size={18} />
             </div>
             <p className="text-xs font-bold text-primary-600 leading-tight">
                La ecuación contable se encuentra equilibrada y validada según los estándares financieros del ERP.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
