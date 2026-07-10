import React from 'react';
import { Input, Select, Button } from '@/shared/components/ui';
import { IconSearch, IconEraser } from '@tabler/icons-react';

interface CondicionesPagoToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterStatus: string;
    onFilterStatusChange: (value: string) => void;
    sortBy: string;
    onSortByChange: (value: string) => void;
    onClear: () => void;
}

export const CondicionesPagoToolbar: React.FC<CondicionesPagoToolbarProps> = ({
    searchTerm,
    onSearchChange,
    filterStatus,
    onFilterStatusChange,
    sortBy,
    onSortByChange,
    onClear,
}) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-primary-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full md:w-auto">
                <Input
                    label="Buscar Condición"
                    placeholder="Ej. 30 días, Contado..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    leftIcon={<IconSearch size={18} />}
                    fullWidth
                />
            </div>

            <div className="w-full md:w-48">
                <Select
                    label="Estado"
                    value={filterStatus}
                    onChange={onFilterStatusChange}
                    options={[
                        { value: 'all', label: 'Todos los estados' },
                        { value: 'active', label: 'Activas' },
                        { value: 'inactive', label: 'Inactivas' },
                    ]}
                    fullWidth
                />
            </div>

            <div className="w-full md:w-48">
                <Select
                    label="Ordenar por"
                    value={sortBy}
                    onChange={onSortByChange}
                    options={[
                        { value: 'nombre', label: 'Nombre' },
                        { value: 'dias', label: 'Días de plazo' },
                    ]}
                    fullWidth
                />
            </div>

            <div className="w-full md:w-auto">
                <Button
                    variant="ghost"
                    onClick={onClear}
                    className="w-full md:w-auto h-[42px] px-4 text-primary-500 hover:text-primary-700 hover:bg-primary-50 flex items-center justify-center gap-2"
                    title="Limpiar filtros"
                >
                    <IconEraser size={18} />
                    <span className="md:hidden">Limpiar filtros</span>
                </Button>
            </div>
        </div>
    );
};
