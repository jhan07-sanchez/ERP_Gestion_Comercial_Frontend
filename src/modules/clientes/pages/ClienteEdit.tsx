/**
 * Edición de cliente.
 */

import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui';

export default function ClienteEdit() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Editar cliente {id}</h1>
      <Card>
        <Card.Content>
          <p className="text-gray-600">Formulario de edición. Contenido en construcción.</p>
        </Card.Content>
      </Card>
    </div>
  );
}
