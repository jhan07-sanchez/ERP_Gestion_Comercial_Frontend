/**
 * 🎣 HOOK PARA EL MÓDULO DE CONFIGURACIÓN
 * Maneja el estado, carga y actualizaciones de la configuración global.
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { configuracionAPI } from '../api/configuracion.api';
import type {
    Configuracion,
    ConfiguracionUpdateInput,
    ResetConsecutivoInput
} from '../types/configuracion.types';
import { getApiErrorMessage } from '@/shared/utils/apiError';

export const useConfiguracion = () => {
    const [config, setConfig] = useState<Configuracion | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Carga la configuración inicial
     */
    const fetchConfig = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await configuracionAPI.getConfiguracion();
            setConfig(data);
        } catch (err) {
            const msg = getApiErrorMessage(err, 'Error al cargar la configuración');
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Actualiza la configuración
     */
    const updateConfig = async (data: ConfiguracionUpdateInput) => {
        setIsSaving(true);
        try {
            const updatedConfig = await configuracionAPI.updateConfiguracion(data);
            setConfig(updatedConfig);
            toast.success('Configuración actualizada correctamente');
            return updatedConfig;
        } catch (err) {
            const msg = getApiErrorMessage(err, 'Error al actualizar la configuración');
            toast.error(msg);
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Resetea un consecutivo
     */
    const resetConsecutivo = async (data: ResetConsecutivoInput) => {
        setIsSaving(true);
        try {
            const response = await configuracionAPI.resetConsecutivo(data);
            setConfig(response.configuracion);
            toast.success(response.mensaje);
            return response;
        } catch (err) {
            const msg = getApiErrorMessage(err, 'Error al resetear el consecutivo');
            toast.error(msg);
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    // Cargar al montar el hook
    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    return {
        config,
        isLoading,
        isSaving,
        error,
        refresh: fetchConfig,
        updateConfig,
        resetConsecutivo,
    };
};
