import React, { useEffect, useState } from "react";
import { Card, Input, Button, Badge } from "@/shared/components/ui";
import {
  IconCreditCard,
  IconPlus,
} from "@tabler/icons-react";
import { metodosPagoAPI } from "@/modules/caja/api/Caja.api";
import { useAlert } from "@/shared/components/alerts";
import type { MetodoPago } from "@/modules/caja/types/Caja.types";

export const SeccionMetodosPago: React.FC = () => {
  const { showAlert } = useAlert();

  const [metodos, setMetodos] = useState<MetodoPago[]>([]);
  const [loading, setLoading] = useState(false);

  const [nuevoMetodo, setNuevoMetodo] = useState("");

  // ── Cargar métodos ─────────────────────────
  useEffect(() => {
    const cargarMetodos = async () => {
      setLoading(true);
      try {
        const data = await metodosPagoAPI.getMetodosPago();

        // 🔥 CLAVE: asegurar array
        setMetodos(Array.isArray(data) ? data : []);
      } catch {
        showAlert("Error", "error", {
          description: "No se pudieron cargar los métodos de pago",
        });
      } finally {
        setLoading(false);
      }
    };

    cargarMetodos();
  }, [showAlert]);

  // ── Crear método ─────────────────────────
  const handleCrear = async () => {
    if (!nuevoMetodo.trim()) {
      showAlert("Validación", "warning", {
        description: "El nombre es obligatorio",
      });
      return;
    }

    try {
      // ⚠️ Necesitas endpoint POST en backend
      await metodosPagoAPI.crearMetodoPago({
        nombre: nuevoMetodo,
      });

      showAlert("Éxito", "success", {
        description: "Método de pago creado",
      });

      setNuevoMetodo("");
      // Reload methods after creation
      const data = await metodosPagoAPI.getMetodosPago();
      setMetodos(Array.isArray(data) ? data : []);
    } catch {
      showAlert("Error", "error", {
        description: "No se pudo crear el método",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Crear método */}
      <Card className="border-primary-200 shadow-sm">
        <Card.Header className="bg-primary-50 flex items-center gap-2">
          <IconCreditCard size={18} />
          <Card.Title>Métodos de Pago</Card.Title>
        </Card.Header>

        <Card.Content className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ej: Efectivo, Transferencia..."
              value={nuevoMetodo}
              onChange={(e) => setNuevoMetodo(e.target.value)}
            />

            <Button onClick={handleCrear}>
              <IconPlus size={16} />
              Crear
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* Lista */}
      <Card className="border-primary-200 shadow-sm">
        <Card.Header>
          <Card.Title>Listado</Card.Title>
        </Card.Header>

        <Card.Content className="space-y-3">
          {loading ? (
            <p className="text-sm text-primary-400">Cargando...</p>
          ) : metodos.length === 0 ? (
            <p className="text-sm text-primary-400">
              No hay métodos de pago registrados
            </p>
          ) : (
            metodos.map((mp) => (
              <div
                key={mp.id}
                className="flex items-center justify-between border p-3 rounded-xl"
              >
                <div>
                  <p className="font-bold">{mp.nombre}</p>
                </div>

                <Badge variant={mp.activo ? "success" : "gray"}>
                  {mp.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            ))
          )}
        </Card.Content>
      </Card>
    </div>
  );
};
