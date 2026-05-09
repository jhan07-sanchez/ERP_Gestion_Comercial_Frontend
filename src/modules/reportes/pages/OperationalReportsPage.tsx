import { useState, useEffect } from 'react';
import { PageContainer, PageHeader, Loader, Card } from '@shared/components/ui';
import { useReportes } from '../hooks/useReportes';
import { 
  IconActivity, 
  IconUsers, 
  IconTrendingUp,
  IconClock,
  IconChartBar
} from '@tabler/icons-react';
import type { ProductividadData, ProyeccionData } from '../types/reportes.types';

export default function OperationalReportsPage() {
  const { getProductividad, getProyecciones, loading } = useReportes();
  const [productividad, setProductividad] = useState<ProductividadData[]>([]);
  const [proyecciones, setProyecciones] = useState<ProyeccionData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setProductividad(await getProductividad() || []);
      setProyecciones(await getProyecciones());
    };
    loadData();
  }, [getProductividad, getProyecciones]);

  return (
    <PageContainer>
      <PageHeader 
        title="Análisis Operativo y Proyecciones" 
        description="Rendimiento del equipo, eficiencia de ventas y estimaciones futuras basadas en IA."
        icon={<IconActivity size={28} className="text-accent-600" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Panel de Productividad */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-xs font-black text-primary-400 uppercase tracking-widest flex items-center gap-2">
              <IconUsers size={16} /> Rendimiento de Vendedores
           </h3>
           {loading ? <Loader /> : (
             <div className="bg-white rounded-3xl border border-primary-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                   <thead className="bg-primary-50 border-b border-primary-100">
                      <tr>
                         <th className="px-6 py-4 text-[10px] font-black text-primary-400 uppercase tracking-widest">Asesor</th>
                         <th className="px-6 py-4 text-[10px] font-black text-primary-400 uppercase tracking-widest">Ventas</th>
                         <th className="px-6 py-4 text-[10px] font-black text-primary-400 uppercase tracking-widest">Tickets</th>
                         <th className="px-6 py-4 text-[10px] font-black text-primary-400 uppercase tracking-widest">Promedio</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-primary-50">
                      {productividad.map((p) => (
                        <tr key={p.empleado_id} className="hover:bg-primary-50/50 transition-colors">
                           <td className="px-6 py-4 font-bold text-primary-900">{p.nombre}</td>
                           <td className="px-6 py-4 font-black text-accent-600">${p.total_ventas.toLocaleString()}</td>
                           <td className="px-6 py-4 font-bold text-primary-500">{p.cantidad}</td>
                           <td className="px-6 py-4 font-bold text-primary-700">${p.ticket_promedio.toLocaleString()}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           )}
        </div>

        {/* Panel de Proyecciones */}
        <div className="lg:col-span-1 space-y-6">
           <h3 className="text-xs font-black text-primary-400 uppercase tracking-widest flex items-center gap-2">
              <IconTrendingUp size={16} /> Estimaciones de Ventas
           </h3>
           <div className="space-y-4">
              <Card className="p-8 border-none bg-gradient-to-br from-primary-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
                 <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-accent-500/20 rounded-full blur-2xl" />
                 <p className="text-[10px] font-black text-primary-300 uppercase tracking-widest mb-1 relative z-10">Proyección 30 Días</p>
                 <p className="text-3xl font-black relative z-10">
                   ${proyecciones?.proyeccion_30d.toLocaleString() || '---'}
                 </p>
                 <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-accent-400 uppercase relative z-10">
                    <IconClock size={12} /> Basado en promedio móvil 30D
                 </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-6 rounded-3xl border border-primary-100 shadow-sm">
                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Próximos 7D</p>
                    <p className="text-lg font-black text-primary-900">${proyecciones?.proyeccion_7d.toLocaleString() || '---'}</p>
                 </div>
                 <div className="bg-white p-6 rounded-3xl border border-primary-100 shadow-sm">
                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Próximos 15D</p>
                    <p className="text-lg font-black text-primary-900">${proyecciones?.proyeccion_15d.toLocaleString() || '---'}</p>
                 </div>
              </div>

              <div className="p-6 rounded-3xl bg-accent-50 border border-accent-100 flex items-center gap-4">
                 <div className="w-10 h-10 bg-accent-100 text-accent-600 rounded-xl flex items-center justify-center">
                    <IconChartBar size={20} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-accent-600 uppercase tracking-widest">Promedio Diario</p>
                    <p className="text-sm font-black text-primary-900">${proyecciones?.diario_promedio.toLocaleString() || '---'}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </PageContainer>
  );
}
