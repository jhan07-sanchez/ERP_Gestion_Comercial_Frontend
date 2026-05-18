import { NavLink } from "react-router-dom";
import type { Icon } from "@tabler/icons-react";
import { usePortalTooltip } from "@/shared/hooks/usePortalTooltip";

interface SidebarItemProps {
  label: string;
  path: string;
  icon?: Icon;
  collapsed?: boolean;
  indent?: boolean;
}

/**
 * Componente atómico de navegación del sidebar.
 */
export function SidebarItem({
  label,
  path,
  icon: IconComponent,
  collapsed,
  indent,
}: SidebarItemProps) {
  const { ref, onMouseEnter, onMouseLeave, renderTooltip } = usePortalTooltip<HTMLAnchorElement>();

  return (
    <>
      <NavLink
        to={path}
        end={path === "/dashboard"}
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={({ isActive }) => {
          const base =
            "group relative flex items-center gap-2.5 rounded-lg text-sm font-medium transition-all duration-200 outline-none";

          const active = isActive
            ? "bg-accent-50 text-accent-700 font-semibold"
            : "text-primary-600 hover:bg-primary-50 hover:text-primary-900";

          const indented = indent ? "pl-3 pr-3 py-2" : "px-3 py-2";
          const collapsedStyle = collapsed ? "justify-center !px-0 mx-auto w-10 h-10" : "";

          return `${base} ${active} ${indented} ${collapsedStyle}`;
        }}
      >
        {({ isActive }) => (
          <>
            {/* Active indicator — left bar (solo en modo expandido) */}
            {isActive && !collapsed && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-accent-500 transition-all duration-200" />
            )}

            {/* Active indicator — dot (solo en modo colapsado) */}
            {isActive && collapsed && (
              <span className="absolute -right-0.5 top-1 w-1.5 h-1.5 rounded-full bg-accent-500" />
            )}

            {/* Icono */}
            {IconComponent && (
              <IconComponent
                size={collapsed ? 20 : 16}
                stroke={isActive ? 2.2 : 1.8}
                className={`shrink-0 transition-colors duration-150 ${
                  isActive
                    ? "text-accent-600"
                    : "text-primary-400 group-hover:text-primary-700"
                }`}
              />
            )}

            {/* Label */}
            {!collapsed && (
              <span className="truncate leading-tight">{label}</span>
            )}
          </>
        )}
      </NavLink>
      
      {/* Tooltip Portal (solo visible cuando está colapsado) */}
      {renderTooltip(label, !collapsed)}
    </>
  );
}
