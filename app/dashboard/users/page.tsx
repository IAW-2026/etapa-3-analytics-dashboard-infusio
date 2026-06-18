import KpiCard from "@/app/ui/KpiCard";
import AppBadge from "@/app/ui/AppBadge";
import { DynamicRevenueAreaChart, DynamicOrderStatusPieChart } from "@/app/ui/DynamicCharts";
import { getBuyerAnalytics, getOrderStatusData, getMonthlyRevenue } from "@/app/lib/services/buyerApi";

import { TopFavouritedProductsTable, TopCategoriesTable } from "@/app/ui/tables/UsersTable";

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
          <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold">
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
        <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold mb-4">
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
          <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold">
            Comportamiento de favoritos
          </h2>
          <AppBadge source="buyer" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium mb-3">Los 5 Productos Favoritos</p>
            <TopFavouritedProductsTable data={favourites.topFavouritedProducts.slice(0, 5)} />
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium mb-3">Favoritos Según Categoría</p>
            <TopCategoriesTable data={favourites.topCategories} />
          </div>
        </div>
      </section>
    </div>
  );
}
