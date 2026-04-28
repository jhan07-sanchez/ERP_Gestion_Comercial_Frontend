import { useSuscripcion } from '@/modules/auth/hooks/useSuscripcion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/utils/constants';

export function TrialBanner() {
  const { suscripcion, isTrial, estaActiva, diasRestantes } = useSuscripcion();
  const navigate = useNavigate();

  if (!suscripcion || !isTrial) return null;

  return (
    <div className={`p-4 text-center text-sm font-medium sticky top-0 z-50 flex items-center justify-center gap-4 ${
      estaActiva 
        ? 'bg-accent-600 text-white shadow-md' 
        : 'bg-danger-600 text-white shadow-lg'
      }`}>
      {estaActiva ? (
        <span>Te quedan {diasRestantes} días de prueba gratuita.</span>
      ) : (
        <span>Tu prueba ha terminado. El sistema está en modo de solo lectura.</span>
      )}
      
      <button 
        onClick={() => navigate(ROUTES.PLANES)}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
          estaActiva 
            ? 'bg-white text-accent-600 hover:bg-accent-50' 
            : 'bg-white text-danger-600 hover:bg-danger-50'
        }`}
      >
        {estaActiva ? 'Actualizar Plan' : 'Ver Planes'}
      </button>
    </div>
  );
}
