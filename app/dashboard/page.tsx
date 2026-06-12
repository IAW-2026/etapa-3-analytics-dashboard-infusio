import KpiCard from "@/app/ui/KpiCard";
import AppBadge from "@/app/ui/AppBadge";
import {
  DynamicRevenueAreaChart,
  DynamicOrderStatusPieChart,
  DynamicUserGrowthChart,
  DynamicWeeklyVolumeChart,
} from "@/app/ui/DynamicCharts";
import { getBuyerStats, getRecentOrders, getRevenueData, getUserGrowth, getWeeklyVolume, getOrderStatusData } from "@/app/lib/services/buyerApi";
import { getSellerStats } from "@/app/lib/services/sellerApi";
import { getShippingStats } from "@/app/lib/services/shippingApi";
import { getPaymentStats } from "@/app/lib/services/paymentsApi";

const ORDER_STATUS_LABELS: Record<string, string> = {
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

export default async function DashboardPage() {
  const [
    buyerStats,
    sellerStats,
    shippingStats,
    paymentStats,
    recentOrders,
    revenueData,
    userGrowth,
    weeklyVolume,
    orderStatusData,
  ] = await Promise.all([
    getBuyerStats(),
    getSellerStats(),
    getShippingStats(),
    getPaymentStats(),
    getRecentOrders(10),
    getRevenueData(),
    getUserGrowth(),
    getWeeklyVolume(),
    getOrderStatusData(),
  ]);

  return (
    <div className="space-y-8 max-w-screen-2xl">
      {/* KPI Cards */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Indicadores clave
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard
            label="Ingresos totales"
            value={`$${paymentStats.totalRevenue.toLocaleString("es-AR")}`}
            delta={8.4}
            deltaPositive
            appSource="payments"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            }
          />
          <KpiCard
            label="Usuarios activos"
            value={buyerStats.activeUsers.toLocaleString("es-AR")}
            delta={5.2}
            deltaPositive
            appSource="buyer"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            }
          />
          <KpiCard
            label="Pedidos completados"
            value={buyerStats.completedOrders.toLocaleString("es-AR")}
            delta={12.1}
            deltaPositive
            appSource="buyer"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            }
          />
          <KpiCard
            label="Productos listados"
            value={sellerStats.totalProducts}
            delta={2.1}
            deltaPositive
            appSource="seller"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            }
          />
          <KpiCard
            label="Tasa de entrega"
            value={`${shippingStats.successRate}%`}
            delta={1.3}
            deltaPositive
            appSource="shipping"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            }
          />
          <KpiCard
            label="Tasa de conversión"
            value={`${paymentStats.conversionRate}%`}
            delta={0.8}
            deltaPositive
            appSource="payments"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
              </svg>
            }
          />
        </div>
      </section>

      {/* Charts */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Visualizaciones
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DynamicRevenueAreaChart data={revenueData} />
          <DynamicOrderStatusPieChart data={orderStatusData} />
          <DynamicUserGrowthChart data={userGrowth} />
          <DynamicWeeklyVolumeChart data={weeklyVolume} />
        </div>
      </section>

      {/* Recent Orders Table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
              Pedidos recientes
            </h2>
            <AppBadge source="buyer" />
          </div>
          <a href="/dashboard/orders" className="text-xs text-olive hover:underline">
            Ver todos →
          </a>
        </div>
        <div className="bg-white rounded-2xl border border-tan shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-tan">
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">ID</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Cliente</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium hidden md:table-cell">Productos</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Estado</th>
                <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-tan/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{order.id}</td>
                  <td className="px-6 py-4 text-brown font-medium">{order.userName}</td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                    {order.items.map((i) => i.productName).join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[order.status] ?? "bg-tan text-brown"}`}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
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
