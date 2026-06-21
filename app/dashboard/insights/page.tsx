import InsightsPanel from "@/app/ui/InsightsPanel";
import { getBuyerAnalytics } from "@/app/lib/services/buyerApi";
import { getSellerStats, getTopProducts, getCategoryData } from "@/app/lib/services/sellerApi";
import { getShippingStats } from "@/app/lib/services/shippingApi";
import { getPaymentStats } from "@/app/lib/services/paymentsApi";
import type { InsightsPayload } from "@/app/lib/insightsPrompt";

export default async function InsightsPage() {
  const [analytics, sellerStats, topSellerProducts, categoryData, shippingStats, paymentStats] =
    await Promise.all([
      getBuyerAnalytics(),
      getSellerStats(),
      getTopProducts(),
      getCategoryData(),
      getShippingStats(),
      getPaymentStats(),
    ]);

  const payload: InsightsPayload = {
    buyer: {
      overview: analytics.overview,
      orderStatusDistribution: analytics.orderStatusDistribution,
      monthlyRevenue: analytics.revenueTimeSeries.monthly,
      topProducts: analytics.topProducts,
      topCategories: analytics.favourites.topCategories,
    },
    seller: {
      stats: sellerStats,
      topProducts: topSellerProducts.map((p) => ({
        name: p.name,
        revenue: p.revenue,
        stock: p.stock,
      })),
      categoryData: categoryData.map((c) => ({
        category: c.category,
        count: c.count,
        revenue: c.revenue,
      })),
    },
    shipping: {
      stats: shippingStats,
    },
    payments: {
      stats: paymentStats,
    },
  };

  return (
    <div className="space-y-8 max-w-screen-2xl">
      <section>
        <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold mb-1">
          Infusio Insights
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          Análisis cruzado de las 4 apps del ecosistema · Powered by Groq
        </p>
        <InsightsPanel data={payload} />
      </section>
    </div>
  );
}
