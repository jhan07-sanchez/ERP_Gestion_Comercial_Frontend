// src/modules/dashboard/pages/Dashboard.tsx
import { Card, Button, Badge } from "@/components/ui";
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
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-gray-100 rounded-lg"></div>
          <div className="h-10 w-32 bg-gray-100 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-50 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-50 rounded-2xl"></div>
          <div className="h-96 bg-gray-50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md border-red-100 bg-red-50">
          <Card.Content className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconBoxSeam size={32} />
            </div>
            <h3 className="text-lg font-bold text-red-900 mb-2">Error de Conexión</h3>
            <p className="text-sm text-red-700 mb-6">{error}</p>
            <Button onClick={refresh} className="w-full bg-red-600 hover:bg-red-700 text-white border-none">
              Reintentar Conexión
            </Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const { kpis } = data;

  const kpiConfig = [
    {
      title: "Ventas Totales",
      value: `$${kpis.totalSales.toLocaleString()}`,
      trend: kpis.salesTrend,
      percentage: kpis.salesPercentage,
      variant: "primary" as const,
      icon: <IconReportMoney size={24} stroke={2} />,
    },
    {
      title: "Nuevos Clientes",
      value: kpis.newCustomers,
      trend: kpis.customersTrend,
      percentage: kpis.customersPercentage,
      variant: "success" as const,
      icon: <IconUsers size={24} stroke={2} />,
    },
    {
      title: "Pedidos Pendientes",
      value: kpis.pendingOrders,
      trend: kpis.ordersTrend,
      percentage: kpis.ordersPercentage,
      variant: "warning" as const,
      icon: <IconClipboardList size={24} stroke={2} />,
    },
    {
      title: "Productos Bajo Stock",
      value: kpis.lowStockProducts,
      trend: kpis.stockTrend,
      percentage: kpis.stockPercentage,
      variant: "danger" as const,
      icon: <IconBoxSeam size={24} stroke={2} />,
    },
  ];

  const handleSeeHistory = () => {
    navigate("/auditorias/actividad_reciente");
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Premium */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-200">
              <IconBolt size={18} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Control</h1>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest ml-9">Resumen Ejecutivo · ERP Enterprise</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Última actualización</span>
            <span className="text-xs font-bold text-gray-600">{new Date().toLocaleTimeString()}</span>
          </div>
          <Button
            variant="secondary"
            onClick={refresh}
            className="rounded-xl border-gray-100 shadow-sm hover:bg-white hover:border-blue-200 group transition-all"
          >
            <IconRefresh size={18} className="group-active:rotate-180 transition-transform duration-500 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Grid de KPIs */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Cuerpo del Dashboard: Actividad y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Principal: Actividad */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
              <IconHistory size={20} className="text-blue-600" />
              Actividad Reciente
            </h2>
            <button
              onClick={handleSeeHistory}
              className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest"
            >
              Ver todo el historial
            </button>
          </div>

          <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
            <Card.Content className="p-8">
              <ActivityFeed activities={data.recentActivities} limit={5} />
            </Card.Content>
          </Card>
        </section>

        {/* Columna Lateral: Alertas */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
              <IconBell size={20} className="text-amber-600" />
              Alertas Prioritarias
            </h2>
            <Badge variant="gray" size="sm" className="font-black">
              {data.systemAlerts.length}
            </Badge>
          </div>

          <Card className="border-none shadow-sm ring-1 ring-gray-100 bg-gray-50/30 overflow-hidden">
            <Card.Content className="p-4">
              <AlertList alerts={data.systemAlerts} />

              {data.systemAlerts.length > 3 && (
                <button className="w-full mt-4 py-3 text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest border-t border-dashed border-gray-200 transition-colors">
                  Mostrar todas las alertas
                </button>
              )}
            </Card.Content>
          </Card>
        </section>
      </div>
    </div>
  );
}
