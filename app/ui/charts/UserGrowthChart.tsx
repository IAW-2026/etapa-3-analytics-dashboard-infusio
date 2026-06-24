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

interface UserGrowthPoint {
  date: string;
  newUsers: number;
  totalUsers: number;
}

interface Props {
  data: UserGrowthPoint[];
}

export default function UserGrowthChart({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-tan p-6 shadow-sm" role="figure" aria-label="Crecimiento de usuarios">
      <h3 className="text-sm font-medium text-brown">Crecimiento de usuarios</h3>
      <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-0.5 mb-5">
        Últimas 26 semanas
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9b4a30" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#9b4a30" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6b7056" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6b7056" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: AXIS_FILL, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={4}
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
          />
          <Area
            type="monotone"
            dataKey="totalUsers"
            stroke="#9b4a30"
            strokeWidth={2}
            fill="url(#gradTotal)"
            name="Total usuarios"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="newUsers"
            stroke="#6b7056"
            strokeWidth={2}
            fill="url(#gradNew)"
            name="Nuevos usuarios"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
