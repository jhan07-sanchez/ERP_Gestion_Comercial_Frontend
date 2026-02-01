// src/modules/dashboard/index.ts

/**
 * Punto de entrada del módulo Dashboard
 * Exporta todo lo necesario para usar el módulo desde fuera
 */

// Página principal
export { default as Dashboard } from './pages/Dashboard';

// Componentes reutilizables
export { KPICard } from './components/KPICard';

// Hooks
export { useDashboardData } from './hooks/useDashboardData';

// API
export { dashboardAPI } from './api/dashboard.api';

// Tipos
export type {
  KPIStats,
  RecentActivity,
  SystemAlert,
  DashboardData,
  DashboardFilters,
} from './types';