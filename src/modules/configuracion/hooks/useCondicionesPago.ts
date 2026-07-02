import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { configuracionAPI } from '@/modules/configuracion/api/configuracion.api';
import type { CondicionPago } from '@/modules/configuracion/types/configuracion.types';
import { getApiErrorMessage } from '@/shared/utils/apiError';

type CondicionPagoCreatePayload = {
  nombre: string;
  dias_plazo: number;
  activo?: boolean;
};

export const useCondicionesPago = () => {
    const [condiciones, setCondiciones] = useState<CondicionPago[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCondiciones = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await configuracionAPI.getCondicionesPago();
            setCondiciones(Array.isArray(data) ? data : []);
        } catch (err) {
            const msg = getApiErrorMessage(err, 'Error al cargar condiciones de pago');
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createCondicion = useCallback(async (payload: CondicionPagoCreatePayload) => {
        setIsSaving(true);
        try {
            const created = await configuracionAPI.createCondicionPago(payload);
            setCondiciones((prev) => [created, ...prev]);
            toast.success('Condición de pago creada');
            return created;
        } catch (err) {
            const msg = getApiErrorMessage(err, 'Error creando condición de pago');
            toast.error(msg);
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, []);

    const updateCondicion = useCallback(async (id: number, payload: Partial<CondicionPagoCreatePayload>) => {
        setIsSaving(true);
        try {
            const updated = await configuracionAPI.updateCondicionPago(id, payload);
            setCondiciones((prev) => prev.map((c) => (c.id === id ? updated : c)));
            toast.success('Condición de pago actualizada');
            return updated;
        } catch (err) {
            const msg = getApiErrorMessage(err, 'Error actualizando condición de pago');
            toast.error(msg);
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, []);

    const toggleActivo = useCallback(async (id: number, activo: boolean) => {
        return updateCondicion(id, { activo });
    }, [updateCondicion]);

    const deleteCondicion = useCallback(async (id: number) => {
        // Nota: la UI no debe exponer borrado físico; este método queda disponible por si es necesario.
        setIsSaving(true);
        try {
            await configuracionAPI.deleteCondicionPago(id);
            setCondiciones((prev) => prev.filter((c) => c.id !== id));
            toast.success('Condición eliminada');
        } catch (err) {
            const msg = getApiErrorMessage(err, 'Error eliminando condición de pago');
            toast.error(msg);
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, []);

    useEffect(() => {
        fetchCondiciones();
    }, [fetchCondiciones]);

    return {
        condiciones,
        isLoading,
        isSaving,
        error,
        refresh: fetchCondiciones,
        createCondicion,
        updateCondicion,
        toggleActivo,
        deleteCondicion,
    } as const;
};

export default useCondicionesPago;
