"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const GRID_STROKE = "#ede9e3";
const AXIS_FILL = "#8a8278";
const EARTHY_COLORS = ["#6b7056", "#9b4a30", "#7A6C5D", "#b07d62"];

interface CategoryPoint {
  category: string;
  count: number;
  revenue: number;
  color: string;
}

interface Props {
  data: CategoryPoint[];
}

export default function CategoryRevenueChart({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-tan p-6 shadow-sm">
      <h3 className="text-sm font-medium text-brown">Valor de inventario por categoría</h3>
      <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-0.5 mb-5">
        Precio × stock disponible
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fill: AXIS_FILL, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: AXIS_FILL, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            width={44}
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
          <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={EARTHY_COLORS[i % EARTHY_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
