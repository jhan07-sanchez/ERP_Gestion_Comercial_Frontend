// src/layouts/components/Sidebar.tsx
import { sidebarConfig } from "../sidebar.config";
import { SidebarItem } from "./SidebarItem";
import { SidebarGroup } from "./SidebarGroup";
import { APP_NAME } from "@/shared/utils/constants";
import { IconBolt, IconChevronLeft, IconChevronRight, IconLogout } from "@tabler/icons-react";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useConfigStore } from "@/shared/store/config.store";
import { useResponsiveSidebar } from "@/shared/hooks/useResponsiveSidebar";
import { usePortalTooltip } from "@/shared/hooks/usePortalTooltip";

/**
 * Sidebar principal del ERP — Full Responsive.
 *
 * Comportamiento responsive:
 * - Mobile  (< 768px):  Oculto, se abre como overlay con backdrop
 * - Tablet  (768–1023px): Visible pero colapsado (solo iconos), siempre fijo
 * - Desktop (≥ 1024px):  Visible, el usuario puede expandir/colapsar libremente
 */
export function Sidebar() {
  const {
    sidebarOpen,
    toggleSidebar,
    collapsed,
    isMobile,
    isFixed,
  } = useResponsiveSidebar();

  const { user, logout } = useAuthStore();
  const { getLogo } = useConfigStore();

  const {
    ref: userTooltipRef,
    onMouseEnter: onUserMouseEnter,
    onMouseLeave: onUserMouseLeave,
    renderTooltip: renderUserTooltip,
  } = usePortalTooltip<HTMLDivElement>();

  const {
    ref: logoutTooltipRef,
    onMouseEnter: onLogoutMouseEnter,
    onMouseLeave: onLogoutMouseLeave,
    renderTooltip: renderLogoutTooltip,
  } = usePortalTooltip<HTMLButtonElement>();

  return (
    <>
      {/* ─── Mobile Overlay Backdrop ─── */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-primary-900/50 z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen flex flex-col
          bg-white border-r border-primary-100
          transition-all duration-300 ease-in-out
          ${
            isMobile
              ? // Mobile: slide in/out como overlay
                sidebarOpen
                  ? "translate-x-0 w-72 shadow-xl"
                  : "-translate-x-full w-72"
              : // Tablet y Desktop: siempre visible, cambia ancho
                collapsed
                  ? "translate-x-0 w-20"
                  : "translate-x-0 w-64"
          }
        `}
      >
        {/* ═══════════════════════════════════════════
            Brand Header
        ═══════════════════════════════════════════ */}
        <div
          className={`
            flex items-center shrink-0 h-14 border-b border-primary-100/60
            ${collapsed && isFixed ? "justify-center px-0" : "px-4 justify-between"}
          `}
        >
          <div className={`flex items-center overflow-hidden ${collapsed && isFixed ? "justify-center" : "gap-2.5"}`}>
            {/* Logo */}
            <div className={`rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-primary-100 bg-white ${collapsed && isFixed ? "w-12 h-12" : "w-12 h-12"}`}>
              {getLogo() ? (
                <img
                  src={getLogo()!}
                  alt="Logo empresa"
                  className="w-full h-full object-contain p-0"
                />
              ) : (
                <div className="w-full h-full bg-accent-600 flex items-center justify-center">
                  <IconBolt size={22} className="text-white" />
                </div>
              )}
            </div>

            {/* Brand text — hidden when collapsed on fixed */}
            {!(collapsed && isFixed) && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-primary-900 tracking-tight leading-none truncate">
                  {APP_NAME}
                </span>
                <span className="text-xs font-medium text-primary-400 uppercase tracking-wider mt-0.5">
                  Enterprise
                </span>
              </div>
            )}
          </div>

          {/* Close button — mobile overlay only */}
          {sidebarOpen && isMobile && (
            <button
              onClick={toggleSidebar}
              className="w-7 h-7 rounded-md flex items-center justify-center text-primary-400 hover:text-primary-700 hover:bg-primary-50 transition-colors shrink-0"
              aria-label="Cerrar menú"
            >
              <IconChevronLeft size={18} stroke={2} />
            </button>
          )}
        </div>

        {/* ═══════════════════════════════════════════
            Navigation
        ═══════════════════════════════════════════ */}
        <nav
          className={`
            flex-1 overflow-y-auto overflow-x-hidden no-scrollbar
            ${collapsed && isFixed ? "px-2 py-3" : "px-2.5 py-2"}
          `}
        >
          <div className={`space-y-0.5 ${collapsed && isFixed ? "flex flex-col items-center gap-0.5" : ""}`}>
            {sidebarConfig.map((item) =>
              item.children ? (
                <SidebarGroup
                  key={item.label}
                  label={item.label}
                  icon={item.icon!}
                  collapsed={collapsed && isFixed}
                  children={item.children}
                />
              ) : (
                <SidebarItem
                  key={item.label}
                  label={item.label}
                  path={item.path!}
                  icon={item.icon}
                  collapsed={collapsed && isFixed}
                />
              ),
            )}
          </div>
        </nav>

        {/* ═══════════════════════════════════════════
            Footer: User + Actions
        ═══════════════════════════════════════════ */}
        <div className={`border-t border-primary-100 ${collapsed && isFixed ? "p-2" : "p-2.5"}`}>
          {/* User card */}
          <div
            ref={userTooltipRef}
            onMouseEnter={collapsed && isFixed ? onUserMouseEnter : undefined}
            onMouseLeave={collapsed && isFixed ? onUserMouseLeave : undefined}
            className={`
              group relative flex items-center rounded-lg
              ${collapsed && isFixed ? "justify-center p-1.5 hover:bg-primary-50" : "gap-2.5 px-2.5 py-2 bg-primary-50/60"}
            `}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-accent-50 flex items-center justify-center text-xs text-accent-700 font-semibold shrink-0 border border-accent-100">
              {user?.username?.substring(0, 2)?.toUpperCase() || "US"}
            </div>

            {!(collapsed && isFixed) && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-primary-800 truncate">
                  {user?.username}
                </span>
                <span className="text-xs text-primary-400 truncate leading-tight">
                  Administrador
                </span>
              </div>
            )}

            {/* Tooltip Portal for collapsed user */}
            {renderUserTooltip(user?.username || "Usuario", !(collapsed && isFixed))}
          </div>

          {/* Action buttons */}
          <div
            className={`
              flex items-center mt-1.5
              ${collapsed && isFixed ? "flex-col gap-1" : "gap-1.5"}
            `}
          >
            {/* Collapse/Expand toggle — only on tablet+ */}
            {isFixed && (
              <button
                onClick={toggleSidebar}
                className="group relative w-8 h-8 flex items-center justify-center rounded-lg text-primary-400 hover:text-primary-700 hover:bg-primary-50 border border-transparent hover:border-primary-100 transition-all duration-200"
                title={sidebarOpen ? "Contraer" : "Expandir"}
                aria-label={sidebarOpen ? "Contraer sidebar" : "Expandir sidebar"}
              >
                {collapsed ? (
                  <IconChevronRight size={15} stroke={2} />
                ) : (
                  <IconChevronLeft size={15} stroke={2} />
                )}
              </button>
            )}

            {/* Logout */}
            <button
              onClick={logout}
              ref={logoutTooltipRef}
              onMouseEnter={collapsed && isFixed ? onLogoutMouseEnter : undefined}
              onMouseLeave={collapsed && isFixed ? onLogoutMouseLeave : undefined}
              className={`
                group relative flex items-center justify-center rounded-lg
                text-primary-400 hover:text-danger-600 hover:bg-danger-50
                border border-transparent hover:border-danger-100
                transition-all duration-200
                ${collapsed && isFixed ? "w-8 h-8" : "flex-1 h-8 gap-2 px-2.5"}
              `}
              title={!(collapsed && isFixed) ? "Cerrar sesión" : undefined}
              aria-label="Cerrar sesión"
            >
              <IconLogout size={15} stroke={2} />
              {!(collapsed && isFixed) && (
                <span className="text-xs font-medium">Salir</span>
              )}

              {/* Tooltip Portal for collapsed logout */}
              {renderLogoutTooltip("Cerrar sesión", !(collapsed && isFixed))}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
