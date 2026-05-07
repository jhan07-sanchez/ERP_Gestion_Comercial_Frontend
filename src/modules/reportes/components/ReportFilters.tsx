import React from 'react';
import { Card, Input, Button, Select } from '@shared/components/ui';
import { IconFilter, IconDownload } from '@tabler/icons-react';
import type { ReportFilterOptions } from '../types/reportes.types';

interface ReportFiltersProps {
  filtros: ReportFilterOptions;
  onChange: (filtros: ReportFilterOptions) => void;
  onExport: (format: 'pdf' | 'excel') => void;
  isExporting?: boolean;
}

export function ReportFilters({ filtros, onChange, onExport, isExporting = false }: ReportFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filtros, [e.target.name]: e.target.value });
  };

  return (
    <Card className="border-none shadow-sm ring-1 ring-primary-100 mb-6">
      <Card.Content className="p-4 flex flex-col md:flex-row items-end gap-4">
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <Input
            type="date"
            label="Fecha Inicio"
            name="fechaInicio"
            value={filtros.fechaInicio || ''}
            onChange={handleChange}
          />
          <Input
            type="date"
            label="Fecha Fin"
            name="fechaFin"
            value={filtros.fechaFin || ''}
            onChange={handleChange}
          />
          <Select
            label="Categoría"
            name="categoria"
            value={filtros.categoria || ''}
            onChange={(val) => onChange({ ...filtros, categoria: val })}
            options={[
              { value: '', label: 'Todas las categorías' },
              { value: 'VENTA', label: 'Ventas' },
              { value: 'COSTO_VENTA', label: 'Costos de Venta' },
              { value: 'GASTO_ADMIN', label: 'Gastos Administrativos' },
              { value: 'IMPUESTO', label: 'Impuestos' },
            ]}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="secondary" className="flex-1 md:flex-none gap-2">
            <IconFilter size={18} />
            Filtrar
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 md:flex-none gap-2 text-accent-600 border-accent-200 hover:bg-accent-50"
            onClick={() => onExport('excel')}
            disabled={isExporting}
          >
            <IconDownload size={18} />
            Exportar
          </Button>
        </div>

      </Card.Content>
    </Card>
  );
}
