// src/components/alerts/showGlobalAlert.tsx
import toast from "react-hot-toast";
import { AlertToast } from "./AlertToast";
import type { AlertType, AlertOptions } from "./types";

/**
 * Función utilitaria para mostrar alertas fuera de componentes React (ej: axios interceptors)
 */
export const showGlobalAlert = (title: string, type: AlertType, options?: AlertOptions) => {
    toast.custom(
        (t) => (
            <AlertToast
                t={t}
                title={title}
                type={type}
                options={options}
                onClose={(id) => toast.dismiss(id)}
            />
        ),
        {
            id: options?.id || `${type}-${title}-${Date.now()}`,
            duration: options?.duration || (type === 'critical' ? 8000 : 4000),
            position: options?.position || 'top-right',
        }
    );
};
