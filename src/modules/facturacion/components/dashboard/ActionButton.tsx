type ActionButtonProps = {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "amber" | "rose" | "indigo";
  onClick: () => void;
};

export function ActionButton({
  label,
  description,
  icon,
  color,
  onClick,
}: ActionButtonProps) {
  const colorMap: Record<ActionButtonProps["color"], string> = {
    blue: "bg-accent-50 text-accent-600 border-accent-100 hover:bg-accent-100",
    amber:
      "bg-warning-50 text-warning-600 border-warning-100 hover:bg-warning-100",
    rose: "bg-danger-50 text-danger-600 border-danger-100 hover:bg-danger-100",
    indigo:
      "bg-accent-50 text-accent-600 border-accent-100 hover:bg-accent-100",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${colorMap[color]}`}
    >
      {icon}
      <div className="text-left">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-xs opacity-60">{description}</p>
      </div>
    </button>
  );
}
