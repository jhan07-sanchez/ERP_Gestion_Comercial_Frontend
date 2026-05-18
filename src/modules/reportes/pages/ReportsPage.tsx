import { useNavigate } from 'react-router-dom';
import { PageContainer, PageHeader } from '@shared/components/ui';
import { 
  IconWallet, 
  IconActivity, 
  IconChartDots, 
  IconChevronRight,
  IconReportMoney,
  IconArrowsExchange,
  IconUsers,
  IconTrendingUp,
  IconTarget
} from '@tabler/icons-react';

export default function ReportsPage() {
  const navigate = useNavigate();

  const reportModules = [
    {
      title: "Financieros",
      icon: <IconWallet className="text-success-600" />,
      description: "Balance General, P&L y Flujo de Caja",
      reports: [
        { name: "Estado de Resultados", path: "/reportes/financieros", icon: <IconReportMoney size={16} /> },
        { name: "Balance General", path: "/reportes/financieros", icon: <IconWallet size={16} /> },
        { name: "Flujo de Caja", path: "/reportes/financieros", icon: <IconArrowsExchange size={16} /> },
      ]
    },
    {
      title: "Operativos",
      icon: <IconActivity className="text-accent-600" />,
      description: "Eficiencia y Productividad del equipo",
      reports: [
        { name: "Eficiencia Operativa", path: "/reportes/operativos", icon: <IconTarget size={16} /> },
        { name: "Productividad", path: "/reportes/operativos", icon: <IconUsers size={16} /> },
      ]
    },
    {
      title: "Analíticos",
      icon: <IconChartDots className="text-primary-600" />,
      description: "Tendencias de mercado y proyecciones IA",
      reports: [
        { name: "Tendencia de Mercadeo", path: "/reportes/operativos", icon: <IconTrendingUp size={16} /> },
        { name: "Proyecciones", path: "/reportes/operativos", icon: <IconTrendingUp size={16} /> },
      ]
    }
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Módulo de Reportes" 
        description="Gestión profesional de informes financieros, operativos y analíticos."
        icon={<IconChartDots size={28} className="text-primary-600" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {reportModules.map((module) => (
          <div key={module.title} className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
               <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-primary-100 flex items-center justify-center">
                  {module.icon}
               </div>
               <div>
                  <h3 className="text-sm font-black text-primary-900 uppercase tracking-widest">{module.title}</h3>
                  <p className="text-xs font-bold text-primary-400 uppercase">{module.description}</p>
               </div>
            </div>

            <div className="space-y-3">
               {module.reports.map((report) => (
                 <div 
                   key={report.name}
                   onClick={() => navigate(report.path)}
                   className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-primary-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer"
                 >
                    <div className="flex items-center gap-3">
                       <div className="text-primary-400 group-hover:text-primary-600 transition-colors">
                          {report.icon}
                       </div>
                       <span className="text-xs font-black text-primary-700 uppercase tracking-tight">{report.name}</span>
                    </div>
                    <IconChevronRight size={14} className="text-primary-300 group-hover:text-primary-600 transition-all transform group-hover:translate-x-1" />
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
