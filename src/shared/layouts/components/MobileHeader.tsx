// src/shared/layouts/components/MobileHeader.tsx
import { IconBolt, IconMenu2 } from "@tabler/icons-react";
import { useUIStore } from "@/shared/store/ui.store";
import { APP_NAME } from "@/shared/utils/constants";

export function MobileHeader() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="lg:hidden h-16 bg-white border-b border-primary-100 flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-accent-600 rounded-button flex items-center justify-center shadow-md shadow-accent-200">
          <IconBolt size={18} fill="white" className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-primary-900 tracking-tighter leading-none">
            {APP_NAME}
          </span>
          <span className="text-[8px] font-black text-accent-600 uppercase tracking-widest">
            ERP Enterprise
          </span>
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 hover:text-accent-600 transition-all active:scale-95"
      >
        <IconMenu2 size={24} />
      </button>
    </header>
  );
}
