// src/layouts/components/SidebarGroup.tsx
import { useState, useCallback, useMemo } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { SidebarItem } from "./SidebarItem";
import type { SidebarSection } from "../sidebar.config";

interface SidebarGroupProps {
  label: string;
  icon: Icon;
  collapsed?: boolean;
  children: SidebarSection[];
}

// ─── Helpers ───────────────────────────────────────────────

/** Comprueba recursivamente si alguna ruta de las secciones coincide con el pathname actual. */
function isAnyChildActive(sections: SidebarSection[], pathname: string): boolean {
  return sections.some((section) =>
    section.items.some((item) => {
      if (item.path && pathname.startsWith(item.path)) return true;
      return item.children?.some((sub) => pathname.startsWith(sub.path)) ?? false;
    }),
  );
}

import { useUIStore } from "@/shared/store/ui.store";

import { usePortalTooltip } from "@/shared/hooks/usePortalTooltip";

/**
 * Grupo expandible del sidebar con soporte para secciones y hasta 3 niveles de navegación.
 */
export function SidebarGroup({
  label,
  icon: IconComponent,
  collapsed,
  children,
}: SidebarGroupProps) {
  const { pathname } = useLocation();
  const { setSidebarOpen } = useUIStore();
  const { ref, onMouseEnter, onMouseLeave, renderTooltip } = usePortalTooltip<HTMLButtonElement>();

  const isChildActive = useMemo(
    () => isAnyChildActive(children, pathname),
    [children, pathname],
  );

  const [isOpen, setIsOpen] = useState(isChildActive && !collapsed);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Derivar el estado durante el render (React best practice para estado derivado)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (isChildActive && !collapsed) {
      setIsOpen(true);
    }
  }

  const toggleOpen = useCallback(() => {
    if (collapsed) {
      setSidebarOpen(true);
      setIsOpen(true);
      return;
    }
    setIsOpen((prev) => !prev);
  }, [collapsed, setSidebarOpen]);

  const toggleSubmenu = useCallback((submenuLabel: string) => {
    setOpenSubmenu((prev) => (prev === submenuLabel ? null : submenuLabel));
  }, []);

  return (
    <div>
      {/* ─── Trigger Button ─── */}
      <button
        onClick={toggleOpen}
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`
          group relative w-full flex items-center justify-between rounded-lg text-sm font-medium
          transition-all duration-200 outline-none
          ${collapsed ? "justify-center w-10 h-10 mx-auto px-0" : "px-3 py-2"}
          ${isChildActive
            ? "bg-accent-50 text-accent-700 font-semibold"
            : "text-primary-600 hover:bg-primary-50 hover:text-primary-900"
          }
        `}
      >
        <div className={`flex items-center ${collapsed ? "" : "gap-2.5"}`}>
          <IconComponent
            size={collapsed ? 20 : 16}
            stroke={isChildActive ? 2.2 : 1.8}
            className={`shrink-0 transition-colors duration-150 ${isChildActive
                ? "text-accent-600"
                : "text-primary-400 group-hover:text-primary-700"
              }`}
          />
          {!collapsed && <span className="leading-tight">{label}</span>}
        </div>

        {/* Chevron */}
        {!collapsed && (
          <IconChevronRight
            size={14}
            stroke={1.8}
            className={`text-primary-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""
              }`}
          />
        )}

        {/* Collapsed active indicator */}
        {collapsed && isChildActive && (
          <span className="absolute -right-0.5 top-1 w-1.5 h-1.5 rounded-full bg-accent-500" />
        )}
      </button>

      {/* Tooltip Portal */}
      {renderTooltip(label, !collapsed)}

      {/* ─── Expanded Content ─── */}
      {!collapsed && isOpen && (
        <div className="mt-0.5 ml-[18px] border-l border-primary-100 sidebar-section-enter">
          {children.map((section) => (
            <div key={section.section} className="py-1">
              {/* Section title */}
              <div className="px-4 pt-2 pb-1 text-xs font-semibold text-primary-400 uppercase tracking-wider select-none">
                {section.section}
              </div>

              {/* Section items */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const hasChildren = !!item.children;
                  const isSubmenuOpen = openSubmenu === item.label;

                  // Item con sub-rutas → toggler
                  // Item con path → SidebarItem directo
                  return (
                    <div key={item.label}>
                      {item.path ? (
                        <div className="pl-2">
                          <SidebarItem
                            label={item.label}
                            path={item.path}
                            icon={item.icon}
                            indent
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => hasChildren && toggleSubmenu(item.label)}
                          className={`
                            group w-full flex items-center justify-between pl-4 pr-3 py-2 rounded-lg text-sm font-medium
                            transition-all duration-200 outline-none
                            ${isSubmenuOpen
                              ? "text-primary-900"
                              : "text-primary-600 hover:bg-primary-50 hover:text-primary-900"
                            }
                          `}
                        >
                          <span className="leading-tight">{item.label}</span>
                          {hasChildren && (
                            <IconChevronRight
                              size={13}
                              stroke={1.8}
                              className={`text-primary-400 transition-transform duration-200 ${isSubmenuOpen ? "rotate-90" : ""
                                }`}
                            />
                          )}
                        </button>
                      )}

                      {/* ─── Level 3: Sub-items ─── */}
                      {hasChildren && isSubmenuOpen && (
                        <div className="ml-3 border-l border-primary-100/80 sidebar-section-enter">
                          <div className="space-y-0.5 py-0.5">
                            {item.children!.map((sub) => (
                              <div key={sub.path} className="pl-2">
                                <SidebarItem
                                  label={sub.label}
                                  path={sub.path}
                                  icon={sub.icon}
                                  indent
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
