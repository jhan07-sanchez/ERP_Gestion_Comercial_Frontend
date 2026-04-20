// src/components/alerts/AlertToast.tsx
import { motion } from "framer-motion";
import {
    IconCheck,
    IconAlertTriangle,
    IconAlertCircle,
    IconInfoCircle,
    IconX
} from "@tabler/icons-react";
import type { AlertType, AlertOptions } from "./types";

interface AlertToastProps {
    t: { id: string; visible: boolean };
    title: string;
    type: AlertType;
    options?: AlertOptions;
    onClose: (id: string) => void;
}

const config = {
    success: {
        icon: IconCheck,
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        text: "text-emerald-900",
        iconColor: "text-emerald-500",
        bar: "bg-emerald-500"
    },
    error: {
        icon: IconAlertCircle,
        bg: "bg-red-50",
        border: "border-red-100",
        text: "text-red-900",
        iconColor: "text-red-500",
        bar: "bg-red-500"
    },
    warning: {
        icon: IconAlertTriangle,
        bg: "bg-amber-50",
        border: "border-amber-100",
        text: "text-amber-900",
        iconColor: "text-amber-500",
        bar: "bg-amber-500"
    },
    info: {
        icon: IconInfoCircle,
        bg: "bg-blue-50",
        border: "border-blue-100",
        text: "text-blue-900",
        iconColor: "text-blue-500",
        bar: "bg-blue-500"
    },
    critical: {
        icon: IconAlertCircle,
        bg: "bg-gray-900",
        border: "border-gray-800",
        text: "text-white",
        iconColor: "text-red-500",
        bar: "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
    }
};

export function AlertToast({ t, title, type, options, onClose }: AlertToastProps) {
    const styles = config[type];
    const Icon = styles.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
            className={`
        relative pointer-events-auto flex w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl transition-all duration-300
        ${styles.bg} ${styles.border}
      `}
        >
            {/* Dynamic progress bar / accent bar */}
            <div className={`w-1.5 shrink-0 ${styles.bar}`} />

            <div className="flex flex-1 items-start gap-4 p-4">
                {/* Icon & Shadow background */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/50 shadow-inner ${styles.iconColor}`}>
                    <Icon size={24} stroke={2.5} />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                    <h3 className={`text-sm font-black uppercase tracking-tight ${styles.text}`}>
                        <span>{title}</span>
                    </h3>
                    {options?.description && (
                        <p className={`text-xs font-bold leading-relaxed opacity-70 ${styles.text}`}>
                            <span>{options.description}</span>
                        </p>
                    )}

                    {options?.showInput && (
                        <input
                            type="text"
                            autoFocus
                            placeholder={options.inputPlaceholder || "Escribe aquí..."}
                            className={`w-full rounded-lg border border-current bg-white/20 p-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-white/50 ${styles.text}`}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    options.action?.onClick((e.currentTarget as HTMLInputElement).value);
                                    onClose(t.id);
                                }
                            }}
                        />
                    )}

                    {options?.action && (
                        <button
                            onClick={() => {
                                const inputVal = (document.querySelector(`[placeholder="${options.inputPlaceholder || "Escribe aquí..."}"]`) as HTMLInputElement)?.value;
                                options.action?.onClick(inputVal);
                                onClose(t.id);
                            }}
                            className={`mt-2 text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4 hover:opacity-80 transition-opacity ${styles.text}`}
                        >
                            {options.action.label}
                        </button>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={() => onClose(t.id)}
                    className={`shrink-0 rounded-lg p-1 transition-colors hover:bg-white/20 ${styles.text}`}
                >
                    <IconX size={18} stroke={2.5} />
                </button>
            </div>

            {/* Progress Bar (Auto-dismiss indicator) */}
            {options?.duration !== Infinity && t.visible && (
                <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: (options?.duration || 4000) / 1000, ease: "linear" }}
                    className={`absolute bottom-0 left-0 h-1 opacity-40 ${styles.bar}`}
                />
            )}
        </motion.div>
    );
}
