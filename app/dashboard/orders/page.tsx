import KpiCard from "@/app/ui/KpiCard";
import AppBadge from "@/app/ui/AppBadge";
import { DynamicOrderStatusPieChart, DynamicWeeklyVolumeChart } from "@/app/ui/DynamicCharts";
import { getBuyerAnalytics, getOrderStatusData, getWeeklyRevenue } from "@/app/lib/services/buyerApi";

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
        <div className="bg-white rounded-2xl border border-tan shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-tan">
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">#</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Producto</th>
                <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Unidades vendidas</th>
                <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Ingresos generados</th>
                <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium hidden md:table-cell">Precio unitario prom.</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => {
                const unitPrice = p.totalQuantity > 0 ? p.totalRevenue / p.totalQuantity : 0;
                return (
                  <tr key={i} className="border-b border-tan/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">#{i + 1}</td>
                    <td className="px-6 py-4 text-brown font-medium">{p.productName}</td>
                    <td className="px-6 py-4 text-right text-brown">{p.totalQuantity.toLocaleString("es-AR")}</td>
                    <td className="px-6 py-4 text-right font-medium text-brown">
                      ${p.totalRevenue.toLocaleString("es-AR")}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground hidden md:table-cell">
                      ${unitPrice.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
