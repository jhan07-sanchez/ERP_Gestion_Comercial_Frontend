/**
 * Hook para gestionar el sidebar de forma responsive.
 *
 * Breakpoints:
 * - < 768px (mobile):  Sidebar oculto, se abre como overlay
 * - 768–1023px (tablet): Sidebar visible pero colapsado (solo iconos)
 * - ≥ 1024px (desktop):  Sidebar visible, toggle libre del usuario
 *
 * Usa el store de UI existente sin duplicar estado.
 */
import { useEffect, useRef, useCallback } from "react";
import { useUIStore } from "@/shared/store/ui.store";

/** Breakpoints estándar de Tailwind */
const BREAKPOINT_MD = 768;
const BREAKPOINT_LG = 1024;

type ScreenSize = "mobile" | "tablet" | "desktop";

function getScreenSize(width: number): ScreenSize {
  if (width < BREAKPOINT_MD) return "mobile";
  if (width < BREAKPOINT_LG) return "tablet";
  return "desktop";
}

export function useResponsiveSidebar() {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore();
  const prevScreenSize = useRef<ScreenSize>(getScreenSize(window.innerWidth));
  const userPreference = useRef<boolean>(sidebarOpen);

  const handleResize = useCallback(() => {
    const currentSize = getScreenSize(window.innerWidth);
    const prevSize = prevScreenSize.current;

    // Solo actuar cuando CAMBIA el breakpoint
    if (currentSize === prevSize) return;

    prevScreenSize.current = currentSize;

    switch (currentSize) {
      case "mobile":
        // Mobile: cerrar sidebar (se abrirá como overlay manualmente)
        setSidebarOpen(false);
        break;
      case "tablet":
        // Tablet: siempre colapsado (solo iconos)
        setSidebarOpen(false);
        break;
      case "desktop":
        // Desktop: restaurar preferencia del usuario
        setSidebarOpen(userPreference.current);
        break;
    }
  }, [setSidebarOpen]);

  // Guardar preferencia del usuario cuando togglea manualmente en desktop
  const handleToggle = useCallback(() => {
    const screenSize = getScreenSize(window.innerWidth);
    if (screenSize === "desktop") {
      userPreference.current = !sidebarOpen;
    }
    toggleSidebar();
  }, [sidebarOpen, toggleSidebar]);

  // Listener de resize con debounce implícito via requestAnimationFrame
  useEffect(() => {
    let rafId: number;
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleResize);
    };

    window.addEventListener("resize", onResize, { passive: true });
    // Ejecutar una vez al mount para ajustar el estado inicial
    handleResize();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, [handleResize]);

  const screenSize = getScreenSize(window.innerWidth);

  return {
    sidebarOpen,
    toggleSidebar: handleToggle,
    /** El sidebar está colapsado: cerrado en desktop/tablet, o simplemente no visible en mobile */
    collapsed: !sidebarOpen,
    /** Si estamos en mobile (sidebar como overlay) */
    isMobile: screenSize === "mobile",
    /** Si estamos en tablet (sidebar colapsado permanente) */
    isTablet: screenSize === "tablet",
    /** Si estamos en desktop (sidebar toggle libre) */
    isDesktop: screenSize === "desktop",
    /** Si el sidebar debe ser visible fijo (tablet o desktop) */
    isFixed: screenSize !== "mobile",
  };
}
