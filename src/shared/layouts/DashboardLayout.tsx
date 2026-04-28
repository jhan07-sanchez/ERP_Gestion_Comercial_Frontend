// src/layouts/DashboardLayout.tsx
/**
 * 🏗️ LAYOUT PRINCIPAL DEL DASHBOARD (VERSIÓN ERP PROFESIONAL)
 *
 * Este layout utiliza una arquitectura modular para la barra lateral (Sidebar)
 * y el contenido principal, permitiendo estados persistentes y una UX premium.
 */
import { Outlet } from "react-router-dom";
import { useUIStore } from "@/shared/store/ui.store";
import { Sidebar } from "./components/Sidebar";
import { MobileHeader } from "./components/MobileHeader";
import { CajaBanner } from "../components/CajaBanner";
import { TrialBanner } from "../components/TrialBanner";

export default function DashboardLayout() {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-primary-50 flex overflow-hidden">
      {/* Sidebar Modular (Ancho fijo controlado por el store) */}
      <Sidebar />

      {/* Área de Contenido Principal */}
      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden transition-all duration-300 ease-in-out
          ${sidebarOpen ? "lg:pl-72" : "lg:pl-20"} pl-0`}
      >
        {/* Header para Móviles */}
        <MobileHeader />

        {/* Banners Superiores */}
        <div className="flex flex-col w-full">
          <TrialBanner />
          <CajaBanner />
        </div>

        {/* Contenido de la Página con Scroll independiente */}
        <main 
          key="erp-main-content"
          className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar bg-[#f8fafc]"
        >
          <Outlet />
        </main>

        {/* Footer Corporativo ERP */}
        <footer className="py-4 px-4 md:px-8 text-center bg-white border-t border-primary-100 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="text-[10px] font-black text-primary-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} ERP System · Gestión empresarial avanzada
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-bold text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full uppercase">
              v1.0
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
