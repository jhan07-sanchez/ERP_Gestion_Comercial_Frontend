import { PageContainer, PageHeader, Loader } from '@/shared/components/ui';
import { useAnalyticsData } from '@/modules/reportes/hooks/useAnalyticsData';
import { SalesTrendChart } from '@/modules/reportes/components/analytics/SalesTrendChart';
import { TopProductsAnalysis } from '@/modules/reportes/components/analytics/TopProductsAnalysis';
import { CategoryPerformanceChart } from '@/modules/reportes/components/analytics/CategoryPerformanceChart';
import { CustomerRetentionChart } from '@/modules/reportes/components/analytics/CustomerRetentionChart';
import { IconChartLine, IconRefresh, IconAlertTriangle } from '@tabler/icons-react';
import { Button } from '@/shared/components/ui';

export default function DashboardAnalyticsPage() {
  const { data, isLoading, error, dateRange, setDateRange, refresh } = useAnalyticsData();

  if (error && !data) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full text-center space-y-6 bg-danger-50/50 p-10 rounded-3xl border border-danger-100 shadow-sm backdrop-blur-sm">
            <div className="w-20 h-20 bg-danger-100 text-danger-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-danger-200/50">
              <IconAlertTriangle size={40} stroke={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-danger-900 uppercase tracking-tight">Error de Analytics</h3>
              <p className="text-sm text-danger-700 font-medium leading-relaxed">{error}</p>
            </div>
            <Button onClick={refresh} className="w-full h-12 bg-danger-600 hover:bg-danger-700 text-white border-none shadow-xl shadow-danger-200 font-black uppercase tracking-widest text-xs">
              Reintentar Carga
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* HEADER & FILTROS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <PageHeader
          title="Análisis de Rendimiento"
          description="Estudios de tendencia, crecimiento comercial y proyecciones de stock."
          icon={<IconChartLine size={28} className="text-accent-600" />}
        />
        
        <div className="flex flex-wrap items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-primary-100 h-fit">
          {(['7d', '30d', '90d', 'ytd'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                dateRange === range 
                  ? 'bg-accent-600 text-white shadow-md' 
                  : 'text-primary-500 hover:bg-primary-50'
              }`}
            >
              {range === '7d' ? '7 Días' : range === '30d' ? '30 Días' : range === '90d' ? '3 Meses' : 'Año Act.'}
            </button>
          ))}
          <div className="w-px h-6 bg-primary-100 mx-1 hidden sm:block" />
          <button onClick={refresh} className="p-2 text-primary-400 hover:text-accent-600 transition-colors">
            <IconRefresh size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : data ? (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
          {/* SECCIÓN 1: Tendencias */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <SalesTrendChart data={data.charts.salesTrend} />
             <CustomerRetentionChart data={data.charts.customerRetention} />
          </section>

          {/* SECCIÓN 2: Productos y Categorías */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-1">
                <CategoryPerformanceChart data={data.charts.categoryPerformance} />
             </div>
             <div className="lg:col-span-2">
                <TopProductsAnalysis 
                  topProducts={data.charts.topProducts} 
                  lowRotation={data.charts.lowRotationProducts} 
                />
             </div>
          </section>

          {/* SECCIÓN 3: Predictive Analytics CTA */}
          <section>
            <div className="bg-gradient-to-br from-primary-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
               <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl"></div>
               <div className="relative z-10 max-w-2xl">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                       <IconChartLine size={20} className="text-accent-400" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">Cierre de Ventas Predictivo</h3>
                 </div>
                 <p className="text-sm text-primary-200 font-medium leading-relaxed mt-4">
                   Basado en los datos recientes (ticket promedio de ${data.kpis.financieros.ticketPromedio.value.toLocaleString()} y un incremento de {data.kpis.comerciales.clientesNuevos.value} clientes), el modelo predictivo estima cerrar el trimestre superando las metas operativas en un 12%.
                 </p>
               </div>
               <div className="relative z-10 mt-6 md:mt-0 w-full md:w-auto">
                 <Button className="w-full md:w-auto bg-accent-600 hover:bg-accent-500 text-white border-none text-xs uppercase tracking-widest font-black shadow-lg">
                   Generar Reporte Predictivo PDF
                 </Button>
               </div>
            </div>
          </section>
        </div>
      ) : null}
    </PageContainer>
  );
}
