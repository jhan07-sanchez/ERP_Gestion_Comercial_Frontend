// src/modules/dashboard/pages/Dashboard.tsx
import React from 'react';
import { Card, Button, Badge, PageContainer, PageHeader } from "@/shared/components/ui";
import { KPICard } from "../components/KPICard";
import { ActivityFeed } from "../components/ActivityFeed";
import { AlertList } from "../components/AlertList";
import { useDashboardData } from "../hooks/useDashboardData";
import { useNavigate } from "react-router-dom";
import {
  IconBoxSeam,
  IconReportMoney,
  IconUsers,
  IconClipboardList,
  IconRefresh,
  IconBolt,
  IconHistory,
  IconBell
} from "@tabler/icons-react";

export default function Dashboard() {
  const { data, isLoading, error, refresh } = useDashboardData();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8 animate-pulse">
          <div className="h-20 bg-slate-50 border border-slate-100 rounded-3xl w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-50 border border-slate-100 rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[500px] bg-slate-50 border border-slate-100 rounded-3xl" />
            <div className="h-[500px] bg-slate-50 border border-slate-100 rounded-3xl" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full text-center space-y-6 bg-rose-50/50 p-10 rounded-3xl border border-rose-100 shadow-sm backdrop-blur-sm">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-200/50">
              <IconBoxSeam size={40} stroke={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-rose-900 uppercase tracking-tight">Error de Conexión</h3>
              <p className="text-sm text-rose-700 font-medium leading-relaxed">{error}</p>
            </div>
            <Button 
                onClick={refresh} 
                className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white border-none shadow-xl shadow-rose-200 font-black uppercase tracking-widest text-[10px]"
            >
              Reintentar Sincronización
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!data) return null;

  const { kpis } = data;

  const kpiConfig = [
    {
      title: "Ventas Totales",
      value: `$${kpis.totalSales.toLocaleString()}`,
      trend: kpis.salesTrend > 0 ? 'up' : 'down',
      percentage: Math.abs(kpis.salesPercentage),
      variant: "primary" as const,
      icon: <IconReportMoney size={24} stroke={2} />,
    },
    {
      title: "Nuevos Clientes",
      value: kpis.newCustomers.toString(),
      trend: kpis.customersTrend > 0 ? 'up' : 'down',
      percentage: Math.abs(kpis.customersPercentage),
      variant: "success" as const,
      icon: <IconUsers size={24} stroke={2} />,
    },
    {
      title: "Pedidos Pendientes",
      value: kpis.pendingOrders.toString(),
      trend: kpis.ordersTrend > 0 ? 'up' : 'down',
      percentage: Math.abs(kpis.ordersPercentage),
      variant: "warning" as const,
      icon: <IconClipboardList size={24} stroke={2} />,
    },
    {
      title: "Stock Crítico",
      value: kpis.lowStockProducts.toString(),
      trend: kpis.stockTrend > 0 ? 'up' : 'down',
      percentage: Math.abs(kpis.stockPercentage),
      variant: "danger" as const,
      icon: <IconBoxSeam size={24} stroke={2} />,
    },
  ];

  const handleSeeHistory = () => {
    navigate("/auditoria/lista");
  };

  return (
    <PageContainer>
      <PageHeader
        title="Panel de Control"
        subtitle="Resumen ejecutivo y métricas en tiempo real"
        icon={<IconBolt size={24} className="fill-blue-600/10" />}
        actions={
          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Última Sincronización</span>
                <span className="text-[11px] font-bold text-slate-700 tabular-nums">{new Date().toLocaleTimeString()}</span>
            </div>
            <Button
              variant="secondary"
              onClick={refresh}
              className="rounded-xl border-slate-200 shadow-sm hover:bg-slate-50 hover:border-blue-200 group transition-all h-10 px-5"
            >
              <IconRefresh size={18} className="group-active:rotate-180 transition-transform duration-500 mr-2 text-slate-500" />
              <span className="font-black uppercase tracking-widest text-[10px]">Actualizar</span>
            </Button>
          </div>
        }
      />

      <div className="space-y-10 pb-10">
        {/* KPI Grid */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {kpiConfig.map((kpi) => (
              <KPICard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value}
                trend={kpi.trend}
                percentage={kpi.percentage}
                variant={kpi.variant}
                icon={kpi.icon}
              />
            ))}
          </div>
        </section>

        {/* Dashboard Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column: Activity */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
                    <IconHistory size={20} stroke={2.5} />
                </div>
                <div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Actividad Reciente</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logs de sistema globales</p>
                </div>
              </div>
              <button
                onClick={handleSeeHistory}
                className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-all"
              >
                Ver Historial
              </button>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                <ActivityFeed activities={data.recentActivities} limit={5} />
            </Card>
          </section>

          {/* Sidebar Column: Alerts */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm border border-rose-100/50">
                    <IconBell size={20} stroke={2.5} />
                </div>
                <div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Alertas Críticas</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prioridad del día</p>
                </div>
              </div>
              <Badge variant="danger" size="sm" className="font-black px-2 shadow-sm">
                {data.systemAlerts.length}
              </Badge>
            </div>

            <Card className="border-slate-200 shadow-sm bg-slate-50/30 overflow-hidden">
                <AlertList alerts={data.systemAlerts} />

                {data.systemAlerts.length > 4 && (
                    <button className="w-full py-4 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest border-t border-slate-200 bg-white transition-all">
                        Explorar todas las alertas
                    </button>
                )}
            </Card>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
