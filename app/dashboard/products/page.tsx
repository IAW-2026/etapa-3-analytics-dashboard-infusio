import KpiCard from "@/app/ui/KpiCard";
import AppBadge from "@/app/ui/AppBadge";
import { DynamicTopProductsChart, DynamicCategoryRevenueChart } from "@/app/ui/DynamicCharts";
import { getSellerStats, getTopProducts, getProductList, getCategoryData } from "@/app/lib/services/sellerApi";

const STOCK_STYLES: Record<string, string> = {
  ok: "bg-olive/10 text-olive",
  low: "bg-yellow-50 text-yellow-700",
  out: "bg-red-50 text-red-700",
};

function stockStatus(stock: number) {
  if (stock === 0) return { label: "Sin stock", style: STOCK_STYLES.out };
  if (stock <= 10) return { label: `Bajo (${stock})`, style: STOCK_STYLES.low };
  return { label: `En stock (${stock})`, style: STOCK_STYLES.ok };
}

import ProductsTable from "@/app/ui/tables/ProductsTable";

export default async function ProductsPage() {
  const [stats, topProducts, productList, categoryData] = await Promise.all([
    getSellerStats(),
    getTopProducts(),
    getProductList(),
    getCategoryData(),
  ]);

  return (
    <div className="space-y-8 max-w-screen-2xl">
      {/* KPIs */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold">
            Indicadores de productos
          </h2>
          <AppBadge source="seller" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard label="Total de productos" value={stats.totalProducts} appSource="seller" />
          <KpiCard label="En stock" value={stats.inStock} delta={2.1} deltaPositive appSource="seller" />
          <KpiCard label="Stock bajo" value={stats.lowStock} delta={-5.0} deltaPositive={false} appSource="seller" />
          <KpiCard label="Sin stock" value={stats.outOfStock} appSource="seller" />
          <KpiCard label="Categoría top" value={stats.topCategory} appSource="seller" />
        </div>
      </section>

      {/* Charts */}
      <section>
        <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold mb-4">
          Análisis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DynamicTopProductsChart data={topProducts} />
          <DynamicCategoryRevenueChart data={categoryData} />
        </div>
      </section>

      {/* Table */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold">
            Catálogo de productos
          </h2>
          <AppBadge source="seller" />
        </div>
        <ProductsTable data={productList} />
      </section>
    </div>
  );
}
