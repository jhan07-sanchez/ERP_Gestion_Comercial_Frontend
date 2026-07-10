import { Input } from "@/shared/components/ui";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import type { EstadoNota } from "../../types/notaCredito.types";

interface NotasCreditoToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filtroEstado: EstadoNota | "";
  onFiltroEstadoChange: (estado: EstadoNota | "") => void;
}

export function NotasCreditoToolbar({
  searchTerm,
  onSearchChange,
  filtroEstado,
  onFiltroEstadoChange,
}: NotasCreditoToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
        <Input
          placeholder="Buscar por número o motivo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          className="pl-10 bg-primary-50/30 border-primary-100 focus:bg-white transition-all"
        />
      </div>

      <div className="sm:w-64 relative">
        <IconFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 z-10" size={18} />
        <select
          value={filtroEstado}
          onChange={(e) => onFiltroEstadoChange(e.target.value as EstadoNota | "")}
          className="w-full pl-10 pr-4 py-2.5 border border-primary-300 rounded-button text-sm bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all appearance-none"
        >
          <option value="">Todos los estados</option>
          <option value="BORRADOR">Borrador</option>
          <option value="EMITIDA">Emitida</option>
          <option value="ANULADA">Anulada</option>
        </select>
      </div>
    </div>
  );
}
