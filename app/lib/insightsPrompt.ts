export interface InsightsPayload {
  buyer: {
    overview: {
      totalRevenue: number;
      totalOrders: number;
      confirmedOrders: number;
      cancelledOrders: number;
      activeOrders: number;
      totalUsers: number;
      newUsersLast30Days: number;
      abandonedCarts: number;
      abandonedCartValue: number;
      limitedEditionProducts: number;
    };
    orderStatusDistribution: { status: string; count: number }[];
    monthlyRevenue: { month: string; revenue: number }[];
    topProducts: { productName: string; totalRevenue: number; totalQuantity: number }[];
    topCategories: { category?: string; name?: string; count?: number; total?: number }[];
  };
  seller: {
    stats: {
      totalProducts: number;
      inStock: number;
      lowStock: number;
      outOfStock: number;
      topCategory: string;
    };
    topProducts: { name: string; revenue: number; stock: number }[];
    categoryData: { category: string; count: number; revenue: number }[];
  };
  shipping: {
    stats: {
      totalShipments: number;
      inTransit: number;
      delivered: number;
      failed: number;
      processing: number;
      avgDeliveryDays: number;
      successRate: number;
    };
  };
  payments: {
    stats: {
      totalRevenue: number;
      successfulPayments: number;
      failedPayments: number;
      disputed: number;
      avgTransactionValue: number;
      conversionRate: number;
    };
  };
}

export function buildPrompt(data: InsightsPayload): string {
  const { buyer, seller, shipping, payments } = data;
  const o = buyer.overview;

  // Build a compact text summary instead of raw JSON to minimise tokens
  const abandonmentRate = o.totalUsers > 0 ? ((o.abandonedCarts / o.totalUsers) * 100).toFixed(1) : "0";
  const cancellationRate = o.totalOrders > 0 ? ((o.cancelledOrders / o.totalOrders) * 100).toFixed(1) : "0";
  const avgOrder = o.totalOrders > 0 ? (o.totalRevenue / o.totalOrders).toFixed(2) : "0";

  const monthlyTrend = buyer.monthlyRevenue
    .slice(-6)
    .map((m) => `${m.month}: $${m.revenue.toLocaleString()}`)
    .join(" | ");

  const topBuyerProducts = buyer.topProducts
    .slice(0, 5)
    .map((p, i) => `${i + 1}. ${p.productName} — $${p.totalRevenue.toLocaleString()} (${p.totalQuantity} u.)`)
    .join("\n");

  const topSellerProducts = seller.topProducts
    .slice(0, 5)
    .map((p) => `${p.name}: stock=${p.stock}, rev=$${p.revenue.toLocaleString()}`)
    .join("\n");

  const categories = seller.categoryData
    .map((c) => `${c.category}: ${c.count} prods, $${c.revenue.toLocaleString()}`)
    .join(" | ");

  const topCategsFav = buyer.topCategories
    .slice(0, 5)
    .map((c) => `${c.category ?? c.name}: ${c.count ?? c.total} favs`)
    .join(", ");

  return `Eres un analista de negocios senior de Infusio, marca argentina de cafés e infusiones especiales. Analizá los datos del ecosistema de 4 apps y escribí un informe ejecutivo en español argentino con insights cruzados, alertas y predicciones concretas. Sé específico con números. Usá EXACTAMENTE estos encabezados markdown:

## Resumen Ejecutivo
## Tendencias de Ventas
## Análisis de Usuarios y Conversión
## Rendimiento de Productos
## Logística y Envíos
## Pagos y Facturación
## Alertas y Anomalías
## Predicciones (próximos 30 días)
## Recomendaciones Accionables

---
DATOS DEL ECOSISTEMA:

VENTAS (Buyer App):
- Revenue total: $${o.totalRevenue.toLocaleString()} | Pedidos: ${o.totalOrders} | Ticket promedio: $${avgOrder}
- Confirmados: ${o.confirmedOrders} | Activos: ${o.activeOrders} | Cancelados: ${o.cancelledOrders} (${cancellationRate}%)
- Usuarios: ${o.totalUsers} | Nuevos (30d): ${o.newUsersLast30Days}
- Carritos abandonados: ${o.abandonedCarts} (${abandonmentRate}% de usuarios) | Valor abandonado: $${o.abandonedCartValue.toLocaleString()}
- Tendencia mensual (últimos 6 meses): ${monthlyTrend}
- Top 5 productos por revenue:
${topBuyerProducts}
- Favoritos por categoría: ${topCategsFav}

CATÁLOGO (Seller App):
- Productos: ${seller.stats.totalProducts} total | ${seller.stats.inStock} en stock | ${seller.stats.lowStock} stock bajo | ${seller.stats.outOfStock} sin stock
- Categoría top: ${seller.stats.topCategory}
- Top productos (stock/revenue):
${topSellerProducts}
- Categorías: ${categories}

LOGÍSTICA (Shipping App):
- Envíos: ${shipping.stats.totalShipments} total | Entregados: ${shipping.stats.delivered} | En tránsito: ${shipping.stats.inTransit} | Fallidos: ${shipping.stats.failed} | Procesando: ${shipping.stats.processing}
- Tasa de éxito: ${shipping.stats.successRate}% | Tiempo promedio: ${shipping.stats.avgDeliveryDays} días

PAGOS (Payments App):
- Revenue: $${payments.stats.totalRevenue.toLocaleString()} | Exitosos: ${payments.stats.successfulPayments} | Fallidos: ${payments.stats.failedPayments} | Disputados: ${payments.stats.disputed}
- Ticket promedio: $${payments.stats.avgTransactionValue.toLocaleString()} | Tasa de conversión: ${payments.stats.conversionRate}%
- Productos edición limitada activos: ${o.limitedEditionProducts}`;
}
