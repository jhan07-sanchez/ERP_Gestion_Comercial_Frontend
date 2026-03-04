import { create } from 'zustand';
import { configuracionAPI } from '@/modules/configuracion/api/configuracion.api';
import type { Configuracion } from '@/modules/configuracion/types/configuracion.types';

interface ConfigState {
    config: Configuracion | null;
    isLoading: boolean;
    isReady: boolean;
    error: string | null;

    // Acciones
    hydrateConfig: () => Promise<void>;
    setConfig: (config: Configuracion) => void;

    // Getters seguros con Fallbacks
    getImpuesto: () => number;
    getMoneda: () => string;
    getSimbolo: () => string;
    getPermitirVentaSinStock: () => boolean;
    getTasaCambio: () => number;
    convertPrice: (price: number) => number;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
    config: null,
    isLoading: false,
    isReady: false,
    error: null,

    hydrateConfig: async () => {
        if (get().isLoading) return;

        set({ isLoading: true, error: null });
        try {
            const config = await configuracionAPI.getConfiguracion();
            set({ config, isReady: true, isLoading: false });
        } catch (error: unknown) {
            console.error('Error hydrating config:', error);
            set({
                error: error as string || 'Error al cargar la configuración',
                isLoading: false,
                isReady: false
            });
        }
    },

    setConfig: (config) => set({ config, isReady: true }),

    // Getters con fallbacks corporativos seguros
    getImpuesto: () => {
        const config = get().config;
        if (!config) return 19; // Fallback Colombia estándar
        return typeof config.impuesto_porcentaje === 'string'
            ? parseFloat(config.impuesto_porcentaje)
            : config.impuesto_porcentaje;
    },

    getMoneda: () => get().config?.moneda || 'COP',

    getSimbolo: () => get().config?.simbolo_moneda || '$',

    getPermitirVentaSinStock: () => get().config?.permitir_venta_sin_stock ?? false,

    getTasaCambio: () => {
        const value = get().config?.tasa_cambio;
        if (!value) return 1.0;
        return typeof value === 'string' ? parseFloat(value) : value;
    },

    convertPrice: (price) => {
        const config = get().config;
        if (!config || !config.tasa_cambio) return price;
        const rate = typeof config.tasa_cambio === 'string'
            ? parseFloat(config.tasa_cambio)
            : config.tasa_cambio;

        // Asumiendo que los precios en DB están en Moneda Base (ej: COP)
        // y la tasa_cambio es quanto vale 1 unidad de la Moneda Base en la Moneda Actual.
        // O viceversa. Para el usuario: "1 USD = 4000 COP", si el precio es 4000 COP, en USD es 1.
        // Entonces: PrecioActual = PrecioBase / TasaCambio
        if (config.moneda === 'COP' || rate === 0) return price;
        return price / rate;
    }
}));
