// src/modules/dashboard/pages/Dashboard.tsx

import { Card, Button } from '@/components/ui';
import { KPICard } from '../components/KPICard';
import { useDashboardData } from '../hooks/useDashboardData';
import { IconBoxSeam, IconReportMoney } from "@tabler/icons-react";

/**
 * Página principal del Dashboard
 * Muestra KPIs, actividades recientes, alertas y acciones rápidas
 */
export default function Dashboard() {
  const { data, isLoading, error, refresh } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen general de tu negocio</p>
        </div>
        <Button variant="secondary" onClick={refresh}>
          Actualizar
        </Button>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Productos en almacén"
          value={data.kpis.totalProducts}
          trend={data.kpis.productsTrend}
          percentage={data.kpis.productsPercentage}
          variant="primary"
          icon={
            <IconBoxSeam
              size={24} // Tamaño en píxeles (equivalente a w-6 h-6)
              className="text-blue-600" // Puedes seguir usando tus clases de Tailwind
              stroke={2} // Grosor de la línea
            />
          }
        />

        <KPICard
          title="Ventas del Mes"
          value={`$${data.kpis.totalSales.toLocaleString()}`}
          trend={data.kpis.salesTrend}
          percentage={data.kpis.salesPercentage}
          variant="primary"
          icon={
            <IconReportMoney
              size={24}
              className="text-blue-600"
              stroke={2}
            />
          }
        />

        <KPICard
          title="Pedidos Pendientes"
          value={data.kpis.pendingOrders}
          trend={data.kpis.ordersTrend}
          percentage={data.kpis.ordersPercentage}
          variant="warning"
          icon={
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
        />

        <KPICard
          title="Stock Bajo"
          value={data.kpis.lowStockProducts}
          trend={data.kpis.stockTrend}
          percentage={data.kpis.stockPercentage}
          variant="danger"
          icon={
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
        />

        <KPICard
          title="Clientes Nuevos"
          value={data.kpis.newCustomers}
          trend={data.kpis.customersTrend}
          percentage={data.kpis.customersPercentage}
          variant="success"
          icon={
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Resto del dashboard: actividades, alertas, etc. */}
    </div>
  );
}