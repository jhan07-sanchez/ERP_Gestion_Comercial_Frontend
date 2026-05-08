import { useState, useEffect } from 'react';
import { Select } from '@shared/components/ui';
import { IconBuildingStore, IconDeviceDesktop, IconUser } from '@tabler/icons-react';
import axiosInstance from '@/shared/api/axios';

interface Props {
  onFilterChange: (filters: { sucursal?: number; caja?: number; vendedor?: number }) => void;
  currentFilters: { sucursal?: number; caja?: number; vendedor?: number };
}

export function AnalyticsFilters({ onFilterChange, currentFilters }: Props) {
  const [cajas, setCajas] = useState<{ id: number; nombre: string }[]>([]);
  const [vendedores, setVendedores] = useState<{ id: number; username: string }[]>([]);

  useEffect(() => {
    // Cargar Cajas
    axiosInstance.get('/caja/').then(res => {
      if (res.data.success) setCajas(res.data.data);
      else if (Array.isArray(res.data)) setCajas(res.data);
    }).catch(() => {});

    // Cargar Vendedores (Usuarios)
    axiosInstance.get('/usuarios/').then(res => {
      if (res.data.success) setVendedores(res.data.data);
      else if (Array.isArray(res.data)) setVendedores(res.data);
    }).catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-primary-50/50 p-4 rounded-2xl border border-primary-100 mb-6">
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary-400 flex items-center gap-1.5 ml-1">
          <IconBuildingStore size={14} /> Sucursal
        </label>
        <Select
          value={currentFilters.sucursal?.toString() || ''}
          onChange={(val) => onFilterChange({ sucursal: val ? parseInt(val) : undefined })}
          options={[
            { value: '', label: 'Todas las Sucursales' },
            { value: '1', label: 'Sede Principal - Norte' }
          ]}
          className="h-10 text-xs font-bold"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary-400 flex items-center gap-1.5 ml-1">
          <IconDeviceDesktop size={14} /> Caja / Terminal
        </label>
        <Select
          value={currentFilters.caja?.toString() || ''}
          onChange={(val) => onFilterChange({ caja: val ? parseInt(val) : undefined })}
          options={[
            { value: '', label: 'Todas las Cajas' },
            ...cajas.map(c => ({ value: c.id.toString(), label: c.nombre }))
          ]}
          className="h-10 text-xs font-bold"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary-400 flex items-center gap-1.5 ml-1">
          <IconUser size={14} /> Vendedor / Asesor
        </label>
        <Select
          value={currentFilters.vendedor?.toString() || ''}
          onChange={(val) => onFilterChange({ vendedor: val ? parseInt(val) : undefined })}
          options={[
            { value: '', label: 'Todos los Vendedores' },
            ...vendedores.map(v => ({ value: v.id.toString(), label: v.username }))
          ]}
          className="h-10 text-xs font-bold"
        />
      </div>
    </div>
  );
}
