"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const GRID_STROKE = "#ede9e3";
const AXIS_FILL = "#8a8278";

interface DisputePoint {
  week: string;
  count: number;
}

interface Props {
  data: DisputePoint[];
}

export default function DisputesTrendChart({ data }: Props) {
  const avg = Math.round(data.reduce((s, d) => s + d.count, 0) / data.length);

  return (
    <div className="bg-white rounded-2xl border border-tan p-6 shadow-sm" role="figure" aria-label="Evolución de disputas">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-medium text-brown">Evolución de disputas</h3>
          <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-0.5">
            Últimas 26 semanas
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-6 border-t-2 border-dashed border-muted-foreground opacity-50" />
          <span className="text-xs text-muted-foreground">Promedio: {avg}/sem</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: AXIS_FILL, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: AXIS_FILL, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={28}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              fontSize: 11,
              border: "1px solid #d4cfc5",
              backgroundColor: "#faf8f5",
              borderRadius: 8,
            }}
            formatter={(v) => [v as number, "Disputas"]}
          />
          <ReferenceLine
            y={avg}
            stroke="#d4cfc5"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#9b4a30"
            strokeWidth={2}
            dot={{ r: 3, fill: "#9b4a30" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
