import { useEffect } from 'react';
import { useConfigStore } from '@/shared/store/config.store';
import { useAuthStore } from '@/modules/auth/store/auth.store';

/**
 * 🛰️ CONFIG LOADER
 * 
 * Este componente se encarga de hidratar la configuración global
 * solo si el usuario está autenticado.
 */
export const ConfigLoader = ({ children }: { children: React.ReactNode }) => {
    const { hydrateConfig, isReady, isLoading } = useConfigStore();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        // Solo hidratar si estamos autenticados y no está listo
        if (isAuthenticated && !isReady && !isLoading) {
            hydrateConfig();
        }
    }, [isAuthenticated, isReady, isLoading, hydrateConfig]);

    // Si estamos autenticados pero la config no está lista, podemos mostrar un loader
    // Si no está autenticado, dejamos pasar al Login (donde no se necesita config global aún)
    if (isAuthenticated && !isReady) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="text-sm font-medium text-gray-600">Cargando parámetros del ERP...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
