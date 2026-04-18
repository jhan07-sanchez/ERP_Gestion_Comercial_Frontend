import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/utils/constants';
import { Button } from '@/shared/components/ui/Button';
import { authAPI } from '@/modules/auth/api/auth.api';
import { useAlert } from '@/shared/components/alerts';

const PLANES = [
  {
    id: 'BASIC',
    name: 'Básico',
    price: '$50',
    period: '/mes',
    description: 'Perfecto para empezar',
    features: ['1 Usuario', 'Gestión de Productos Basis', 'Soporte por Email'],
    buttonColor: 'bg-slate-800 hover:bg-slate-700'
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: '$100',
    period: '/mes',
    description: 'Para pequeños negocios en crecimiento',
    features: ['5 Usuarios', 'Gestión Avanzada', 'Prueba de 7 Días', 'Soporte Prioritario'],
    buttonColor: 'bg-primary-600 hover:bg-primary-500' // Destacado
  },
  {
    id: 'ENTERPRISE',
    name: 'Empresarial',
    price: '$200',
    period: '/mes',
    description: 'Solución completa para tu empresa',
    features: ['Usuarios Ilimitados', 'Todas las Funciones', 'Soporte 24/7', 'API Access'],
    buttonColor: 'bg-slate-800 hover:bg-slate-700'
  }
];

export default function PlanesPage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    
    setLoading(true);
    try {
      await authAPI.solicitarCuenta({ ...formData, plan: selectedPlan });
      showAlert('¡Solicitud enviada correctamente! Un administrador te contactará pronto.', 'success');
      setTimeout(() => navigate(ROUTES.LOGIN), 3000);
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Ocurrió un error al enviar la solicitud.';
      showAlert(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Solicitud de Cuenta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Plan seleccionado: <span className="font-semibold text-primary-600">{selectedPlan}</span>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input
                  name="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
                <input
                  name="empresa"
                  type="text"
                  required
                  value={formData.empresa}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Ej. Mi Negocio SAS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="correo@empresa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  name="telefono"
                  type="text"
                  required
                  value={formData.telefono}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="+57 300 000 0000"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={() => setSelectedPlan(null)} className="flex-1">
                Atrás
              </Button>
              <Button type="submit" isLoading={loading} className="flex-1">
                Enviar Solicitud
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Precios</h1>
        <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Lleva tu negocio al siguiente nivel
        </p>
        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          Elige el plan que mejor se adapte a tus necesidades. Prueba gratuita de 7 días disponible.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3 lg:gap-12">
        {PLANES.map((plan) => (
          <div key={plan.id} className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col hover:shadow-xl transition-shadow duration-300">
            {plan.id === 'PRO' && (
              <div className="absolute top-0 transform translate-y-[-50%] translate-x-[50%] right-1/2">
                 <span className="inline-flex rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold tracking-wider text-primary-600 uppercase">
                    Recomendado
                 </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              <p className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="ml-1 text-xl font-semibold">{plan.period}</span>
              </p>
              <p className="mt-6 text-gray-500">{plan.description}</p>
              <ul className="mt-6 space-y-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex">
                    <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
               <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full block py-3 px-6 border border-transparent rounded-md text-center text-white font-medium hover:opacity-90 transition-opacity ${plan.buttonColor}`}
               >
                 Seleccionar Plan
               </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <button onClick={() => navigate(ROUTES.LOGIN)} className="text-primary-600 font-medium hover:text-primary-500">
          ¿Ya tienes cuenta? Iniciar Sesión
        </button>
      </div>
    </div>
  );
}
