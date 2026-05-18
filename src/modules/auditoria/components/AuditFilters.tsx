// src/modules/auditoria/components/AuditFilters.tsx
import React, { useState } from 'react';
import type { AuditFilters as IAuditFilters } from '../types';
import { Card, Input, Button } from '@/shared/components/ui';
import { IconFilter, IconSearch, IconX, IconCalendar, IconApps, IconBolt } from '@tabler/icons-react';

interface AuditFiltersProps {
    onFilter: (filters: IAuditFilters) => void;
    isLoading: boolean;
}

const AuditFilters: React.FC<AuditFiltersProps> = ({ onFilter, isLoading }) => {
    const [filters, setFilters] = useState<IAuditFilters>({
        search: '',
        modulo: undefined,
        accion: undefined,
        fecha_inicio: '',
        fecha_fin: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value || undefined }));
    };

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            search: '',
            modulo: undefined,
            accion: undefined,
            fecha_inicio: '',
            fecha_fin: '',
        };
        setFilters(resetFilters);
        onFilter(resetFilters);
    };

    return (
        <Card className="border-primary-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
            <div className="bg-primary-50/50 border-b border-primary-100 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <IconFilter size={16} className="text-accent-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-primary-500">Filtros Avanzados</span>
                </div>
                <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-black uppercase tracking-widest text-primary-400 hover:text-danger-500 transition-colors flex items-center gap-1"
                >
                    <IconX size={12} />
                    Limpiar
                </button>
            </div>
            
            <Card.Content className="p-4 sm:p-6">
                <form onSubmit={handleApply} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
                        {/* Búsqueda Global */}
                        <div className="space-y-1.5 lg:col-span-2 xl:col-span-2">
                            <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary-400 px-1">
                                <IconSearch size={12} />
                                Término de Búsqueda
                            </label>
                            <Input
                                name="search"
                                value={filters.search}
                                onChange={handleChange}
                                placeholder="Descripción, usuario, IP..."
                                className="bg-white border-primary-200 focus:border-accent-500 h-11 text-xs"
                            />
                        </div>

                        {/* Módulo */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary-400 px-1">
                                <IconApps size={12} />
                                Módulo
                            </label>
                            <select
                                name="modulo"
                                value={filters.modulo || ''}
                                onChange={handleChange}
                                className="w-full px-4 h-11 bg-white border border-primary-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent-500/10 focus:border-accent-500 transition-all cursor-pointer appearance-none font-bold text-primary-600"
                            >
                                <option value="">Todos</option>
                                <option value="VENTAS">Ventas</option>
                                <option value="COMPRAS">Compras</option>
                                <option value="INVENTARIO">Inventario</option>
                                <option value="CLIENTES">Clientes</option>
                                <option value="PROVEEDORES">Proveedores</option>
                                <option value="USUARIOS">Usuarios</option>
                                <option value="CAJA">Caja</option>
                                <option value="SISTEMA">Sistema</option>
                            </select>
                        </div>

                        {/* Acción */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary-400 px-1">
                                <IconBolt size={12} />
                                Acción
                            </label>
                            <select
                                name="accion"
                                value={filters.accion || ''}
                                onChange={handleChange}
                                className="w-full px-4 h-11 bg-white border border-primary-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent-500/10 focus:border-accent-500 transition-all cursor-pointer appearance-none font-bold text-primary-600"
                            >
                                <option value="">Todas</option>
                                <option value="CREAR">Crear</option>
                                <option value="ACTUALIZAR">Editar</option>
                                <option value="ELIMINAR">Eliminar</option>
                                <option value="LOGIN">Login</option>
                                <option value="LOGOUT">Logout</option>
                                <option value="CANCELAR">Cancelar</option>
                            </select>
                        </div>

                        {/* Fecha Inicio */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary-400 px-1">
                                <IconCalendar size={12} />
                                Desde
                            </label>
                            <Input
                                type="date"
                                name="fecha_inicio"
                                value={filters.fecha_inicio}
                                onChange={handleChange}
                                className="bg-white border-primary-200 focus:border-accent-500 h-11 text-xs"
                            />
                        </div>

                        {/* Fecha Fin */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary-400 px-1">
                                <IconCalendar size={12} />
                                Hasta
                            </label>
                            <Input
                                type="date"
                                name="fecha_fin"
                                value={filters.fecha_fin}
                                onChange={handleChange}
                                className="bg-white border-primary-200 focus:border-accent-500 h-11 text-xs"
                            />
                        </div>

                        {/* Botón Buscar */}
                        <div className="lg:col-span-3 xl:col-span-6 flex items-end justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto px-10 h-11 shadow-lg shadow-accent-100 font-black uppercase tracking-widest text-xs"
                            >
                                {isLoading ? "Buscando..." : "Aplicar Filtros"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Card.Content>
        </Card>
    );
};

export default AuditFilters;
