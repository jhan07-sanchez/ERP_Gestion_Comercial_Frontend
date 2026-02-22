// src/modules/dashboard/pages/Dashboard.tsx

import { Card, Button } from "@/components/ui";
import { KPICard } from "../components/KPICard";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  IconBoxSeam,
  IconReportMoney,
  IconUsers,
  IconClipboardList,
} from "@tabler/icons-react";

export default function Dashboard() {
  const { data, isLoading, error, refresh } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card>
          <Card.Content>
            <p className="text-red-600">{error}</p>
            <Button onClick={refresh} className="mt-4">
              Reintentar
            </Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const { kpis } = data;

  // 🎯 Configuración dinámica y tipada
  const kpiConfig = [
    {
      title: "Ventas Totales",
      value: `$${kpis.totalSales.toLocaleString()}`,
      trend: kpis.salesTrend,
      percentage: kpis.salesPercentage,
      variant: "primary" as const,
      icon: IconReportMoney,
    },
    {
      title: "Nuevos Clientes",
      value: kpis.newCustomers,
      trend: kpis.customersTrend,
      percentage: kpis.customersPercentage,
      variant: "success" as const,
      icon: IconUsers,
    },
    {
      title: "Pedidos Pendientes",
      value: kpis.pendingOrders,
      trend: kpis.ordersTrend,
      percentage: kpis.ordersPercentage,
      variant: "warning" as const,
      icon: IconClipboardList,
    },
    {
      title: "Productos Bajo Stock",
      value: kpis.lowStockProducts,
      trend: kpis.stockTrend,
      percentage: kpis.stockPercentage,
      variant: "danger" as const,
      icon: IconBoxSeam,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen general del negocio</p>
        </div>

        <Button variant="secondary" onClick={refresh}>
          Actualizar
        </Button>
      </div>

      {/* KPIs */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiConfig.map((kpi) => {
            const Icon = kpi.icon;

            return (
              <KPICard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value}
                trend={kpi.trend}
                percentage={kpi.percentage}
                variant={kpi.variant}
                icon={<Icon size={24} stroke={2} className="text-current" />}
              />
            );
          })}
        </div>
      </section>

      {/* Actividades Recientes */}
      <section>
        <Card>
          <Card.Content>
            <h2 className="text-lg font-semibold mb-4">
              Actividades Recientes
            </h2>

            <div className="space-y-3">
              {data.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b pb-2 last:border-none"
                >
                  <div>
                    <p className="text-sm text-gray-800">
                      {activity.descripcion}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <span className="text-xs px-2 py-1 rounded bg-gray-100">
                    {activity.estado}
                  </span>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* Alertas del sistema */}
      <section>
        <Card>
          <Card.Content>
            <h2 className="text-lg font-semibold mb-4">Alertas del Sistema</h2>

            <div className="space-y-3">
              {data.systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded border border-yellow-200 bg-yellow-50"
                >
                  <p className="font-medium text-sm">{alert.title}</p>
                  <p className="text-xs text-gray-600">{alert.message}</p>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </section>
    </div>
  );
}
