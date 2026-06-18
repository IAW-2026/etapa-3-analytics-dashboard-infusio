"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GRID_STROKE = "#ede9e3";
const AXIS_FILL = "#8a8278";

interface RevenuePoint {
  date: string;
  revenue: number;
}

interface Props {
  data: RevenuePoint[];
  title?: string;
  subtitle?: string;
}

export default function RevenueAreaChart({
  data,
  title = "Ingresos diarios",
  subtitle = "Últimos 30 días",
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-tan p-6 shadow-sm">
      <h3 className="text-sm font-medium text-brown">{title}</h3>
      <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-0.5 mb-5">
        {subtitle}
      </p>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 48, left: 0 }}>
          <defs>
            <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6b7056" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6b7056" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: AXIS_FILL, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={4}
            tickMargin={24}
          />
          <YAxis
            tick={{ fill: AXIS_FILL, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            width={40}
          />
          <Tooltip
            contentStyle={{
              fontSize: 11,
              border: "1px solid #d4cfc5",
              backgroundColor: "#faf8f5",
              borderRadius: 8,
            }}
            formatter={(v) => [`$${(v as number).toLocaleString("es-AR")}`, "Ingresos"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6b7056"
            strokeWidth={2}
            fill="url(#gradRevenue)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
