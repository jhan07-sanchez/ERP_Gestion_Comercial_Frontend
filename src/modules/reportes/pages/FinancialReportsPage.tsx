import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageContainer, PageHeader, Loader, Card } from '@shared/components/ui';
import { useReportes } from '../hooks/useReportes';
import { 
  IconWallet, 
  IconDownload,
  IconPrinter
} from '@tabler/icons-react';
import type { BalanceGeneralData, EstadoResultadosData, FlujoCajaData } from '../types/reportes.types';

// Nuevos componentes granulares
import { BalanceGeneralReport } from '../components/financial/BalanceGeneralReport';
import { AssetsReport } from '../components/financial/AssetsReport';
import { LiabilitiesReport } from '../components/financial/LiabilitiesReport';
import { EquityReport } from '../components/financial/EquityReport';
import { CashFlowSubReport } from '../components/financial/CashFlowSubReport';

export default function FinancialReportsPage() {
  const location = useLocation();
  const { getBalanceGeneral, getEstadoResultados, getFlujoCaja, loading } = useReportes();
  
  const [balance, setBalance] = useState<BalanceGeneralData | null>(null);
  const [resultados, setResultados] = useState<EstadoResultadosData | null>(null);
  const [flujo, setFlujo] = useState<FlujoCajaData | null>(null);

  // Derivar el reporte activo directamente de la URL (Fuente de verdad)
  const activeReport = (() => {
    const path = location.pathname;
    if (path.includes('estado_resultados')) return 'resultados';
    if (path.includes('flujo_caja')) return 'flujo';
    return 'balance'; // default
  })();

  // Detectar sub-módulo específico
  const subSection = (() => {
    const path = location.pathname;
    if (path.includes('activos')) return 'activos';
    if (path.includes('pasivos')) return 'pasivos';
    if (path.includes('patrimonio')) return 'patrimonio';
    if (path.includes('entradas')) return 'entradas';
    if (path.includes('salidas')) return 'salidas';
    if (path.includes('balance') && path.includes('flujo_caja')) return 'balance';
    return 'general';
  })();

  useEffect(() => {
    const loadData = async () => {
      if (activeReport === 'balance') setBalance(await getBalanceGeneral());
      if (activeReport === 'resultados') setResultados(await getEstadoResultados());
      if (activeReport === 'flujo') setFlujo(await getFlujoCaja());
    };
    loadData();
  }, [activeReport, getBalanceGeneral, getEstadoResultados, getFlujoCaja]);

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <PageHeader 
          title="Inteligencia Financiera" 
          description="Estados financieros bajo estándares corporativos y análisis de liquidez en tiempo real."
          icon={<IconWallet size={28} className="text-primary-900" />}
        />
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-primary-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary-600 hover:bg-primary-50 transition-all shadow-sm">
              <IconPrinter size={16} /> Imprimir
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-900 border border-primary-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-primary-800 transition-all shadow-xl shadow-primary-200">
              <IconDownload size={16} /> Exportar Reporte
           </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
           <Loader />
           <div className="text-center space-y-2">
              <p className="text-[11px] font-black text-primary-900 uppercase tracking-[0.3em]">Cargando Módulo {subSection.toUpperCase()}</p>
              <p className="text-[10px] text-primary-400 font-bold">Consolidando información financiera real...</p>
           </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-700">
          {activeReport === 'balance' && balance && (
            <>
               {subSection === 'activos' && <AssetsReport data={balance.activos} />}
               {subSection === 'pasivos' && <LiabilitiesReport data={balance.pasivos} />}
               {subSection === 'patrimonio' && <EquityReport data={balance.patrimonio} />}
               {subSection === 'general' && <BalanceGeneralReport data={balance} />}
            </>
          )}

          {activeReport === 'resultados' && resultados && (
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-8 border-none bg-primary-50/50 border border-primary-100">
                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Ingresos Totales</p>
                    <p className="text-3xl font-black text-primary-900">${resultados.ingresos.toLocaleString()}</p>
                  </Card>
                  <Card className="p-8 border-none bg-danger-50/50 border border-danger-100">
                    <p className="text-[10px] font-black text-danger-400 uppercase tracking-widest mb-1">Costos de Venta</p>
                    <p className="text-3xl font-black text-danger-900">${resultados.costos.toLocaleString()}</p>
                  </Card>
                  <Card className="p-8 border-none bg-success-50/50 border border-success-100">
                    <p className="text-[10px] font-black text-success-400 uppercase tracking-widest mb-1">Utilidad Bruta</p>
                    <p className="text-3xl font-black text-success-900">${resultados.utilidad_bruta.toLocaleString()}</p>
                  </Card>
               </div>
            </div>
          )}
          
          {activeReport === 'flujo' && flujo && (
             <CashFlowSubReport 
               data={flujo} 
               mode={(subSection === 'entradas' || subSection === 'salidas' || subSection === 'balance') ? subSection : 'balance'} 
             />
          )}
        </div>
      )}
    </PageContainer>
  );
}
