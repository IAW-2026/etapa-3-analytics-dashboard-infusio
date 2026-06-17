import AppBadge from "@/app/ui/AppBadge";

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaPositive?: boolean;
  icon?: React.ReactNode;
  appSource?: string;
}

export default function KpiCard({ label, value, delta, deltaPositive, icon, appSource }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-tan p-6 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between">
        {appSource ? <AppBadge source={appSource} /> : <span />}
        {icon && (
          <span className="text-muted-foreground opacity-60">{icon}</span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-brown">{value}</p>
        <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-1">{label}</p>
      </div>
      {delta !== undefined && (
        <span
          className={`self-start text-xs px-2 py-0.5 rounded-full font-medium ${
            deltaPositive
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {deltaPositive ? "+" : ""}
          {delta}% vs mes anterior
        </span>
      )}
    </div>
  );
}
