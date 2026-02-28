// src/layouts/components/SidebarItem.tsx
import { NavLink } from "react-router-dom";
import type { Icon } from "@tabler/icons-react";

interface SidebarItemProps {
    label: string;
    path: string;
    icon?: Icon;
    collapsed?: boolean;
    indent?: boolean;
}

export function SidebarItem({ label, path, icon: IconComponent, collapsed, indent }: SidebarItemProps) {
    return (
        <NavLink
            to={path}
            end={path === '/dashboard'}
            className={({ isActive }) => `
        group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200
        ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}
        ${indent ? "ml-4" : ""}
        ${collapsed ? "justify-center px-2" : ""}
      `}
        >
            {({ isActive }) => (
                <>
                    {IconComponent && (
                        <IconComponent
                            size={collapsed ? 22 : 18}
                            stroke={isActive ? 2.5 : 2}
                            className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-900"}`}
                        />
                    )}

                    {!collapsed && (
                        <span className="truncate transition-opacity duration-200">
                            {label}
                        </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                        <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap">
                            {label}
                        </div>
                    )}

                    {/* Active indicator bar */}
                    {isActive && !collapsed && (
                        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/50" />
                    )}
                </>
            )}
        </NavLink>
    );
}
