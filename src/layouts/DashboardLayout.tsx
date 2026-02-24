// src/layouts/DashboardLayout.tsx
/**
 * 🏗️ LAYOUT PRINCIPAL DEL DASHBOARD
 *
 * Este es el layout que envuelve todas las páginas del sistema.
 * Incluye:
 * - Sidebar (menú lateral)
 * - Header (barra superior)
 * - Área de contenido
 *
 * Todas las páginas internas usan este layout.
 */
import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/auth/auth.store";
import { useUIStore } from "@/store/ui.store";
import { ROUTES, APP_NAME } from "@/utils/constants";
import { sidebarConfig } from "./sidebar.config";
import { NavLink } from "react-router-dom";

type SidebarItem = (typeof sidebarConfig)[number];

export default function DashboardLayout() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const isSectionActive = useCallback(
    (item: SidebarItem): boolean => {
      if (!item.children) return false;

      return item.children.some((section) =>
        section.items.some((sub) => location.pathname.startsWith(sub.path)),
      );
    },
    [location.pathname],
  );

  useEffect(() => {
    sidebarConfig.forEach((item) => {
      if (isSectionActive(item)) {
        setOpenMenus((prev) =>
          prev.includes(item.label) ? prev : [...prev, item.label],
        );
      }
    });
  }, [location.pathname, isSectionActive]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen flex flex-col bg-white border-r border-gray-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform w-64`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {sidebarConfig.map((item) => (
            <div key={item.label}>
              {item.path ? (
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.icon && (
                        <item.icon
                          size={18}
                          stroke={1.5}
                          className={`${
                            isActive ? "text-blue-600" : "text-gray-500"
                          } transition-colors`}
                        />
                      )}
                      {item.label}
                    </>
                  )}
                </NavLink>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setOpenMenus((prev) =>
                        prev.includes(item.label)
                          ? prev.filter((label) => label !== item.label)
                          : [...prev, item.label],
                      );
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors ${
                      openMenus.includes(item.label) || isSectionActive(item)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && (
                        <item.icon
                          size={18}
                          stroke={1.5}
                          className={`${
                            openMenus.includes(item.label) ||
                            isSectionActive(item)
                              ? "text-blue-600"
                              : "text-gray-500"
                          } transition-colors`}
                        />
                      )}
                      <span>{item.label}</span>
                    </div>

                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        openMenus.includes(item.label) || isSectionActive(item)
                          ? "rotate-90"
                          : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {openMenus.includes(item.label) &&
                    item.children?.map((section) => (
                      <div
                        key={section.section}
                        className="ml-3 border-l border-primary-200 pl-3 py-1 space-y-1 transition-all duration-200"
                      >
                        <p className="px-4 text-xs font-semibold text-primary-800 uppercase tracking-wider mb-2">
                          {section.section}
                        </p>
                        {section.items.map((sub) => (
                          <NavLink
                            key={sub.label}
                            to={sub.path}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-6 py-2 rounded-lg text-sm transition-colors ${
                                isActive
                                  ? "bg-gray-200 text-blue-600 font-semibold"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                {sub.icon && (
                                  <sub.icon
                                    size={16}
                                    stroke={1.5}
                                    className={`${
                                      isActive
                                        ? "text-blue-600"
                                        : "text-gray-500"
                                    }`}
                                  />
                                )}
                                {sub.label}
                              </>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    ))}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? "ml-64" : "ml-0"} transition-all`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          {/* Botón toggle sidebar */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Bienvenido, <strong>{user?.username}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
