/**
 * 🚩 COMPONENTE: CajaBanner
 * 
 * Banner global que notifica al usuario si tiene una caja abierta o no.
 * Se muestra en el layout principal para dar feedback constante.
 * 
 * REGLA OPERATIVA:
 * - Rojo/Amarillo: No hay caja abierta (Operaciones bloqueadas)
 * - Verde: Caja abierta (Sistema operativo)
 */

import { useNavigate } from "react-router-dom";
import { useCajaStore } from "@/modules/caja/store/caja.store";
import { Button } from "./ui";
import { IconAlertCircle, IconCheck, IconWallet } from "@tabler/icons-react";

export const CajaBanner = () => {
    const navigate = useNavigate();
    const { isCajaAbierta, sesionActiva, isLoading, isHydrated } = useCajaStore();

    // Si está cargando o no se ha hidratado, no mostramos nada para evitar parpadeo
    if (isLoading || !isHydrated) return null;

    if (isCajaAbierta) {
        return (
          <div className="bg-success-50 border-b border-success-100 py-2 px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3">
              <div className="bg-success-500 p-1.5 rounded-button shadow-sm shadow-success-200">
                <IconCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-success-900 leading-tight">
                  SISTEMA OPERATIVO · CAJA ABIERTA
                </p>
                <p className="text-[10px] text-success-600 font-medium">
                  Sesión activa:{" "}
                  <span className="font-bold">{sesionActiva?.caja_nombre}</span>{" "}
                  · Usuario:{" "}
                  <span className="font-bold">
                    {sesionActiva?.usuario_nombre}
                  </span>
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="h-8 text-[10px] font-bold bg-white hover:bg-success-100 border-success-200 text-success-700"
              onClick={() => navigate("/caja/dashboard")}
            >
              <IconWallet className="w-3 h-3 mr-2" />
              Gestionar Caja
            </Button>
          </div>
        );
    }

    return (
        <div className="bg-warning-50 border-b border-warning-100 py-3 px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-warning-500 p-2 rounded-xl shadow-lg shadow-warning-200 animate-pulse shrink-0">
                    <IconAlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-warning-900 tracking-tight">
                        ACCIONES RESTRINGIDAS · CAJA CERRADA
                    </h3>
                    <p className="text-xs text-warning-700 font-medium">
                        Debe abrir una sesión de caja para poder registrar ventas, compras o movimientos financieros.
                    </p>
                </div>
            </div>

            <Button
                variant="primary"
                size="sm"
                className="bg-warning-600 hover:bg-warning-700 border-none shadow-md shadow-warning-200 text-[11px] font-black h-9 px-5 w-full sm:w-auto"
                onClick={() => navigate("/caja/sesiones/nueva")}
            >
                <IconWallet className="w-4 h-4 mr-2" />
                ABRIR CAJA AHORA
            </Button>
        </div>
    );
};
