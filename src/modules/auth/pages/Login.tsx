// src/modules/auth/pages/Login.tsx
/**
 * 🔐 COMPONENTE DE LOGIN (Estilo SaaS / 2 Columnas)
 *
 * Pantalla de inicio de sesión moderna y profesional
 * inspirada en sistemas ERP Cloud (ej: Siigo Nube).
 * Incluye:
 * - Layout dividido (Branding + Formulario)
 * - Diseño limpio con TailwindCSS
 * - Manejo de estado de autenticación
 */

import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { ROUTES } from '@/shared/utils/constants';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  // Estado local del formulario (Lazy initialization para evitar re-renders)
  const [formData, setFormData] = useState(() => {
    const savedEmail = localStorage.getItem('erp_remembered_email');
    return {
      email: savedEmail || '',
      password: '',
    };
  });

  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Estado para "Recordar mi usuario" (Lazy initialization)
  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem('erp_remembered_email');
  });

  // Estado para la advertencia del Bloq Mayús
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Manejar cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Revisar si el Bloqueo de Mayúsculas está activado
  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'));
  };

  // Manejar submit del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await login(formData);

      // Manejar "Recordar mi usuario"
      if (rememberMe) {
        localStorage.setItem('erp_remembered_email', formData.email);
      } else {
        localStorage.removeItem('erp_remembered_email');
      }

      // Si el login es exitoso (y el store guarda el token correctamente)
      // redirigimos al dashboard central.
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      // El error específico ya se maneja en el store y se muestra en la UI.
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-sans">
      {/* 
        Estilos locales para las animaciones específicas solicitadas 
        (Fade In Up) para no alterar el archivo global de tailwind. config.
      */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      {/* 
        ========================================================================
        COLUMNA IZQUIERDA: BRANDING Y MARKETING (Oculta en Mobile)
        ======================================================================== 
      */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 p-12 flex-col justify-between relative overflow-hidden bg-blue-900">

        <div className="absolute inset-0 z-0">
          <img
            src="/images/erp-bg.png"
            alt="ERP Background"
            className="w-full h-full object-cover animate-erp-bg"
          />
          {/* Degradado progresivo solicitado para mantener contraste y dejar ver la imagen */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/60 to-transparent backdrop-blur-[2px]"></div>
        </div>

        {/* Header Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white tracking-wide shadow-black/10 drop-shadow-md">
            ERP Gestión Comercial
          </span>
        </div>

        {/* Main Marketing Copy */}
        <div className="relative z-10 text-white max-w-lg mt-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            Controla tu negocio de forma inteligente
          </h1>
          <p className="text-lg text-blue-50 mb-8 leading-relaxed drop-shadow-md font-medium">
            Una solución integral para llevar la contabilidad, facturación, compras y
            ventas al siguiente nivel. Accede a tu información en tiempo real desde
            cualquier lugar.
          </p>

          {/*Lista de beneficios o tags con animaciones de entrada*/}
          <div className="flex flex-wrap gap-3">
            <span className="animate-fade-in-up delay-100 px-4 py-2 rounded-full bg-blue-900/40 text-white text-sm font-medium backdrop-blur-md border border-white/30 shadow-lg">
              ✓ Facturación Electrónica
            </span>
            <span className="animate-fade-in-up delay-200 px-4 py-2 rounded-full bg-blue-900/40 text-white text-sm font-medium backdrop-blur-md border border-white/30 shadow-lg">
              ✓ Control de Inventario
            </span>
            <span className="animate-fade-in-up delay-300 px-4 py-2 rounded-full bg-blue-900/40 text-white text-sm font-medium backdrop-blur-md border border-white/30 shadow-lg">
              ✓ Reportes en tiempo real
            </span>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="relative z-10">
          <p className="text-blue-200 text-sm drop-shadow-md">
            © {new Date().getFullYear()} Sistema ERP Profesional. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* 
        ========================================================================
        COLUMNA DERECHA: FORMULARIO DE INICIO DE SESIÓN
        ======================================================================== 
      */}
      <div className="w-full flex-1 md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        {/* Fondo de imagen visible solo en mobile */}
        <div className="absolute inset-0 md:hidden z-0 overflow-hidden">
          <img
            src="/images/erp-bg.png"
            alt="ERP Background"
            className="w-full h-full object-cover animate-erp-bg"
          />
          <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-[2px]"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo mobile */}
          <div className="flex md:hidden items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div className="bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-xl md:shadow-none p-8 md:p-0 border border-gray-100 md:border-none">
            {/* Cabecera del Formulario */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Bienvenido de nuevo!
              </h2>
              <p className="text-gray-500 text-base">
                Por favor, ingresa tus credenciales para acceder a tu cuenta.
              </p>
            </div>

            {/* Alerta de Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-600 font-medium">
                  {error}
                </span>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Campo: Correo Electrónico */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Correo electrónico
                </label>
                {/* Utilizamos group y focus-within para el color del icono */}
                <div className="relative group focus-within:text-blue-600 text-gray-400">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-base"
                    placeholder="ejemplo@empresa.com"
                  />
                </div>
              </div>

              {/* Campo: Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative group focus-within:text-blue-600 text-gray-400">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={checkCapsLock}
                    onKeyUp={checkCapsLock}
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Advertencia de Mayúsculas */}
                {capsLockActive && (
                  <p className="text-xs text-orange-500 mt-2 flex items-center font-medium animate-pulse">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Bloq Mayús activado
                  </p>
                )}
              </div>

              {/* Acciones Secundarias (Recordarme & Olvidé mi contraseña) */}
              <div className="flex items-center justify-between mt-6">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-50 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-colors"
                  />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                    Recordar mi usuario
                  </span>
                </label>

                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Botón Principal (Con mejoras visuales) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 mt-8 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-sm"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verificando...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>

            {/* Opciones de Login Social */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                   <span className="px-4 bg-white md:bg-gray-50 text-gray-500">O continuar con</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button type="button" className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow transition-all duration-200">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button type="button" className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow transition-all duration-200">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 21 21">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                  </svg>
                  Microsoft
                </button>
              </div>
            </div>

            {/* Enlace de Registro */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                ¿Aún no eres parte?{" "}
                <Link
                  to={ROUTES.PLANES}
                  className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Solicita una cuenta
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
