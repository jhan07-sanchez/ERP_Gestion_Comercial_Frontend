// src/shared/layouts/components/MobileHeader.tsx
import { IconBolt, IconMenu2 } from "@tabler/icons-react";
import { useUIStore } from "@/shared/store/ui.store";
import { APP_NAME } from "@/shared/utils/constants";
import { useConfigStore } from "@/shared/store/config.store";

/**
 * Header visible solo en mobile (< md / 768px).
 *
 * En tablet (≥ 768px) el sidebar ya está visible como barra
 * colapsada, así que este header no se muestra.
 */
export function MobileHeader() {
  const { toggleSidebar } = useUIStore();
  const { getLogo } = useConfigStore();

  return (
    <header className="md:hidden h-14 bg-white border-b border-primary-100 flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-2.5">
        {/* Logo — same style as sidebar */}
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center border border-primary-100 shrink-0">
          {getLogo() ? (
            <img
              src={getLogo()!}
              alt="Logo empresa"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-accent-600 flex items-center justify-center">
              <IconBolt size={16} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-primary-900 tracking-tight leading-none">
            {APP_NAME}
          </span>
          <span className="text-xs opacity-80 font-medium text-primary-400 uppercase tracking-wider">
            Enterprise
          </span>
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="w-9 h-9 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 hover:text-accent-600 transition-colors active:scale-95"
        aria-label="Abrir menú"
      >
        <IconMenu2 size={20} />
      </button>
    </header>
  );
}
