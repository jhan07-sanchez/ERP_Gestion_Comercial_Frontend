import { useAuthStore } from '../store/auth.store';

export function useSuscripcion() {
  const { user } = useAuthStore();
  const suscripcion = user?.suscripcion;

  // Si no hay suscripcion en el usuario, asumimos uso normal o infinito, depende del caso de uso.
  // Pero si existe, chequeamos
  const isTrial = suscripcion?.es_trial ?? false;
  const estaActiva = suscripcion?.esta_activa ?? true;
  const diasRestantes = suscripcion?.dias_restantes ?? 0;
  
  // Limitar acciones mutables si NO está activa
  const isReadOnly = !estaActiva;

  return {
    suscripcion,
    isTrial,
    estaActiva,
    diasRestantes,
    isReadOnly,
  };
}
