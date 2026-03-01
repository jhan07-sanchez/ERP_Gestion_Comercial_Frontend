import { ActivityFeed } from "@/modules/dashboard/components/ActivityFeed";
import { useEffect, useState } from "react";
import { dashboardAPI } from "@/modules/dashboard/api/dashboard.api";
import type { RecentActivity } from "@/modules/dashboard/types";

export const ActivityPage = () => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await dashboardAPI.getRecentActivities();
      setActivities(data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div className="p-6">Cargando historial...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Historial Completo de Actividad
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
};
