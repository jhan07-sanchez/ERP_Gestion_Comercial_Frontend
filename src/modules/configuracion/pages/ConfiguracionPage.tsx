/**
 * 🏢 PÁGINA: CENTRO DE CONFIGURACIÓN
 * Punto de entrada para la gestión global del ERP.
 * Diseño modular con navegación responsiva.
 */

import React, { useState } from 'react';
import { useConfiguracion } from '../hooks/useConfiguracion';
import { SeccionEmpresa } from '../components/SeccionEmpresa';
import { SeccionSistema } from '../components/SeccionSistema';
import { SeccionDocumentacion } from '../components/SeccionDocumentacion';
import { SeccionSeguridad } from '../components/SeccionSeguridad';
import { SeccionMetodosPago } from "../components/SeccionMetodosPago";
import { PageContainer, PageHeader } from '@/shared/components/ui';
import {
    IconBuilding,
    IconSettings,
    IconFileText,
    IconShieldLock,
    IconLoader2,
    IconAlertCircle,
    IconInfoCircle,
    IconCategory
} from '@tabler/icons-react';

type TabType = 'empresa' | 'sistema' | 'documentacion' | 'seguridad' | 'metodos-pago';

const ConfiguracionPage: React.FC = () => {
    const { config, isLoading, isSaving, error, updateConfig, resetConsecutivo } = useConfiguracion();
    const [activeTab, setActiveTab] = useState<TabType>('empresa');

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <IconLoader2 className="animate-spin text-accent-600" size={48} />
                <p className="text-primary-600 font-black uppercase tracking-widest text-xs animate-pulse">Cargando configuración...</p>
            </div>
        );
    }

    if (error || !config) {
        return (
            <PageContainer>
                <div className="bg-danger-50 border border-danger-200 p-8 rounded-2xl text-center max-w-2xl mx-auto mt-12 shadow-sm">
                    <IconAlertCircle className="text-danger-500 mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-black text-danger-900 mb-2 uppercase tracking-tight">Error de Configuración</h2>
                    <p className="text-danger-700 mb-6 font-medium">{error || 'No se pudo cargar la configuración.'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-danger-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-danger-700 transition-all shadow-lg shadow-danger-200 active:scale-95"
                    >
                        Reintentar Carga
                    </button>
                </div>
            </PageContainer>
        );
    }

    const tabs = [
        { id: 'empresa', label: 'Datos de Empresa', icon: <IconBuilding size={18} />, desc: 'Identidad y redsocial' },
        { id: 'sistema', label: 'Sistema', icon: <IconSettings size={18} />, desc: 'Parámetros fiscales' },
        { id: 'documentacion', label: 'Documentación', icon: <IconFileText size={18} />, desc: 'Numeración y folios' },
        { id: 'seguridad', label: 'Seguridad', icon: <IconShieldLock size={18} />, desc: 'Accesos y auditoría' },
        { id: 'metodos-pago', label: 'Métodos de Pago', icon: <IconFileText size={18} />, desc: 'Configura métodos de pago' },
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Configuración"
                subtitle="Gestiona la identidad global y parámetros de tu ERP"
                icon={<IconSettings size={24} />}
                actions={
                    <div className="flex items-center gap-2 bg-primary-100/50 px-3 py-1.5 rounded-lg border border-primary-200/50">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs opacity-80 text-primary-400 uppercase tracking-widest font-black">Último cambio</p>
                            <p className="text-xs font-bold text-primary-700 tabular-nums">
                                {new Date(config.fecha_actualizacion).toLocaleString()}
                            </p>
                        </div>
                        <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse ml-1" />
                    </div>
                }
            />

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Navigation Sidebar (Inner) */}
                <aside className="w-full lg:w-72 space-y-4 shrink-0">
                    <div className="bg-white border border-primary-200 rounded-2xl overflow-hidden shadow-sm p-2 sticky top-6">
                        <div className="px-3 py-2 border-b border-primary-100 mb-2 hidden lg:block">
                            <p className="text-xs font-black text-primary-400 uppercase tracking-widest flex items-center gap-2">
                                <IconCategory size={14} />
                                Secciones
                            </p>
                        </div>
                        
                        {/* Mobile: Horizontal Scrollable Tabs | Desktop: Vertical List */}
                        <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 gap-1 no-scrollbar scroll-smooth">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap lg:whitespace-normal shrink-0 lg:w-full
                                        ${activeTab === tab.id
                                            ? 'bg-accent-600 text-white shadow-lg shadow-accent-100 ring-2 ring-accent-500/10'
                                            : 'text-primary-500 hover:bg-primary-50 hover:text-accent-600 border border-transparent hover:border-primary-100'}
                                    `}
                                >
                                    <span className={`${activeTab === tab.id ? 'text-white' : 'text-primary-400'} transition-colors shrink-0`}>
                                        {tab.icon}
                                    </span>
                                    <div className="text-left">
                                        <p className="font-black truncate uppercase tracking-tight leading-none">{tab.label}</p>
                                        <p className={`text-xs font-bold uppercase tracking-widest mt-1 opacity-60 hidden lg:block ${activeTab === tab.id ? 'text-white' : 'text-primary-400'}`}>
                                            {tab.desc}
                                        </p>
                                    </div>
                                    {activeTab === tab.id && (
                                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full hidden lg:block" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status Card (Better for Desktop, maybe hidden on mobile if too much) */}
                    <div className="hidden lg:block bg-gradient-to-br from-primary-900 to-primary-800 p-5 rounded-2xl shadow-xl overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-4 opacity-10">
                            <IconInfoCircle size={40} className="text-white" />
                         </div>
                        <p className="text-xs font-black text-primary-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                             Estado del Nodo
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-success-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                            <span className="text-xs font-black text-white uppercase tracking-wider">Sistema Operativo</span>
                        </div>
                        <p className="text-xs text-primary-500 mt-4 leading-relaxed font-bold">
                            Todos los servicios de backend y microservicios están sincronizados.
                        </p>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="flex-1 w-full min-w-0">
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
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

                        {activeTab === 'metodos-pago' && <SeccionMetodosPago />}
                    </div>
                </main>
            </div>
        </PageContainer>
    );
};

export default ConfiguracionPage;
