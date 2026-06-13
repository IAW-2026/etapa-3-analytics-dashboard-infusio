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
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Indicadores de productos
          </h2>
          <AppBadge source="seller" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard label="Total de productos" value={stats.totalProducts} appSource="seller" />
          <KpiCard label="En stock" value={stats.inStock} delta={2.1} deltaPositive appSource="seller" />
          <KpiCard label="Stock bajo" value={stats.lowStock} delta={-5.0} deltaPositive={false} appSource="seller" />
          <KpiCard label="Sin stock" value={stats.outOfStock} appSource="seller" />
          <KpiCard
            label="Rating promedio"
            value={`${stats.avgRating}/5.0`}
            delta={0.2}
            deltaPositive
            appSource="seller"
          />
        </div>
      </section>

      {/* Charts */}
      <section>
        <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium mb-4">
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
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Catálogo de productos
          </h2>
          <AppBadge source="seller" />
        </div>
        <div className="bg-white rounded-2xl border border-tan shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-tan">
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Producto</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium hidden md:table-cell">Categoría</th>
                <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Precio</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium hidden lg:table-cell">Stock</th>
                <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium hidden lg:table-cell">Rating</th>
                <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product) => {
                const { label, style } = stockStatus(product.stock);
                return (
                  <tr key={product.id} className="border-b border-tan/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-brown font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-muted-foreground capitalize hidden md:table-cell">{product.category}</td>
                    <td className="px-6 py-4 text-right text-brown">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style}`}>{label}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground hidden lg:table-cell">
                      {"★".repeat(Math.round(product.rating))} {product.rating.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-brown">
                      ${product.revenue.toLocaleString("es-AR")}
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
