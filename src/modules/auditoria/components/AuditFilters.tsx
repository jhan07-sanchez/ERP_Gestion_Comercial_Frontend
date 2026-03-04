// src/modules/auditoria/components/AuditFilters.tsx
import React, { useState } from 'react';
import type { AuditFilters as IAuditFilters } from '../types';

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
        <form onSubmit={handleApply} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-20" />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Filtros Inteligentes</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ajuste su búsqueda</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                    Limpiar Filtros
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {/* Búsqueda Global */}
                <div className="space-y-1.5 lg:col-span-2 xl:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Término de Búsqueda</label>
                    <div className="relative group">
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleChange}
                            placeholder="Buscar por descripción, usuario, IP..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Módulo */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Módulo</label>
                    <div className="relative">
                        <select
                            name="modulo"
                            value={filters.modulo || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer appearance-none font-medium text-slate-600"
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
                        <div className="absolute right-4 top-3 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                        </div>
                    </div>
                </div>

                {/* Acción */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Acción</label>
                    <div className="relative">
                        <select
                            name="accion"
                            value={filters.accion || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer appearance-none font-medium text-slate-600"
                        >
                            <option value="">Todas</option>
                            <option value="CREAR">Crear</option>
                            <option value="ACTUALIZAR">Editar</option>
                            <option value="ELIMINAR">Eliminar</option>
                            <option value="LOGIN">Login</option>
                            <option value="LOGOUT">Logout</option>
                            <option value="CANCELAR">Cancelar</option>
                        </select>
                        <div className="absolute right-4 top-3 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                        </div>
                    </div>
                </div>

                {/* Fecha Inicio */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Desde</label>
                    <input
                        type="date"
                        name="fecha_inicio"
                        value={filters.fecha_inicio}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-600"
                    />
                </div>

                {/* Fecha Fin */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Hasta</label>
                    <input
                        type="date"
                        name="fecha_fin"
                        value={filters.fecha_fin}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-600"
                    />
                </div>

                {/* Botón Buscar */}
                <div className="lg:col-span-4 xl:col-span-1 flex items-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Buscar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AuditFilters;
