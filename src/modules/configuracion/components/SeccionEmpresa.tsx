/**
 * 🏢 SECCIÓN: DATOS DE LA EMPRESA
 * Permite editar nombre, NIT, contacto y logo.
 */

import React, { useState, useRef } from 'react';
import { Card, Input, Button } from '@/shared/components/ui';
import { IconUpload, IconBuilding, IconMail, IconPhone, IconWorld, IconMapPin } from '@tabler/icons-react';
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <Card.Header className="flex items-center gap-2">
                    <IconBuilding size={20} className="text-blue-600" />
                    <Card.Title>Identificación de la Empresa</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Input
                                label="Nombre Comercial"
                                name="nombre_empresa"
                                value={formData.nombre_empresa}
                                onChange={handleChange}
                                placeholder="Ej: Mi Empresa S.A.S"
                                required
                            />
                            <Input
                                label="Razón Social Legal"
                                name="razon_social"
                                value={formData.razon_social}
                                onChange={handleChange}
                                placeholder="Ej: Mi Empresa Colombia S.A.S"
                            />
                            <Input
                                label="NIT / Documento Identidad"
                                name="nit"
                                value={formData.nit}
                                onChange={handleChange}
                                placeholder="000.000.000-0"
                                required
                            />
                        </div>

                        {/* Logo Upload */}
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary-200 rounded-lg p-6 bg-primary-50">
                            <div className="relative group">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="h-32 w-auto object-contain mb-4 rounded shadow-sm"
                                    />
                                ) : (
                                    <div className="h-32 w-32 bg-primary-200 flex items-center justify-center rounded mb-4 text-primary-400">
                                        <IconBuilding size={48} />
                                    </div>
                                )}
                                <div
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <span className="text-white text-xs font-medium">Cambiar Logo</span>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleLogoChange}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                leftIcon={<IconUpload size={16} />}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Subir Logo
                            </Button>
                            <p className="text-[10px] text-primary-500 mt-2">PNG o JPG máx 2MB</p>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            <Card>
                <Card.Header className="flex items-center gap-2">
                    <IconMail size={20} className="text-blue-600" />
                    <Card.Title>Información de Contacto</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Teléfono Principal"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            leftIcon={<IconPhone size={18} />}
                            required
                        />
                        <Input
                            label="Teléfono Secundario"
                            name="telefono_secundario"
                            value={formData.telefono_secundario}
                            onChange={handleChange}
                            leftIcon={<IconPhone size={18} />}
                        />
                        <Input
                            label="Email Corporativo"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            leftIcon={<IconMail size={18} />}
                        />
                        <Input
                            label="Sitio Web"
                            name="sitio_web"
                            value={formData.sitio_web}
                            onChange={handleChange}
                            leftIcon={<IconWorld size={18} />}
                            placeholder="https://www.empresa.com"
                        />
                    </div>
                </Card.Content>
            </Card>

            <Card>
                <Card.Header className="flex items-center gap-2">
                    <IconMapPin size={20} className="text-blue-600" />
                    <Card.Title>Ubicación</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <Input
                                label="Dirección Física"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                leftIcon={<IconMapPin size={18} />}
                                required
                            />
                        </div>
                        <Input
                            label="Ciudad"
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                        />
                        <Input
                            label="Departamento / Estado"
                            name="departamento"
                            value={formData.departamento}
                            onChange={handleChange}
                        />
                        <Input
                            label="País"
                            name="pais"
                            value={formData.pais}
                            onChange={handleChange}
                        />
                    </div>
                </Card.Content>
            </Card>

            <div className="flex justify-end p-4 bg-white border-t sticky bottom-0 z-10">
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    className="px-8"
                >
                    Guardar Cambios
                </Button>
            </div>
        </form>
    );
};
