/**
 * Página placeholder para secciones aún no implementadas.
 * Muestra título y mensaje consistente.
 */

import { useEffect, useRef } from "react";
import { Card } from "@/shared/components/ui";
import { useAlert } from "@/shared/components/alerts/useAlert";

interface PlaceholderPageProps {
  title?: string;
  description?: string;
  showAlertOnMount?: boolean;
}

export default function PlaceholderPage({
  title = "Página",
  description = "Contenido en construcción.",
  showAlertOnMount = true,
}: PlaceholderPageProps) {
  const { showAlert } = useAlert();
  const alertShown = useRef(false);

  useEffect(() => {
    if (!showAlertOnMount || alertShown.current) return;

    alertShown.current = true;

    showAlert("MÓDULO EN CONSTRUCCIÓN", "warning", {
      description,
    });
  }, [description, showAlertOnMount, showAlert]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-900 mb-4">{title}</h1>

      <Card>
        <Card.Content>
          <p className="text-primary-600">{description}</p>
        </Card.Content>
      </Card>
    </div>
  );
}
