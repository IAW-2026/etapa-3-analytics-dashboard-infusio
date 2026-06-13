import KpiCard from "@/app/ui/KpiCard";
import AppBadge from "@/app/ui/AppBadge";
import { DynamicRevenueAreaChart, DynamicOrderStatusPieChart } from "@/app/ui/DynamicCharts";
import { getBuyerAnalytics, getOrderStatusData, getMonthlyRevenue } from "@/app/lib/services/buyerApi";

export default async function UsersPage() {
  const [analytics, orderStatusData, monthlyRevenue] = await Promise.all([
    getBuyerAnalytics(),
    getOrderStatusData(),
    getMonthlyRevenue(),
  ]);

  const { overview, favourites } = analytics;

  const avgOrdersPerUser =
    overview.totalUsers > 0
      ? (overview.totalOrders / overview.totalUsers).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-8 max-w-screen-2xl">
      {/* KPIs */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Indicadores de usuarios
          </h2>
          <AppBadge source="buyer" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total de usuarios"
            value={overview.totalUsers.toLocaleString("es-AR")}
            appSource="buyer"
          />
          <KpiCard
            label="Nuevos (últimos 30 días)"
            value={overview.newUsersLast30Days.toLocaleString("es-AR")}
            appSource="buyer"
          />
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
        </div>
      </section>

      {/* Secondary KPIs */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Pedidos por usuario"
            value={avgOrdersPerUser}
            appSource="buyer"
          />
          <KpiCard
            label="Favoritos totales"
            value={favourites.totalFavouriteEntries.toLocaleString("es-AR")}
            appSource="buyer"
          />
          <KpiCard
            label="Listas compartidas"
            value={favourites.totalSharedLists.toLocaleString("es-AR")}
            appSource="buyer"
          />
          <KpiCard
            label="Ingresos totales"
            value={`$${overview.totalRevenue.toLocaleString("es-AR")}`}
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
          <DynamicRevenueAreaChart
            data={monthlyRevenue}
            title="Ingresos mensuales"
            subtitle="Últimos 12 meses"
          />
          <DynamicOrderStatusPieChart
            data={orderStatusData}
            title="Estado de pedidos"
            subtitle="Comportamiento de compra"
          />
        </div>
      </section>

      {/* Favourites tables */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Comportamiento de favoritos
          </h2>
          <AppBadge source="buyer" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top favourited products */}
          <div className="bg-white rounded-2xl border border-tan shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-tan">
              <h3 className="text-sm font-medium text-brown">Productos más favoriteados</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-tan">
                  <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Producto</th>
                  <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Veces favoriteado</th>
                </tr>
              </thead>
              <tbody>
                {favourites.topFavouritedProducts.map((p, i) => (
                  <tr key={i} className="border-b border-tan/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3 text-brown font-medium">{p.productName ?? p.name}</td>
                    <td className="px-6 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-terracotta font-medium">
                        ♥ {p.count ?? p.total}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top categories */}
          <div className="bg-white rounded-2xl border border-tan shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-tan">
              <h3 className="text-sm font-medium text-brown">Categorías más favoriteadas</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-tan">
                  <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Categoría</th>
                  <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Entradas</th>
                </tr>
              </thead>
              <tbody>
                {favourites.topCategories.map((c, i) => (
                  <tr key={i} className="border-b border-tan/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3 text-brown font-medium capitalize">{c.category ?? c.name}</td>
                    <td className="px-6 py-3 text-right text-muted-foreground">{c.count ?? c.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
