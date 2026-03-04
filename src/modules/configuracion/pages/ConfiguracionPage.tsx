/**
 * 🏢 PÁGINA: CENTRO DE CONFIGURACIÓN
 * Punto de entrada para la gestión global del ERP.
 * Diseño modular con navegación lateral interna.
 */

import React, { useState } from 'react';
import { useConfiguracion } from '../hooks/useConfiguracion';
import { SeccionEmpresa } from '../components/SeccionEmpresa';
import { SeccionSistema } from '../components/SeccionSistema';
import { SeccionDocumentacion } from '../components/SeccionDocumentacion';
import { SeccionSeguridad } from '../components/SeccionSeguridad';
import {
    IconBuilding,
    IconSettings,
    IconFileText,
    IconShieldLock,
    IconLoader2,
    IconAlertCircle
} from '@tabler/icons-react';

type TabType = 'empresa' | 'sistema' | 'documentacion' | 'seguridad';

const ConfiguracionPage: React.FC = () => {
    const { config, isLoading, isSaving, error, updateConfig, resetConsecutivo } = useConfiguracion();
    const [activeTab, setActiveTab] = useState<TabType>('empresa');

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <IconLoader2 className="animate-spin text-blue-600" size={48} />
                <p className="text-primary-600 font-medium animate-pulse">Cargando configuración del sistema...</p>
            </div>
        );
    }

    if (error || !config) {
        return (
            <div className="bg-danger-50 border border-danger-200 p-8 rounded-lg text-center max-w-2xl mx-auto mt-12">
                <IconAlertCircle className="text-danger-500 mx-auto mb-4" size={48} />
                <h2 className="text-xl font-bold text-danger-900 mb-2">Error Crítico de Configuración</h2>
                <p className="text-danger-700 mb-6">{error || 'No se pudo cargar la configuración.'}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-danger-600 text-white px-6 py-2 rounded-button hover:bg-danger-700 transition-colors"
                >
                    Reintentar Carga
                </button>
            </div>
        );
    }

    const tabs = [
        { id: 'empresa', label: 'Datos de Empresa', icon: <IconBuilding size={18} /> },
        { id: 'sistema', label: 'Parámetros del Sistema', icon: <IconSettings size={18} /> },
        { id: 'documentacion', label: 'Documentación', icon: <IconFileText size={18} /> },
        { id: 'seguridad', label: 'Seguridad', icon: <IconShieldLock size={18} /> },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary-900 tracking-tight">Configuración del Sistema</h1>
                    <p className="text-primary-600 mt-1">
                        Gestiona la identidad, parámetros fiscales y numeración de tu ERP.
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-primary-400 uppercase tracking-widest font-bold">Última Actualización</p>
                    <p className="text-xs font-medium text-primary-600">
                        {new Date(config.fecha_actualizacion).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Navigation Sidebar (Inner) */}
                <aside className="w-full lg:w-72 bg-white border border-primary-200 rounded-lg overflow-hidden shadow-sm sticky top-6">
                    <nav className="p-2 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-button transition-all
                  ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-primary-700 hover:bg-primary-100 hover:text-blue-600'}
                `}
                            >
                                {tab.icon}
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 bg-primary-50 border-t border-primary-200 mt-4">
                        <p className="text-[10px] font-bold text-primary-400 uppercase mb-2">Estado del ERP</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-success-700 capitalize">En línea y Operativo</span>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="flex-1 w-full pb-12">
                    {activeTab === 'empresa' && (
                        <SeccionEmpresa
                            config={config}
                            onSave={async (data) => { await updateConfig(data); }}
                            isSaving={isSaving}
                        />
                    )}
                    {activeTab === 'sistema' && (
                        <SeccionSistema
                            config={config}
                            onSave={async (data) => { await updateConfig(data); }}
                            isSaving={isSaving}
                        />
                    )}
                    {activeTab === 'documentacion' && (
                        <SeccionDocumentacion
                            config={config}
                            onSave={async (data) => { await updateConfig(data); }}
                            onReset={async (data) => { await resetConsecutivo(data); }}
                            isSaving={isSaving}
                        />
                    )}
                    {activeTab === 'seguridad' && <SeccionSeguridad />}
                </main>
            </div>
        </div>
    );
};

export default ConfiguracionPage;
