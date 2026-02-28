// src/layouts/components/Sidebar.tsx
import { sidebarConfig } from "../sidebar.config";
import { SidebarItem } from "./SidebarItem";
import { SidebarGroup } from "./SidebarGroup";
import { APP_NAME } from "@/utils/constants";
import { IconBolt, IconChevronLeft, IconLogout } from "@tabler/icons-react";
import { useAuthStore } from "@/auth/auth.store";
import { useUIStore } from "@/store/ui.store";

export function Sidebar() {
    const { sidebarOpen, toggleSidebar } = useUIStore();
    const { user, logout } = useAuthStore();

    return (
        <aside
            className={`fixed top-0 left-0 z-50 h-screen flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out shadow-sm
        ${sidebarOpen ? "w-72" : "w-20"}`}
        >
            {/* Brand Header */}
            <div className={`flex items-center h-20 px-6 shrink-0 ${sidebarOpen ? "justify-between" : "justify-center"}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                        <IconBolt size={22} fill="white" className="text-white" />
                    </div>
                    {sidebarOpen && (
                        <div className="flex flex-col animate-in fade-in duration-500">
                            <span className="text-lg font-black text-gray-900 tracking-tighter leading-none">
                                {APP_NAME}
                            </span>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                                Enterprise ERP
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-8 custom-scrollbar">
                {/* Agrupación Principal */}
                <div className="space-y-1">
                    {sidebarConfig.map((item) => (
                        item.children ? (
                            <SidebarGroup
                                key={item.label}
                                label={item.label}
                                icon={item.icon!}
                                collapsed={!sidebarOpen}
                                children={item.children}
                            />
                        ) : (
                            <SidebarItem
                                key={item.label}
                                label={item.label}
                                path={item.path!}
                                icon={item.icon}
                                collapsed={!sidebarOpen}
                            />
                        )
                    ))}
                </div>
            </nav>

            {/* Sidebar Footer: User Profil & Collapse Button */}
            <div className="p-4 border-t border-gray-50 space-y-4">
                {/* User Card */}
                <div className={`flex items-center gap-3 p-2 rounded-2xl bg-gray-50/50 border border-gray-100/50 ${sidebarOpen ? "justify-start" : "justify-center"}`}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs shrink-0 border-2 border-white shadow-sm uppercase">
                        {user?.username?.substring(0, 2) || "US"}
                    </div>
                    {sidebarOpen && (
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs font-black text-gray-900 truncate uppercase tracking-tighter">
                                {user?.username}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 truncate uppercase mt-0.5">
                                Administrador
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className={`flex items-center gap-2 ${sidebarOpen ? "justify-between" : "flex-col"}`}>
                    <button
                        onClick={toggleSidebar}
                        className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all hover:shadow-sm"
                        title={sidebarOpen ? "Contraer" : "Expandir"}
                    >
                        <IconChevronLeft size={20} className={`transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`} />
                    </button>

                    <button
                        onClick={logout}
                        className={`h-10 rounded-xl bg-red-50 text-red-600 border border-transparent hover:bg-red-100 hover:border-red-200 transition-all flex items-center justify-center gap-2 ${sidebarOpen ? "flex-1 px-4 text-xs font-black uppercase tracking-widest" : "w-10"}`}
                        title="Cerrar sesión"
                    >
                        <IconLogout size={20} stroke={2.5} />
                        {sidebarOpen && <span>Salir</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}
