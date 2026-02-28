// src/components/alerts/AlertProvider.tsx
import React, { useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AlertToast } from "./AlertToast";
import { AlertContext } from "./AlertContext";
import { showGlobalAlert } from "./showGlobalAlert";
import type { AlertType, AlertOptions } from "./types";

export function AlertProvider({ children }: { children: React.ReactNode }) {
    const showAlert = useCallback(
        (title: string, type: AlertType, options?: AlertOptions) => {
            showGlobalAlert(title, type, options);
        },
        []
    );

    const hideAlert = useCallback((id: string) => {
        toast.dismiss(id);
    }, []);

    /**
     * Reemplazo profesional para window.confirm()
     * Retorna una Promesa que se resuelve a true (Aceptar) o false (Cancelar)
     */
    const confirm = useCallback(
        (title: string, message: string, type: AlertType = 'warning'): Promise<boolean> => {
            return new Promise((resolve) => {
                toast.custom(
                    (t) => (
                        <AlertToast
                            t={t}
                            title={title}
                            type={type}
                            options={{
                                description: message,
                                duration: Infinity,
                                action: {
                                    label: "Confirmar",
                                    onClick: () => {
                                        resolve(true);
                                        toast.dismiss(t.id);
                                    },
                                },
                            }}
                            onClose={(id) => {
                                resolve(false);
                                toast.dismiss(id);
                            }}
                        />
                    ),
                    {
                        id: `confirm-${Date.now()}`,
                        duration: Infinity, // No se cierra solo
                        position: 'top-center',
                    }
                );
            });
        },
        []
    );

    /**
     * Reemplazo profesional para window.prompt()
     */
    const prompt = useCallback(
        (title: string, message: string, defaultValue: string = ''): Promise<string | null> => {
            return new Promise((resolve) => {
                toast.custom(
                    (t) => (
                        <AlertToast
                            t={t}
                            title={title}
                            type="info"
                            options={{
                                description: message,
                                showInput: true,
                                inputPlaceholder: "Ingresa el motivo...",
                                duration: Infinity,
                                action: {
                                    label: "Enviar",
                                    onClick: (val) => {
                                        resolve(val || defaultValue);
                                        toast.dismiss(t.id);
                                    },
                                },
                            }}
                            onClose={(id) => {
                                resolve(null);
                                toast.dismiss(id);
                            }}
                        />
                    ),
                    {
                        id: `prompt-${Date.now()}`,
                        duration: Infinity,
                        position: 'top-center',
                    }
                );
            });
        },
        []
    );

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert, confirm, prompt }}>
            {children}
            <Toaster
                position="top-right"
                containerStyle={{
                    top: 40,
                    right: 40,
                }}
                toastOptions={{
                    style: {
                        background: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                        padding: 0,
                    }
                }}
            />
        </AlertContext.Provider>
    );
}
