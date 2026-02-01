/**
 * Página placeholder para secciones aún no implementadas.
 * Muestra título y mensaje consistente.
 */

import { Card } from '@/components/ui';

interface PlaceholderPageProps {
  title?: string;
  description?: string;
}

export default function PlaceholderPage({ title = 'Página', description }: PlaceholderPageProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <Card>
        <Card.Content>
          <p className="text-gray-600">{description ?? 'Contenido en construcción.'}</p>
        </Card.Content>
      </Card>
    </div>
  );
}
