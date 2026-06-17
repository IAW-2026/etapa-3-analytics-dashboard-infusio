import KpiCard from "@/app/ui/KpiCard";
import AppBadge from "@/app/ui/AppBadge";
import { DynamicOrderStatusPieChart, DynamicWeeklyVolumeChart } from "@/app/ui/DynamicCharts";
import { getBuyerAnalytics, getOrderStatusData, getWeeklyRevenue } from "@/app/lib/services/buyerApi";

import OrdersTable from "@/app/ui/tables/OrdersTable";

export default async function OrdersPage() {
  const [analytics, orderStatusData, weeklyRevenue] = await Promise.all([
    getBuyerAnalytics(),
    getOrderStatusData(),
    getWeeklyRevenue(),
  ]);

  const { overview, topProducts } = analytics;

  const avgOrderValue =
    overview.totalOrders > 0
      ? (overview.totalRevenue / overview.totalOrders).toFixed(2)
      : "0.00";

  return (
    <div className="space-y-8 max-w-screen-2xl">
      {/* KPIs */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Indicadores de pedidos
          </h2>
          <AppBadge source="buyer" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard label="Total de pedidos" value={overview.totalOrders.toLocaleString("es-AR")} appSource="buyer" />
          <KpiCard label="Confirmados" value={overview.confirmedOrders.toLocaleString("es-AR")} appSource="buyer" />
          <KpiCard label="En curso" value={overview.activeOrders.toLocaleString("es-AR")} appSource="buyer" />
          <KpiCard label="Cancelados" value={overview.cancelledOrders.toLocaleString("es-AR")} appSource="buyer" />
          <KpiCard
            label="Ticket promedio"
            value={`$${Number(avgOrderValue).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`}
            appSource="buyer"
          />
        </div>
      </section>

      {/* Extra KPIs */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Carritos abandonados"
            value={overview.abandonedCarts.toLocaleString("es-AR")}
            appSource="buyer"
          />
          <KpiCard
            label="Valor abandonado"
            value={`$${overview.abandonedCartValue.toLocaleString("es-AR")}`}
            appSource="buyer"
          />
          <KpiCard label="Ingresos totales" value={`$${overview.totalRevenue.toLocaleString("es-AR")}`} appSource="buyer" />
          <KpiCard label="Productos (ed. limitada)" value={overview.limitedEditionProducts} appSource="seller" />
        </div>
      </section>

      {/* Charts */}
      <section>
        <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium mb-4">
          Análisis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DynamicOrderStatusPieChart
            data={orderStatusData}
            title="Distribución de estados"
            subtitle="Acumulado histórico"
          />
          <DynamicWeeklyVolumeChart
            data={weeklyRevenue}
            title="Ingresos semanales"
            subtitle="Últimas 13 semanas"
            valueLabel="Ingresos"
            format="currency"
          />
        </div>
      </section>

      {/* Top products by orders */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Productos más vendidos
          </h2>
          <AppBadge source="buyer" />
        </div>
        <OrdersTable data={topProducts} />
      </section>
    </div>
  );
}
