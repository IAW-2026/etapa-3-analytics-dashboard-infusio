"use client";

import { useState } from "react";
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

const RANGES = [
  { label: "2 sem", weeks: 2 },
  { label: "1 mes", weeks: 4 },
  { label: "Todo", weeks: 99 },
];

interface WeeklyVolumePoint {
  week: string;
  transactions: number;
}

interface Props {
  data: WeeklyVolumePoint[];
  title?: string;
  subtitle?: string;
  valueLabel?: string;
  format?: "currency" | "number";
}

export default function WeeklyVolumeChart({
  data,
  title = "Volumen de transacciones",
  subtitle = "Por semana",
  valueLabel = "Transacciones",
  format = "number",
}: Props) {
  const valueFormatter = format === "currency"
    ? (v: number) => `$${v.toLocaleString("es-AR")}`
    : (v: number) => v.toLocaleString("es-AR");
  const [range, setRange] = useState(1);
  const filtered = data.slice(-RANGES[range].weeks);

  return (
    <div className="bg-white rounded-2xl border border-tan p-6 shadow-sm" role="figure" aria-label={title}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-medium text-brown">{title}</h3>
          <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-0.5">
            {subtitle}
          </p>
        </div>
        <div className="flex gap-1">
          {RANGES.map((r, i) => (
            <button
              key={i}
              onClick={() => setRange(i)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                range === i
                  ? "bg-olive text-white border-olive"
                  : "bg-white text-muted-foreground border-tan hover:border-olive/50"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={filtered} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis
            dataKey="week"
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
            formatter={(v) => [
              valueFormatter ? valueFormatter(v as number) : (v as number),
              valueLabel,
            ]}
          />
          <Bar dataKey="transactions" fill="#9b4a30" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
