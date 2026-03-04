// src/layouts/components/SidebarGroup.tsx
import { useState } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { SidebarItem } from "./SidebarItem";

interface SidebarGroupProps {
    label: string;
    icon: Icon;
    collapsed?: boolean;
    children: {
        section: string;
        items: {
            label: string;
            path: string;
            icon?: Icon;
        }[];
    }[];
}

export function SidebarGroup({ label, icon: IconComponent, collapsed, children }: SidebarGroupProps) {
    const location = useLocation();

    // Determinamos si el grupo debe estar abierto inicialmente si alguna ruta hija es activa
    const isChildActive = children.some(section =>
        section.items.some(item => location.pathname.startsWith(item.path))
    );

    // Inicializamos el estado basado en la ruta activa, pero solo si no está colapsado
    const [isOpen, setIsOpen] = useState(isChildActive && !collapsed);

    const toggleOpen = () => {
        if (collapsed) return;
        setIsOpen(!isOpen);
    };

    return (
        <div className="space-y-1">
            <button
                onClick={toggleOpen}
                className={`
          w-full group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200
          ${isChildActive && !isOpen && !collapsed ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}
          ${collapsed ? "justify-center px-2" : ""}
        `}
            >
                <div className="flex items-center gap-3">
                    <IconComponent
                        size={collapsed ? 22 : 18}
                        stroke={isChildActive ? 2.5 : 2}
                        className={`shrink-0 transition-colors ${(isChildActive && !collapsed) ? "text-blue-600" : "text-gray-400 group-hover:text-gray-900"}`}
                    />
                    {!collapsed && <span>{label}</span>}
                </div>

                {!collapsed && (
                    <IconChevronRight
                        size={14}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                    />
                )}

                {collapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap">
                        {label}
                    </div>
                )}
            </button>

            {!collapsed && isOpen && (
                <div className="mt-1 space-y-4 py-2 border-l-2 border-gray-100 ml-5 relative animate-in slide-in-from-top-1 duration-200">
                    {children.map((section) => (
                        <div key={section.section} className="space-y-1">
                            <div className="px-5 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {section.section}
                            </div>
                            {section.items.map((item) => (
                                <SidebarItem
                                    key={item.path}
                                    label={item.label}
                                    path={item.path}
                                    icon={item.icon}
                                    indent
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
