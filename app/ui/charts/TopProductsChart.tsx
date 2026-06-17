"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const GRID_STROKE = "#ede9e3";
const AXIS_FILL = "#8a8278";

interface ProductRevenue {
  name: string;
  revenue: number;
  category: string;
}

interface Props {
  data: ProductRevenue[];
}

export default function TopProductsChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  return (
    <div className="bg-white rounded-2xl border border-tan p-6 shadow-sm">
      <h3 className="text-sm font-medium text-brown">Top productos por ingresos</h3>
      <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-0.5 mb-5">
        Acumulado histórico
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 60, bottom: 0, left: 0 }}
        >
          <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: AXIS_FILL, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: AXIS_FILL, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={140}
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
          <Bar dataKey="revenue" fill="#6b7056" radius={[0, 4, 4, 0]}>
            <LabelList
              dataKey="revenue"
              position="right"
              style={{ fontSize: 10, fill: AXIS_FILL }}
              formatter={(v) => `$${((v as number) / 1000).toFixed(1)}k`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
