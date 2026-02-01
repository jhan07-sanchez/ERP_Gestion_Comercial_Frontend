/**
 * Página 404 - Ruta no encontrada.
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
        <p className="text-gray-500 mt-2">La ruta a la que intentas acceder no existe.</p>
        <Link to={ROUTES.DASHBOARD} className="inline-block mt-6">
          <Button variant="primary">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
