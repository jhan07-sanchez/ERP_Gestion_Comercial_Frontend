// src/components/alerts/types.ts
export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'critical';

export interface AlertOptions {
    id?: string;
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    description?: string;
    showInput?: boolean;
    inputPlaceholder?: string;
    action?: {
        label: string;
        onClick: (inputValue?: string) => void;
    };
    persistent?: boolean;
}

export interface AlertContextType {
    showAlert: (title: string, type: AlertType, options?: AlertOptions) => void;
    hideAlert: (id: string) => void;
    confirm: (title: string, message: string, type?: AlertType) => Promise<boolean>;
    prompt: (title: string, message: string, defaultValue?: string) => Promise<string | null>;
}
