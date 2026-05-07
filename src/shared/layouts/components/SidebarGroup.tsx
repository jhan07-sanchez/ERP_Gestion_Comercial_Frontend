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
      path?: string;
      icon?: Icon;
      children?: {
        label: string;
        path: string;
        icon?: Icon;
      }[];
    }[];
  }[];
}

export function SidebarGroup({
  label,
  icon: IconComponent,
  collapsed,
  children,
}: SidebarGroupProps) {
  const location = useLocation();

  // Detecta si algún hijo está activo
  const isChildActive = children.some((section) =>
    section.items.some((item) =>
      item.path ? location.pathname.startsWith(item.path) : false,
    ),
  );

  // Estado del grupo principal
  const [isOpen, setIsOpen] = useState(isChildActive && !collapsed);

  const toggleOpen = () => {
    if (collapsed) return;
    setIsOpen(!isOpen);
  };

  // 🔥 Estado GLOBAL para submenús (NO dentro del map)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu((prev) => (prev === label ? null : label));
  };

  return (
    <div className="space-y-1">
      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={toggleOpen}
        className={`
          w-full group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200
          ${
            isChildActive && !isOpen && !collapsed
              ? "bg-accent-50 text-accent-700"
              : "text-primary-500 hover:bg-primary-100 hover:text-primary-900"
          }
          ${collapsed ? "justify-center px-2" : ""}
        `}
      >
        <div className="flex items-center gap-3">
          <IconComponent
            size={collapsed ? 22 : 18}
            stroke={isChildActive ? 2.5 : 2}
            className={`shrink-0 transition-colors ${
              isChildActive && !collapsed
                ? "text-accent-600"
                : "text-primary-400 group-hover:text-primary-900"
            }`}
          />
          {!collapsed && <span>{label}</span>}
        </div>

        {!collapsed && (
          <IconChevronRight
            size={14}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        )}

        {collapsed && (
          <div className="absolute left-full ml-4 px-2 py-1 bg-primary-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap">
            {label}
          </div>
        )}
      </button>

      {/* CONTENIDO */}
      {!collapsed && isOpen && (
        <div className="mt-1 space-y-4 py-2 border-l-2 border-primary-100 ml-5 relative animate-in slide-in-from-top-1 duration-200">
          {children.map((section) => (
            <div key={section.section} className="space-y-1">
              {/* TITULO SECCIÓN */}
              <div className="px-5 py-1 text-[10px] font-black text-primary-400 uppercase tracking-widest">
                {section.section}
              </div>

              {/* ITEMS */}
              {section.items.map((item) => {
                const hasChildren = !!item.children;

                return (
                  <div key={item.label} className="space-y-1">
                    {/* ITEM PRINCIPAL */}
                    <div
                      onClick={() => hasChildren && toggleSubmenu(item.label)}
                      className="cursor-pointer"
                    >
                      {item.path ? (
                        <SidebarItem
                          label={item.label}
                          path={item.path}
                          icon={item.icon}
                          indent
                          showDot
                        />
                      ) : (
                        <div className="px-5 py-2 text-sm font-semibold text-primary-700 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {/* 🔵 PUNTO */}
                            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
                            {item.label}
                          </div>

                          {hasChildren && (
                            <IconChevronRight
                              size={14}
                              className={`transition-transform ${
                                openSubmenu === item.label ? "rotate-90" : ""
                              }`}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* SUBMENÚ (NIVEL 3) */}
                    {hasChildren && openSubmenu === item.label && (
                      <div className="ml-6 space-y-1 animate-in slide-in-from-top-1 duration-200">
                        {item.children!.map((sub) => (
                          <div key={sub.path}>
                            {/* ITEM */}
                            <SidebarItem
                              label={sub.label}
                              path={sub.path}
                              icon={sub.icon}
                              indent
                              showDot
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
