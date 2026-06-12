"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GRID_STROKE = "#ede9e3";
const AXIS_FILL = "#8a8278";

interface DeliveryTimePoint {
  days: string;
  count: number;
}

interface Props {
  data: DeliveryTimePoint[];
}

export default function DeliveryTimeChart({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-tan p-6 shadow-sm">
      <h3 className="text-sm font-medium text-brown">Tiempos de entrega</h3>
      <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-0.5 mb-5">
        Distribución en días
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis
            dataKey="days"
            tick={{ fill: AXIS_FILL, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: AXIS_FILL, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{
              fontSize: 11,
              border: "1px solid #d4cfc5",
              backgroundColor: "#faf8f5",
              borderRadius: 8,
            }}
            formatter={(v: number) => [v, "Envíos"]}
          />
          <Bar dataKey="count" fill="#6b7056" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
