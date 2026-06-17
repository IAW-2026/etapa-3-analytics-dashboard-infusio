// ── Types matching GET /api/analytics ─────────────────────────────────────────

export interface BuyerOverview {
  totalRevenue: number;
  totalOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
  activeOrders: number;
  totalUsers: number;
  newUsersLast30Days: number;
  totalProducts: number;
  limitedEditionProducts: number;
  abandonedCarts: number;
  abandonedCartValue: number;
}

export interface BuyerTopProduct {
  productName: string;
  totalRevenue: number;
  totalQuantity: number;
}

export interface BuyerFavourites {
  totalFavouriteEntries: number;
  totalSharedLists: number;
  topFavouritedProducts: { productName?: string; name?: string; count?: number; total?: number }[];
  topCategories: { category?: string; name?: string; count?: number; total?: number }[];
}

export interface BuyerAnalyticsResponse {
  meta: { generatedAt: string };
  overview: BuyerOverview;
  orderStatusDistribution: { status: string; count: number }[];
  revenueTimeSeries: {
    daily: { date: string; revenue: number }[];
    weekly: { weekStart: string; revenue: number }[];
    monthly: { month: string; revenue: number }[];
  };
  topProducts: BuyerTopProduct[];
  favourites: BuyerFavourites;
}

// ── Re-exported shapes used by chart components ────────────────────────────────

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface OrderStatusPoint {
  status: string;
  count: number;
  color: string;
}

export interface WeeklyVolumePoint {
  week: string;
  transactions: number;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "#6b7056",
  PENDING: "#b07d62",
  CANCELLED: "#9b4a30",
  AWAITING_PAYMENT: "#8B7355",
};

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Completado",
  PENDING: "Pendiente",
  AWAITING_PAYMENT: "Aguardando pago",
  CANCELLED: "Cancelado",
};

async function fetchBuyerAnalytics(): Promise<BuyerAnalyticsResponse> {
  const res = await fetch(process.env.BUYER_API_URL!, {
    headers: {
      Authorization: `Bearer ${process.env.BUYER_API_KEY}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Buyer API error ${res.status}: ${process.env.BUYER_API_URL}`);
  return res.json() as Promise<BuyerAnalyticsResponse>;
}

// ── Public API ─────────────────────────────────────────────────────────────────
// Next.js automatically deduplicates fetch() calls with the same URL+options
// within a single render, so calling multiple getters per page is free.

export async function getBuyerAnalytics(): Promise<BuyerAnalyticsResponse> {
  return fetchBuyerAnalytics();
}

export async function getBuyerOverview(): Promise<BuyerOverview> {
  return (await fetchBuyerAnalytics()).overview;
}

/** Daily revenue for the last 30 days */
export async function getRevenueData(): Promise<RevenuePoint[]> {
  return (await fetchBuyerAnalytics()).revenueTimeSeries.daily;
}

/** Monthly revenue for the last 12 months, shaped as RevenuePoint for RevenueAreaChart */
export async function getMonthlyRevenue(): Promise<RevenuePoint[]> {
  return (await fetchBuyerAnalytics()).revenueTimeSeries.monthly.map((m) => ({
    date: m.month,
    revenue: m.revenue,
  }));
}

/** Weekly revenue shaped for WeeklyVolumeChart */
export async function getWeeklyRevenue(): Promise<WeeklyVolumePoint[]> {
  return (await fetchBuyerAnalytics()).revenueTimeSeries.weekly.map((w) => ({
    week: new Date(w.weekStart + "T12:00:00").toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
    }),
    transactions: Math.round(w.revenue),
  }));
}

/** Order status distribution with Infusio color assignments */
export async function getOrderStatusData(): Promise<OrderStatusPoint[]> {
  return (await fetchBuyerAnalytics()).orderStatusDistribution.map((item) => ({
    status: STATUS_LABELS[item.status] ?? item.status,
    count: item.count,
    color: STATUS_COLORS[item.status] ?? "#d4cfc5",
  }));
}

/** Top 10 products by revenue (from actual purchase orders) */
export async function getTopBuyerProducts(): Promise<BuyerTopProduct[]> {
  return (await fetchBuyerAnalytics()).topProducts;
}

export async function getBuyerFavourites(): Promise<BuyerFavourites> {
  return (await fetchBuyerAnalytics()).favourites;
}
