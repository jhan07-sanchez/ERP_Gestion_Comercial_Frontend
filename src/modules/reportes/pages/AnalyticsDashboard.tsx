import { PageContainer, PageHeader, Loader, Button } from '@shared/components/ui';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { AnalyticsKPIs } from '../components/analytics/AnalyticsKPIs';
import { SalesTrendChart } from '../components/analytics/SalesTrendChart';
import { TopProductsAnalysis } from '../components/analytics/TopProductsAnalysis';
import { CategoryPerformanceChart } from '../components/analytics/CategoryPerformanceChart';
import { AnalyticsFilters } from '../components/analytics/AnalyticsFilters';
import {
  IconChartLine,
  IconRefresh,
  IconAlertTriangle,
  IconReportMoney,
  IconPercentage,
  IconUsers,
  IconShoppingCart,
  IconBoxSeam,
  IconTrendingUp
} from '@tabler/icons-react';

export default function AnalyticsDashboard() {
  const {
    data,
    isLoading,
    error,
    dateRange,
    setDateRange,
    filters,
    updateFilters,
    refresh
  } = useAnalyticsData();

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
            <Button
              onClick={refresh}
              className="w-full h-12 bg-danger-600 hover:bg-danger-700 text-white border-none shadow-xl shadow-danger-200 font-black uppercase tracking-widest text-xs"
            >
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
          title="Inteligencia de Negocios"
          description="KPIs, rendimiento financiero y análisis de rotación de inventario."
          icon={<IconChartLine size={28} className="text-accent-600" />}
        />

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-primary-100 h-fit">
          {(['7d', '30d', '90d', 'ytd'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${dateRange === range
                  ? 'bg-accent-600 text-white shadow-md'
                  : 'text-primary-500 hover:bg-primary-50'
                }`}
            >
              {range === '7d' ? '7 Días' : range === '30d' ? '30 Días' : range === '90d' ? '3 Meses' : 'Año Act.'}
            </button>
          ))}
          <div className="w-px h-6 bg-primary-100 mx-1" />
          <button onClick={refresh} className="p-2 text-primary-400 hover:text-accent-600 transition-colors">
            <IconRefresh size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <AnalyticsFilters
        currentFilters={filters}
        onFilterChange={updateFilters}
      />

      {isLoading && !data ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : data ? (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
          {/* SECCIÓN 1: KPIs Principales */}
          <section>
            <h2 className="text-xs font-black text-primary-400 uppercase tracking-widest mb-4">Métricas Clave de Rendimiento</h2>
            <AnalyticsKPIs metrics={[
              {
                title: 'Ventas Diarias',
                metric: data.kpis.financieros.ventasDiarias,
                type: 'currency',
                icon: <IconReportMoney size={20} />,
                variant: 'primary'
              },
              {
                title: 'Margen de Ganancia',
                metric: data.kpis.financieros.margenGanancia,
                type: 'percentage',
                icon: <IconPercentage size={20} />,
                variant: 'success'
              },
              {
                title: 'Clientes Nuevos',
                metric: data.kpis.comerciales.clientesNuevos,
                type: 'number',
                icon: <IconUsers size={20} />,
                variant: 'primary'
              },
              {
                title: 'Pedidos Pendientes',
                metric: data.kpis.comerciales.pedidosPendientes,
                type: 'number',
                icon: <IconShoppingCart size={20} />,
                variant: 'warning'
              },
              {
                title: 'Stock Crítico',
                metric: data.kpis.inventario.stockCritico,
                type: 'number',
                icon: <IconBoxSeam size={20} />,
                variant: 'danger'
              },
              {
                title: 'Eficiencia Operativa',
                metric: data.kpis.operativos.eficienciaOperativa,
                type: 'percentage',
                icon: <IconTrendingUp size={20} />,
                variant: 'success'
              }
            ]} />
          </section>

          {/* SECCIÓN 2: Tendencias y Rendimiento de Categorías */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SalesTrendChart data={data.charts.salesTrend} />
            </div>
            <div className="lg:col-span-1">
              <CategoryPerformanceChart data={data.charts.categoryPerformance} />
            </div>
          </section>

          {/* SECCIÓN 3: Análisis de Rotación e Inventario */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TopProductsAnalysis
              topProducts={data.charts.topProducts}
              lowRotation={data.charts.lowRotationProducts}
            />
            {/* Espacio para futuras expansiones (ej: mapas de calor, análisis de cohortes) */}
            <div className="bg-gradient-to-br from-primary-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <IconChartLine size={24} className="text-accent-400" />
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2">Análisis Predictivo</h3>
                <p className="text-sm text-primary-200 font-medium leading-relaxed max-w-sm">
                  Basado en las tendencias actuales, se proyecta un incremento del 12% en ventas de la categoría "Cómputo" para el próximo trimestre.
                </p>
              </div>
              <div className="relative z-10 mt-8">
                <Button className="bg-accent-600 hover:bg-accent-500 text-white border-none text-xs uppercase tracking-widest font-black">
                  Ver Reporte Predictivo Completo
                </Button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </PageContainer>
  );
}
