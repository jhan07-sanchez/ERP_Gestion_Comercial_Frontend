import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Badge } from "@/shared/components/ui";
import { Loader } from "@/shared/components/Loader";
import { IconLock, IconCalculator } from "@tabler/icons-react";

import { useCajaActions } from "../hooks/useCajaActions";
import { getEstadoSesionLabel } from "../types/Caja.types";
import { CajaService } from "../services/cajaService";
import type { SesionCaja } from "../types/Caja.types";

import {
  formatCurrency,
  formatDate,
  formatRelativeDate,
} from "../../../shared/utils/formatters";

export default function CajaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchDetalleCompleto } = useCajaActions();

  const sesionId = Number(id);

  const [cajaDetalle, setCajaDetalle] = useState<SesionCaja | null>(null);
  const [movimientos, setMovimientos] = useState<Array<{ id: number; es_ingreso: boolean; tipo: string; descripcion: string; monto: number; fecha: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sesionId) return;

    let mounted = true;

    const loadDetalle = async () => {
      try {
        const data = await fetchDetalleCompleto(sesionId);

        if (data && mounted) {
          setCajaDetalle(data);
          setMovimientos((data.movimientos || []).map(mov => ({
            id: mov.id,
            es_ingreso: mov.tipo?.includes('INGRESO') ?? false,
            tipo: mov.tipo,
            descripcion: mov.descripcion || '',
            monto: typeof mov.monto === 'string' ? parseFloat(mov.monto) : mov.monto,
            fecha: mov.fecha
          })));
        }
      } catch (err) {
        console.error(err);
        if (mounted) navigate("/caja");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDetalle();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesionId]);

  const handleCerrar = () => {
    navigate(`/caja/sesion/${sesionId}/cerrar`);
  };

  const handleArqueo = () => {
    navigate(`/caja/sesion/${sesionId}/arqueo`);
  };

  const handleVolver = () => {
    navigate(-1);
  };

  if (loading || !cajaDetalle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const datosResumen = CajaService.generarResumen(cajaDetalle);
  const permisos = CajaService.obtenerPermisosOperacion(cajaDetalle);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={handleVolver}>
          ← Volver
        </Button>

        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {cajaDetalle.caja_nombre} #{cajaDetalle.id}
          </h1>

          <p className="text-gray-500">
            Sesión {cajaDetalle.usuario_nombre} -{" "}
            {formatRelativeDate(
              cajaDetalle.fecha_apertura,
              !!cajaDetalle.fecha_cierre 
            )}
          </p>
        </div>

        <Badge variant={cajaDetalle.estado === "ABIERTA" ? "success" : "gray"}>
          {getEstadoSesionLabel(cajaDetalle.estado)}
        </Badge>
      </div>

      {/* Resumen */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Content>
            <p className="text-xs text-gray-500">Monto Inicial</p>
            <p className="text-2xl font-bold">
              {formatCurrency(datosResumen.montoInicial)}
            </p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <p className="text-xs text-gray-500">Total Ingresos</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(datosResumen.totalIngresos)}
            </p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <p className="text-xs text-gray-500">Total Egresos</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(datosResumen.totalEgresos)}
            </p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <p className="text-xs text-gray-500">Saldo Esperado</p>
            <p className="text-2xl font-bold">
              {formatCurrency(datosResumen.saldoEsperado)}
            </p>
          </Card.Content>
        </Card>
      </div>

      {/* Detalles */}

      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Detalles de la Sesión</h3>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <p>
                <strong>Caja:</strong> {cajaDetalle.caja_nombre}
              </p>

              <p>
                <strong>Usuario:</strong> {cajaDetalle.usuario_nombre}
              </p>

              <p>
                <strong>Estado:</strong>{" "}
                <Badge
                  variant={
                    cajaDetalle.estado === "ABIERTA" ? "success" : "gray"
                  }
                >
                  {getEstadoSesionLabel(cajaDetalle.estado)}
                </Badge>
              </p>
            </div>

            <div className="space-y-4">
              <p>
                <strong>Abierta:</strong>{" "}
                {formatDate(cajaDetalle.fecha_apertura, false)}
              </p>

              <p>
                <strong>Cerrada:</strong>{" "}
                {cajaDetalle.fecha_cierre
                  ? formatDate(cajaDetalle.fecha_cierre, false)
                  : "Sesión abierta"}
              </p>

              <p>
                <strong>Observaciones:</strong>{" "}
                {cajaDetalle.observaciones_apertura || "-"}
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Movimientos */}

      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">
            Movimientos ({movimientos.length})
          </h3>
        </Card.Header>

        <Card.Content>
          {movimientos.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No hay movimientos registrados
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left">Tipo</th>
                  <th className="text-left">Descripción</th>
                  <th className="text-right">Monto</th>
                  <th className="text-left">Hora</th>
                </tr>
              </thead>

              <tbody>
                {movimientos.map((mov: { id: number; es_ingreso: boolean; tipo: string; descripcion: string; monto: number; fecha: string }) => (
                  <tr key={mov.id}>
                    <td>
                      <Badge variant={mov.es_ingreso ? "success" : "danger"}>
                        {mov.tipo}
                      </Badge>
                    </td>

                    <td>{mov.descripcion}</td>

                    <td className="text-right">
                      {mov.es_ingreso ? "+" : "-"}
                      {formatCurrency(mov.monto)}
                    </td>

                    <td className="text-xs text-gray-500">
                      {formatDate(mov.fecha, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card.Content>
      </Card>

      {/* Acciones */}

      <div className="flex gap-3 justify-end">
        {permisos.puedeCerrar && (
          <Button onClick={handleCerrar}>
            <IconLock size={16} />
            Cerrar Caja
          </Button>
        )}

        {permisos.puedeRegistrarArqueo && (
          <Button onClick={handleArqueo}>
            <IconCalculator size={16} />
            Registrar Arqueo
          </Button>
        )}
      </div>
    </div>
  );
}
