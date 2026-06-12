"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface OrderStatusPoint {
  status: string;
  count: number;
  color: string;
}

interface Props {
  data: OrderStatusPoint[];
  title?: string;
  subtitle?: string;
}

export default function OrderStatusPieChart({
  data,
  title = "Estado de pedidos",
  subtitle = "Distribución total",
}: Props) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="bg-white rounded-2xl border border-tan p-6 shadow-sm">
      <h3 className="text-sm font-medium text-brown">{title}</h3>
      <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-0.5 mb-5">
        {subtitle}
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ percent }) =>
              `${((percent ?? 0) * 100).toFixed(0)}%`
            }
            labelLine={false}
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
