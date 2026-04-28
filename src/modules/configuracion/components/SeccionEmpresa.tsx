/**
 * 🏢 SECCIÓN: DATOS DE LA EMPRESA
 * Permite editar nombre, NIT, contacto y logo con UX optimizada.
 */

import React, { useState, useRef } from 'react';
import { Card, Input, Button } from '@/shared/components/ui';
import { IconUpload, IconBuilding, IconMail, IconPhone, IconWorld, IconMapPin, IconPhoto, IconDeviceFloppy } from '@tabler/icons-react';
import type { Configuracion, ConfiguracionUpdateInput } from '../types/configuracion.types';

interface Props {
    config: Configuracion;
    onSave: (data: ConfiguracionUpdateInput) => Promise<void>;
    isSaving: boolean;
}

export const SeccionEmpresa: React.FC<Props> = ({ config, onSave, isSaving }) => {
    const [formData, setFormData] = useState<ConfiguracionUpdateInput>({
        nombre_empresa: config.nombre_empresa,
        razon_social: config.razon_social,
        nit: config.nit,
        telefono: config.telefono,
        telefono_secundario: config.telefono_secundario,
        email: config.email,
        sitio_web: config.sitio_web,
        direccion: config.direccion,
        ciudad: config.ciudad,
        departamento: config.departamento,
        pais: config.pais,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(config.logo_url);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, logo: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-24 lg:pb-0">
            {/* Identificación Card */}
            <Card className="border-primary-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-primary-50/50 border-b border-primary-100 flex items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600">
                            <IconBuilding size={18} />
                        </div>
                        <Card.Title className="text-sm font-black uppercase tracking-tight text-primary-700">Identidad Corporativa</Card.Title>
                    </div>
                </Card.Header>
                <Card.Content className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-wider text-primary-400 px-1">Nombre Comercial</label>
                                <Input
                                    name="nombre_empresa"
                                    value={formData.nombre_empresa}
                                    onChange={handleChange}
                                    placeholder="Ej: Mi Empresa S.A.S"
                                    required
                                    className="bg-primary-50/50 focus:bg-white transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-wider text-primary-400 px-1">Razón Social</label>
                                <Input
                                    name="razon_social"
                                    value={formData.razon_social}
                                    onChange={handleChange}
                                    placeholder="Ej: Mi Empresa Colombia S.A.S"
                                    className="bg-primary-50/50 focus:bg-white transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-wider text-primary-400 px-1">NIT / RUT</label>
                                <Input
                                    name="nit"
                                    value={formData.nit}
                                    onChange={handleChange}
                                    placeholder="000.000.000-0"
                                    required
                                    className="bg-primary-50/50 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>

                        {/* Logo Upload Section */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-wider text-primary-400 px-1 flex items-center gap-2">
                                <IconPhoto size={14} />
                                Logo del Sistema
                            </label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="relative group cursor-pointer aspect-video sm:aspect-square md:aspect-auto md:h-52 bg-primary-50 border-2 border-dashed border-primary-200 rounded-2xl flex flex-col items-center justify-center transition-all hover:bg-primary-100/50 hover:border-accent-300"
                            >
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="max-h-full max-w-full object-contain p-4 drop-shadow-sm"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-primary-300">
                                        <IconPhoto size={48} stroke={1.5} />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Sin Logo Seleccionado</p>
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-accent-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-[2px]">
                                    <div className="flex flex-col items-center gap-2 text-white">
                                        <IconUpload size={24} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Cambiar Imagen</span>
                                    </div>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleLogoChange}
                            />
                            <p className="text-[9px] font-bold text-primary-400 text-center uppercase tracking-tighter">Formatos: PNG, JPG (Recomendado 512x512px, máx 2MB)</p>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Contacto Card */}
            <Card className="border-primary-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-primary-50/50 border-b border-primary-100 flex items-center gap-2 py-4">
                    <div className="w-8 h-8 rounded-lg bg-success-50 flex items-center justify-center text-success-600">
                        <IconPhone size={18} />
                    </div>
                    <Card.Title className="text-sm font-black uppercase tracking-tight text-primary-700">Canales de Contacto</Card.Title>
                </Card.Header>
                <Card.Content className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-primary-400 px-1">Teléfono Principal</label>
                            <Input
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                leftIcon={<IconPhone size={16} className="text-primary-400" />}
                                required
                                className="bg-primary-50/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-primary-400 px-1">Teléfono Secundario</label>
                            <Input
                                name="telefono_secundario"
                                value={formData.telefono_secundario || ''}
                                onChange={handleChange}
                                leftIcon={<IconPhone size={16} className="text-primary-400" />}
                                className="bg-primary-50/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-primary-400 px-1">Email Corporativo</label>
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                leftIcon={<IconMail size={16} className="text-primary-400" />}
                                className="bg-primary-50/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-primary-400 px-1">Sitio Web</label>
                            <Input
                                name="sitio_web"
                                value={formData.sitio_web || ''}
                                onChange={handleChange}
                                leftIcon={<IconWorld size={16} className="text-primary-400" />}
                                placeholder="www.tuempresa.com"
                                className="bg-primary-50/50"
                            />
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Ubicación Card */}
            <Card className="border-primary-200 shadow-sm overflow-hidden">
                <Card.Header className="bg-primary-50/50 border-b border-primary-100 flex items-center gap-2 py-4">
                    <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center text-warning-600">
                        <IconMapPin size={18} />
                    </div>
                    <Card.Title className="text-sm font-black uppercase tracking-tight text-primary-700">Ubicación Geográfica</Card.Title>
                </Card.Header>
                <Card.Content className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="sm:col-span-2 lg:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-primary-400 px-1">Dirección Física</label>
                            <Input
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                leftIcon={<IconMapPin size={16} className="text-primary-400" />}
                                required
                                className="bg-primary-50/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-primary-400 px-1">Ciudad</label>
                            <Input
                                name="ciudad"
                                value={formData.ciudad}
                                onChange={handleChange}
                                className="bg-primary-50/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-primary-400 px-1">País</label>
                            <Input
                                name="pais"
                                value={formData.pais}
                                onChange={handleChange}
                                className="bg-primary-50/50"
                            />
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Floating Save Action for Mobile */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-primary-200 z-[40] lg:relative lg:bg-transparent lg:border-none lg:p-0 lg:z-0 lg:flex lg:justify-end">
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    className="w-full lg:w-auto px-10 h-12 shadow-xl shadow-accent-200 lg:shadow-none"
                    leftIcon={<IconDeviceFloppy size={20} />}
                >
                    Guardar Configuración
                </Button>
            </div>
        </form>
    );
};
