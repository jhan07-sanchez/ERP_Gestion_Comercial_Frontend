import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { Modal } from '@shared/components/ui';
import { useAlert } from '@/shared/components/alerts/useAlert';

// Configurations (Configurable env vars fallback to 55 / 60 mins)
const WARNING_TIMEOUT = import.meta.env.VITE_SESSION_WARNING_MINUTES 
  ? Number(import.meta.env.VITE_SESSION_WARNING_MINUTES) * 60 * 1000 
  : 55 * 60 * 1000;

const LOGOUT_TIMEOUT = import.meta.env.VITE_SESSION_LOGOUT_MINUTES 
  ? Number(import.meta.env.VITE_SESSION_LOGOUT_MINUTES) * 60 * 1000 
  : 60 * 60 * 1000;

export function SessionTimeoutManager() {
  const { isAuthenticated, logout } = useAuthStore();
  const { showAlert } = useAlert();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const lastActivity = useRef<number>(0);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    lastActivity.current = Date.now();
  }, []);

  // Throttled activity updater to avoid excessive execution
  const activityThrottler = useRef<boolean>(false);

  const handleAutoLogout = useCallback(() => {
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    setShowWarning(false);
    logout();
    showAlert('Sesión caducada', 'warning', { description: 'Su sesión caducó por inactividad.', duration: 6000 });
  }, [logout, showAlert]);

  const startTimers = useCallback(() => {
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);

    lastActivity.current = Date.now();

    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(Math.floor((LOGOUT_TIMEOUT - WARNING_TIMEOUT) / 1000));

      countdownInterval.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

    }, WARNING_TIMEOUT);

    logoutTimer.current = setTimeout(() => {
      handleAutoLogout();
    }, LOGOUT_TIMEOUT);

  }, [handleAutoLogout]);

  const resetTimers = useCallback(() => {
    if (!isAuthenticated) return;
    setShowWarning(false);
    startTimers();
  }, [isAuthenticated, startTimers]);

  const handleUserActivity = useCallback(() => {
    // Only reset if auth'd and warning is not showing
    if (!activityThrottler.current && !showWarning && isAuthenticated) {
      activityThrottler.current = true;
      startTimers(); // No need to set showWarning(false) since it is not showing
      setTimeout(() => {
        activityThrottler.current = false;
      }, 1000); // 1-second throttle
    }
  }, [showWarning, isAuthenticated, startTimers]);

  const handleKeepSession = useCallback(() => {
    resetTimers();
  }, [resetTimers]);

  useEffect(() => {
    if (isAuthenticated) {
      startTimers(); // Solo iniciamos timers, sin setear estado de forma destructiva

      const events = ['mousemove', 'keydown', 'wheel', 'mousedown', 'touchstart', 'touchmove'];
      events.forEach((event) => {
        window.addEventListener(event, handleUserActivity);
      });

      return () => {
        if (warningTimer.current) clearTimeout(warningTimer.current);
        if (logoutTimer.current) clearTimeout(logoutTimer.current);
        if (countdownInterval.current) clearInterval(countdownInterval.current);

        events.forEach((event) => {
          window.removeEventListener(event, handleUserActivity);
        });
      };
    }
  }, [isAuthenticated, startTimers, handleUserActivity]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) return null;

  return (
    <Modal
      isOpen={showWarning}
      onClose={handleKeepSession} // Treating 'x' or 'Esc' as keeping session alive
      title="Advertencia de Inactividad"
    >
      <div className="flex flex-col gap-4 text-center">
        <p className="text-primary-700">
          Su sesión caducará en <span className="font-bold text-danger-600">{formatCountdown(countdown)}</span> por inactividad.
        </p>
        <p className="text-sm text-primary-500">
          ¿Desea mantener su sesión iniciada o cerrarla ahora?
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleAutoLogout}
            className="px-4 py-2 border border-primary-300 text-primary-700 rounded-button hover:bg-primary-50 transition-colors"
          >
            Cerrar sesión
          </button>
          <button
            onClick={handleKeepSession}
            className="px-4 py-2 bg-accent-600 text-white rounded-button hover:bg-accent-700 transition-colors"
          >
            Mantener sesión iniciada
          </button>
        </div>
      </div>
    </Modal>
  );
}
