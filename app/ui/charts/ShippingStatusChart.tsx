"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ShippingStatusPoint {
  status: string;
  count: number;
  color: string;
}

interface Props {
  data: ShippingStatusPoint[];
  successRate: number;
}

export default function ShippingStatusChart({ data, successRate }: Props) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="bg-white rounded-2xl border border-tan p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-brown">Estado de envíos</h3>
          <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-0.5 mb-5">
            Distribución total
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-olive">{successRate}%</p>
          <p className="text-xs text-muted-foreground">tasa de éxito</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              fontSize: 11,
              border: "1px solid #d4cfc5",
              backgroundColor: "#faf8f5",
              borderRadius: 8,
            }}
            formatter={(v, name) => [
              `${(v as number).toLocaleString("es-AR")} (${(((v as number) / total) * 100).toFixed(1)}%)`,
              name,
            ]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span style={{ fontSize: 11, color: "#6b6560" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
