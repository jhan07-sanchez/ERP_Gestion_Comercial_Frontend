import { Card } from "@/shared/components/ui";

type DashKPIProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "emerald" | "rose" | "indigo";
  highlighted?: boolean;
};

export function DashKPI({
  label,
  value,
  icon,
  color,
  highlighted = false,
}: DashKPIProps) {
  const colorMap: Record<DashKPIProps["color"], string> = {
    blue: "bg-accent-50 border-accent-100 text-accent-700",
    emerald: "bg-success-50 border-success-100 text-success-700",
    rose: "bg-danger-50 border-danger-100 text-danger-700",
    indigo: "bg-accent-50 border-accent-100 text-accent-700",
  };

  return (
    <Card className={`${colorMap[color]} border shadow-sm`}>
      <Card.Content className="p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 opacity-60">
          {icon}
          <p className="text-xs uppercase font-bold">{label}</p>
        </div>

        <p className={`text-2xl font-black ${highlighted ? "scale-105" : ""}`}>
          {value}
        </p>
      </Card.Content>
    </Card>
  );
}
