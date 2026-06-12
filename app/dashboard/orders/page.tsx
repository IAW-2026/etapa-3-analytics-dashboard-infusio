import KpiCard from "@/app/ui/KpiCard";
import AppBadge from "@/app/ui/AppBadge";
import { DynamicOrderStatusPieChart, DynamicWeeklyVolumeChart } from "@/app/ui/DynamicCharts";
import { getBuyerStats, getRecentOrders, getWeeklyVolume, getOrderStatusData } from "@/app/lib/services/buyerApi";

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Completado",
  PENDING: "Pendiente",
  AWAITING_PAYMENT: "Aguardando pago",
  CANCELLED: "Cancelado",
};

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-olive/10 text-olive",
  PENDING: "bg-yellow-50 text-yellow-700",
  AWAITING_PAYMENT: "bg-blue-50 text-blue-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default async function OrdersPage() {
  const [stats, recentOrders, weeklyVolume, orderStatusData] = await Promise.all([
    getBuyerStats(),
    getRecentOrders(20),
    getWeeklyVolume(),
    getOrderStatusData(),
  ]);

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
          <KpiCard label="Total de pedidos" value={stats.totalOrders.toLocaleString("es-AR")} appSource="buyer" />
          <KpiCard label="Completados" value={stats.completedOrders.toLocaleString("es-AR")} delta={12.1} deltaPositive appSource="buyer" />
          <KpiCard label="Pendientes" value={stats.pendingOrders.toLocaleString("es-AR")} delta={-3.4} deltaPositive={false} appSource="buyer" />
          <KpiCard label="Cancelados" value={stats.cancelledOrders.toLocaleString("es-AR")} delta={-1.2} deltaPositive={false} appSource="buyer" />
          <KpiCard
            label="Ticket promedio"
            value={`$${stats.avgOrderValue.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`}
            delta={4.7}
            deltaPositive
            appSource="buyer"
          />
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
          <DynamicWeeklyVolumeChart data={weeklyVolume} />
        </div>
      </section>

      {/* Table */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Últimos 20 pedidos
          </h2>
          <AppBadge source="buyer" />
        </div>
        <div className="bg-white rounded-2xl border border-tan shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-tan">
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">ID</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Cliente</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium hidden lg:table-cell">Items</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium hidden md:table-cell">Fecha</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Estado</th>
                <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-tan/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{order.id}</td>
                  <td className="px-6 py-4 text-brown font-medium">{order.userName}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs hidden lg:table-cell max-w-48 truncate">
                    {order.items.map((i) => i.productName).join(", ")}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs hidden md:table-cell">
                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[order.status] ?? "bg-tan text-brown"}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-brown">
                    ${order.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
