// src/auth/auth.types.ts
/**
 * 📝 TIPOS DE AUTENTICACIÓN
 * 
 * Define todas las interfaces y tipos relacionados con autenticación
 * Esto ayuda a TypeScript a validar nuestro código
 */

/**
 * Opciones de Suscripción
 */
export interface Suscripcion {
  plan: string;
  es_trial: boolean;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
  esta_activa: boolean;
  dias_restantes: number;
}

/**
 * Datos de usuario autenticado
 */
export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  roles: UserRole[];
  suscripcion?: Suscripcion;
}

/**
 * Rol de usuario
 */
export interface UserRole {
  id: number;
  rol: number;
  rol_nombre: string;
  rol_descripcion: string;
}

/**
 * Respuesta del login
 */
export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    is_staff: boolean;
  };
}

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Datos de registro
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
}

/**
 * Estado de autenticación en el store
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  // `isLoading`: indica que se está ejecutando una acción de auth (login/register)
  isLoading: boolean;
  // `checkingSession`: indica que la app está verificando si existe una sesión activa al arrancar
  checkingSession: boolean;
  error: string | null;
}

/**
 * Acciones de autenticación
 */
export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  loadUser: () => Promise<void>;
  setError: (error: string | null) => void;
}

/**
 * Store completo de autenticación
 */
export type AuthStore = AuthState & AuthActions;