// src/layouts/DashboardLayout.tsx
/**
 * 🏗️ LAYOUT PRINCIPAL DEL DASHBOARD (VERSIÓN ERP PROFESIONAL)
 *
 * Arquitectura responsive:
 * - Mobile  (< 768px):  Sin padding-left (sidebar es overlay)
 * - Tablet  (768–1023px): padding-left = 72px (sidebar colapsado fijo)
 * - Desktop (≥ 1024px):  padding-left = 260px o 72px según toggle
 *
 * El sidebar es `position: fixed`, por lo tanto el contenido
 * necesita `padding-left` para no quedar debajo en tablet/desktop.
 */
import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { MobileHeader } from "./components/MobileHeader";
import { CajaBanner } from "../components/CajaBanner";
import { TrialBanner } from "../components/TrialBanner";
import { useResponsiveSidebar } from "@/shared/hooks/useResponsiveSidebar";

/** Anchos sincronizados con Sidebar.tsx */
const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 72;

export default function DashboardLayout() {
  const { sidebarOpen, isMobile, isFixed } = useResponsiveSidebar();

  // Calcular padding-left basado en el estado responsive
  const paddingLeft = isMobile
    ? 0
    : sidebarOpen
      ? SIDEBAR_EXPANDED
      : SIDEBAR_COLLAPSED;

  return (
    <div className="min-h-screen bg-primary-50 flex overflow-hidden">
      {/* Sidebar Modular */}
      <Sidebar />

      {/* Área de Contenido Principal */}
      <div
        className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden transition-[padding] duration-300 ease-in-out"
        style={{ paddingLeft }}
      >
        {/* Header para Móviles — solo visible < md */}
        <MobileHeader />

        {/* Banners Superiores */}
        <div className="flex flex-col w-full">
          <TrialBanner />
          <CajaBanner />
        </div>

        {/* Contenido de la Página */}
        <main
          key="erp-main-content"
          className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar bg-primary-50"
        >
          <Outlet />
        </main>

        {/* Footer Corporativo */}
        <footer className="py-3 px-4 md:px-6 text-center bg-white border-t border-primary-100 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="text-[10px] font-medium text-primary-400 tracking-wide">
            &copy; {new Date().getFullYear()} ERP System · Gestión empresarial
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">
              v1.0
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
