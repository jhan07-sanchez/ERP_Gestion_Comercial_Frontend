import { PageContainer, PageHeader, Loader } from '@/shared/components/ui';
import { useAnalyticsData } from '@/modules/reportes/hooks/useAnalyticsData';
import { AnalyticsKPIs } from '@/modules/reportes/components/analytics/AnalyticsKPIs';
import { 
  IconChartLine, IconRefresh, IconAlertTriangle,
  IconReportMoney, IconChartBar, IconReceipt, IconUsers, IconPercentage, IconBoxSeam, IconTrendingUp, IconCashBanknote, IconShoppingCart, IconTruck, IconClock, IconCalculator, IconRotateClockwise, IconDeviceFloppy, IconBuildingWarehouse, IconActivity
} from '@tabler/icons-react';
import { Button } from '@/shared/components/ui';

export default function DashboardKPIsPage() {
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
              <h3 className="text-xl font-black text-danger-900 uppercase tracking-tight">Error de KPIs</h3>
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
          title="Inteligencia de Negocios (KPIs)"
          description="Centro de comando métrico empresarial. Visualización de rendimientos multidimensionales."
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
        <div className="space-y-12 animate-in fade-in duration-500 pb-16">
          
          {/* SECCIÓN FINANCIERA */}
          <section>
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center"><IconReportMoney size={18} /></div>
                <h2 className="text-sm font-black text-primary-800 uppercase tracking-widest">Rendimiento Financiero</h2>
             </div>
             <AnalyticsKPIs metrics={[
               { title: "Ventas Diarias", metric: data.kpis.financieros.ventasDiarias, type: 'currency', icon: <IconReportMoney size={20} />, variant: 'primary' },
               { title: "Ingresos Mensuales", metric: data.kpis.financieros.ventasMensuales, type: 'currency', icon: <IconChartBar size={20} />, variant: 'success' },
               { title: "Utilidad Neta", metric: data.kpis.financieros.utilidadNeta, type: 'currency', icon: <IconTrendingUp size={20} />, variant: 'success' },
               { title: "Margen de Ganancia", metric: data.kpis.financieros.margenGanancia, type: 'percentage', icon: <IconPercentage size={20} />, variant: 'warning' },
               { title: "Ticket Promedio", metric: data.kpis.financieros.ticketPromedio, type: 'currency', icon: <IconReceipt size={20} />, variant: 'primary' },
               { title: "Flujo de Caja", metric: data.kpis.financieros.flujoCaja, type: 'currency', icon: <IconCashBanknote size={20} />, variant: 'success' },
             ]} />
          </section>

          {/* SECCIÓN COMERCIAL */}
          <section>
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-success-100 text-success-600 flex items-center justify-center"><IconShoppingCart size={18} /></div>
                <h2 className="text-sm font-black text-primary-800 uppercase tracking-widest">Desempeño Comercial</h2>
             </div>
             <AnalyticsKPIs metrics={[
               { title: "Clientes Nuevos", metric: data.kpis.comerciales.clientesNuevos, type: 'number', icon: <IconUsers size={20} />, variant: 'success' },
               { title: "Tasa de Recompra", metric: data.kpis.comerciales.tasaRecompra, type: 'percentage', icon: <IconRotateClockwise size={20} />, variant: 'primary' },
               { title: "Pedidos Completados", metric: data.kpis.comerciales.pedidosCompletados, type: 'number', icon: <IconShoppingCart size={20} />, variant: 'success' },
               { title: "Pedidos Pendientes", metric: data.kpis.comerciales.pedidosPendientes, type: 'number', icon: <IconClock size={20} />, variant: 'warning' },
               { title: "Conversión de Ventas", metric: data.kpis.comerciales.conversionVentas, type: 'percentage', icon: <IconChartLine size={20} />, variant: 'primary' },
               { title: "Pedidos Cancelados", metric: data.kpis.comerciales.pedidosCancelados, type: 'number', icon: <IconAlertTriangle size={20} />, variant: 'danger' },
             ]} />
          </section>

          {/* SECCIÓN INVENTARIO */}
          <section>
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-warning-100 text-warning-600 flex items-center justify-center"><IconBuildingWarehouse size={18} /></div>
                <h2 className="text-sm font-black text-primary-800 uppercase tracking-widest">Métricas de Inventario</h2>
             </div>
             <AnalyticsKPIs metrics={[
               { title: "Valorización Stock", metric: data.kpis.inventario.valorizacionStock, type: 'currency', icon: <IconDeviceFloppy size={20} />, variant: 'primary' },
               { title: "Rotación (Días)", metric: data.kpis.inventario.rotacionInventario, type: 'number', icon: <IconRefresh size={20} />, variant: 'warning' },
               { title: "Productos Agotados", metric: data.kpis.inventario.productosAgotados, type: 'number', icon: <IconAlertTriangle size={20} />, variant: 'danger' },
               { title: "Stock Crítico", metric: data.kpis.inventario.stockCritico, type: 'number', icon: <IconBoxSeam size={20} />, variant: 'danger' },
               { title: "Movimientos In/Out", metric: data.kpis.inventario.movimientosInventario, type: 'number', icon: <IconTruck size={20} />, variant: 'primary' },
               { title: "Más Vendidos (Qty)", metric: data.kpis.inventario.productosMasVendidos, type: 'number', icon: <IconTrendingUp size={20} />, variant: 'success' },
             ]} />
          </section>

          {/* SECCIÓN OPERATIVA */}
          <section>
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center"><IconActivity size={18} /></div>
                <h2 className="text-sm font-black text-primary-800 uppercase tracking-widest">Eficiencia Operativa</h2>
             </div>
             <AnalyticsKPIs metrics={[
               { title: "Rendimiento Diario", metric: data.kpis.operativos.rendimientoDiario, type: 'percentage', icon: <IconActivity size={20} />, variant: 'primary' },
               { title: "Eficiencia General", metric: data.kpis.operativos.eficienciaOperativa, type: 'percentage', icon: <IconCalculator size={20} />, variant: 'success' },
               { title: "Tiempo Prom. Venta", metric: data.kpis.operativos.tiempoPromedioVenta, type: 'time', icon: <IconClock size={20} />, variant: 'warning' },
               { title: "Tiempo Facturación", metric: data.kpis.operativos.tiempoPromedioFacturacion, type: 'time', icon: <IconReceipt size={20} />, variant: 'success' },
               { title: "Movimientos Caja", metric: data.kpis.operativos.movimientosCaja, type: 'number', icon: <IconCashBanknote size={20} />, variant: 'primary' },
               { title: "Gastos vs Ingresos", metric: data.kpis.operativos.gastosVsIngresos, type: 'percentage', icon: <IconChartBar size={20} />, variant: 'warning' },
             ]} />
          </section>
        </div>
      ) : null}
    </PageContainer>
  );
}
