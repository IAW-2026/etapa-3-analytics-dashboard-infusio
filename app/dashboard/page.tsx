import KpiCard from "@/app/ui/KpiCard";
import AppBadge from "@/app/ui/AppBadge";
import {
  DynamicRevenueAreaChart,
  DynamicOrderStatusPieChart,
  DynamicWeeklyVolumeChart,
} from "@/app/ui/DynamicCharts";
import { getBuyerAnalytics, getOrderStatusData, getWeeklyRevenue } from "@/app/lib/services/buyerApi";
import { getSellerStats } from "@/app/lib/services/sellerApi";
import { getShippingStats } from "@/app/lib/services/shippingApi";
import { getPaymentStats } from "@/app/lib/services/paymentsApi";

export default async function DashboardPage() {
  const [analytics, orderStatusData, weeklyRevenue, sellerStats, shippingStats, paymentStats] =
    await Promise.all([
      getBuyerAnalytics(),
      getOrderStatusData(),
      getWeeklyRevenue(),
      getSellerStats(),
      getShippingStats(),
      getPaymentStats(),
    ]);

  const { overview, revenueTimeSeries, topProducts, favourites } = analytics;

  const avgOrderValue =
    overview.totalOrders > 0
      ? Math.round(overview.totalRevenue / overview.totalOrders)
      : 0;

  return (
    <div className="space-y-8 max-w-screen-2xl">
      {/* KPI Cards */}
      <section>
        <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold mb-4">
          Indicadores clave
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard
            label="Ingresos totales"
            value={`$${overview.totalRevenue.toLocaleString("es-AR")}`}
            appSource="payments"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            }
          />
          <KpiCard
            label="Usuarios totales"
            value={overview.totalUsers.toLocaleString("es-AR")}
            appSource="buyer"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            }
          />
          <KpiCard
            label="Pedidos confirmados"
            value={overview.confirmedOrders.toLocaleString("es-AR")}
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
        <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold mb-4">
          Visualizaciones
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DynamicRevenueAreaChart data={revenueTimeSeries.daily} />
          <DynamicOrderStatusPieChart data={orderStatusData} />
          <DynamicRevenueAreaChart
            data={revenueTimeSeries.monthly.map((m) => ({ date: m.month, revenue: m.revenue }))}
            title="Ingresos mensuales"
            subtitle="Últimos 12 meses"
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

      {/* Top Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold">
              Productos más vendidos
            </h2>
            <AppBadge source="buyer" />
          </div>
          <div className="text-xs text-muted-foreground">Ticket promedio: ${avgOrderValue.toLocaleString("es-AR")}</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top products table */}
          <div className="bg-white rounded-2xl border border-tan shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-tan">
                  <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">#</th>
                  <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Producto</th>
                  <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Unidades</th>
                  <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i} className="border-b border-tan/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3 text-xs text-muted-foreground font-mono">#{i + 1}</td>
                    <td className="px-6 py-3 text-brown font-medium text-sm">{p.productName}</td>
                    <td className="px-6 py-3 text-right text-muted-foreground">{p.totalQuantity}</td>
                    <td className="px-6 py-3 text-right font-medium text-brown">${p.totalRevenue.toLocaleString("es-AR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Favourites summary */}
          <div className="bg-white rounded-2xl border border-tan shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-medium text-brown">Favoritos</h3>
              <AppBadge source="buyer" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-cream rounded-xl p-3">
                <p className="text-xl font-bold text-brown">{favourites.totalFavouriteEntries.toLocaleString("es-AR")}</p>
                <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-0.5">Entradas</p>
              </div>
              <div className="bg-cream rounded-xl p-3">
                <p className="text-xl font-bold text-brown">{favourites.totalSharedLists}</p>
                <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-0.5">Listas compartidas</p>
              </div>
            </div>
            <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mb-2">Top favoriteados</p>
            <ul className="space-y-1.5">
              {favourites.topFavouritedProducts.slice(0, 5).map((p, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-brown truncate">{p.productName}</span>
                  <span className="text-xs text-muted-foreground ml-2 shrink-0">♥ {p.userCount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
