// src/modules/dashboard/pages/Dashboard.tsx

import { PageContainer } from "@/shared/components/ui";
import { DashboardHeader } from "../components/DashboardHeader";
import { KPIGrid } from "../components/KPIGrid";
import { ChartsSection } from "../components/ChartsSection";
import { AlertsPanel } from "../components/AlertsPanel";
import { CashWidget } from "../components/CashWidget";
import { ActivityTable } from "../components/ActivityTable";
import { useDashboardData } from "../hooks/useDashboardData";
import { IconBoxSeam, IconHistory, IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/shared/components/ui";

export default function Dashboard() {
  const { 
    data, 
    isLoading, 
    isRefreshing, 
    error, 
    filters, 
    setMode, 
    refresh 
  } = useDashboardData();

  if (error && !data) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full text-center space-y-6 bg-danger-50/50 p-10 rounded-3xl border border-danger-100 shadow-sm backdrop-blur-sm">
            <div className="w-20 h-20 bg-danger-100 text-danger-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-danger-200/50">
              <IconAlertTriangle size={40} stroke={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-danger-900 uppercase tracking-tight">Error de Conexión</h3>
              <p className="text-sm text-danger-700 font-medium leading-relaxed">{error}</p>
            </div>
            <Button 
                onClick={refresh} 
                className="w-full h-12 bg-danger-600 hover:bg-danger-700 text-white border-none shadow-xl shadow-danger-200 font-black uppercase tracking-widest text-xs"
            >
              Reintentar Sincronización
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (isLoading || !data) {
    return (
      <PageContainer>
        <div className="space-y-8 animate-pulse">
          <div className="h-40 bg-primary-100 rounded-3xl w-full" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-primary-100 rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[400px] bg-primary-100 rounded-3xl" />
            <div className="h-[400px] bg-primary-100 rounded-3xl" />
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="relative">
        {/* Sync Indicator for Polling */}
        {isRefreshing && (
          <div className="fixed bottom-10 right-10 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-accent-100 shadow-2xl animate-in fade-in slide-in-from-bottom-5">
            <IconRefresh size={14} className="text-accent-600 animate-spin" />
            <span className="text-[10px] font-black text-accent-600 uppercase tracking-widest">Sincronizando...</span>
          </div>
        )}

        <DashboardHeader 
          mode={filters.mode} 
          onModeChange={setMode} 
          onRefresh={refresh}
          lastSync={new Date().toISOString()} 
        />

        <div className="space-y-10 pb-16">
          <section>
            <KPIGrid kpis={data.kpis} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Area (8 columns) */}
            <div className="lg:col-span-8 space-y-10">
              {filters.mode === 'executive' ? (
                <>
                  <ChartsSection charts={data.charts} />
                  <section className="space-y-6">
                      <div className="flex items-center gap-3 px-2">
                          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                              <IconHistory size={20} />
                          </div>
                          <div>
                              <h2 className="text-sm font-black text-primary-800 uppercase tracking-tight">Actividad Reciente</h2>
                              <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Logs de sistema globales</p>
                          </div>
                      </div>
                      <ActivityTable activities={data.recentActivities} />
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-6">
                      <div className="flex items-center gap-3 px-2">
                          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                              <IconHistory size={20} />
                          </div>
                          <div>
                              <h2 className="text-sm font-black text-primary-800 uppercase tracking-tight">Operaciones del Día</h2>
                              <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Últimas acciones registradas</p>
                          </div>
                      </div>
                      <ActivityTable activities={data.recentActivities} />
                  </section>
                  <div className="pt-4">
                      <ChartsSection charts={data.charts} />
                  </div>
                </>
              )}
            </div>

            {/* Sidebar Area (4 columns) */}
            <aside className="lg:col-span-4 space-y-10">
              <section>
                <CashWidget cash={data.cash} />
              </section>

              <section>
                <AlertsPanel alerts={data.systemAlerts} />
              </section>
              
              <div className="rounded-3xl bg-gradient-to-br from-accent-600 to-accent-700 p-8 text-white shadow-xl shadow-accent-200/50 relative overflow-hidden group">
                  <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10 space-y-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                          <IconBoxSeam size={24} />
                      </div>
                      <div>
                          <h3 className="text-lg font-black uppercase tracking-tight">Optimiza tu Stock</h3>
                          <p className="text-xs font-medium text-white/80 leading-relaxed">
                              Hemos detectado que hay alertas de stock pendientes. Genera una orden de compra ahora.
                          </p>
                      </div>
                      <Button variant="secondary" className="bg-white text-accent-700 border-none font-black text-[10px] uppercase tracking-widest h-10 w-full hover:bg-primary-50 transition-all shadow-lg active:scale-95">
                          Ver sugerencias de compra
                      </Button>
                  </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}


