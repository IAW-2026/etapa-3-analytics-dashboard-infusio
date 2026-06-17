// ── Types matching GET /api/payments/analytics ────────────────────────────────

export interface PaymentTotals {
  orders: number;
  revenue: number;
  accepted: number;
  pending: number;
  cancelled: number;
  uniqueBuyers: number;
  successRate: number;
}

export interface PaymentMonthlyPoint {
  month: number;
  year: number;
  label: string;
  orders: number;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  amount: number;
  status: string;
  buyerId: string;
  sellerAppOrderId: string;
  createdAt: string;
}

export interface PaymentsAnalyticsResponse {
  totals: PaymentTotals;
  monthly: PaymentMonthlyPoint[];
  recentOrders: RecentOrder[];
}

// ── Legacy Compatibility Types ───────────────────────────────────────────────

export interface PaymentStats {
  totalRevenue: number;
  successfulPayments: number;
  failedPayments: number;
  disputed: number;
  refunded: number;
  avgTransactionValue: number;
  conversionRate: number;
}

export interface Dispute {
  id: string;
  paymentId: string;
  orderId: string;
  userName: string;
  amount: number;
  reason: string;
  status: string;
  openedAt: string;
  resolvedAt: string | null;
}

export interface DisputePoint {
  week: string;
  count: number;
}

export interface PaymentMethodPoint {
  method: string;
  count: number;
  percentage: number;
  color: string;
}

// ── Fetch Helper ─────────────────────────────────────────────────────────────

async function fetchPaymentsAnalytics(): Promise<PaymentsAnalyticsResponse> {
  const url = process.env.PAYMENTS_API_URL;
  if (!url) {
    throw new Error("PAYMENTS_API_URL is not configured");
  }

  const res = await fetch(url, {
    headers: {
      "x-api-key": process.env.PAYMENTS_API_KEY || "",
      "Content-Type": "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Payments API error ${res.status}: ${url}`);
  }

  return res.json() as Promise<PaymentsAnalyticsResponse>;
}

// ── Legacy Getters (Mapped to the Real API Response) ─────────────────────────

export async function getPaymentsAnalyticsData(): Promise<PaymentsAnalyticsResponse> {
  try {
    return await fetchPaymentsAnalytics();
  } catch (err) {
    console.error("Failed to fetch payments analytics from API, falling back to mock:", err);
    const { paymentsMock } = await import("@/app/lib/mock/paymentsMock");
    return paymentsMock;
  }
}

export async function getPaymentStats(): Promise<PaymentStats> {
  try {
    const data = await fetchPaymentsAnalytics();
    return {
      totalRevenue: data.totals.revenue,
      successfulPayments: data.totals.accepted,
      failedPayments: data.totals.cancelled,
      disputed: data.totals.pending,
      refunded: 0,
      avgTransactionValue: data.totals.orders > 0 ? data.totals.revenue / data.totals.orders : 0,
      conversionRate: data.totals.successRate,
    };
  } catch (err) {
    console.error("getPaymentStats failed, returning mock:", err);
    const { paymentsMock } = await import("@/app/lib/mock/paymentsMock");
    return {
      totalRevenue: paymentsMock.totals.revenue,
      successfulPayments: paymentsMock.totals.accepted,
      failedPayments: paymentsMock.totals.cancelled,
      disputed: paymentsMock.totals.pending,
      refunded: 0,
      avgTransactionValue: paymentsMock.totals.orders > 0 ? paymentsMock.totals.revenue / paymentsMock.totals.orders : 0,
      conversionRate: paymentsMock.totals.successRate,
    };
  }
}

export async function getRecentDisputes(limit = 8): Promise<Dispute[]> {
  try {
    const data = await fetchPaymentsAnalytics();
    return data.recentOrders.slice(0, limit).map((order) => ({
      id: order.id,
      paymentId: order.id,
      orderId: order.sellerAppOrderId || "N/A",
      userName: order.buyerId,
      amount: order.amount,
      reason: order.sellerAppOrderId || "N/A",
      status: order.status,
      openedAt: order.createdAt,
      resolvedAt: order.status === "accepted" ? order.createdAt : null,
    }));
  } catch (err) {
    console.error("getRecentDisputes failed, returning mock:", err);
    const { paymentsMock } = await import("@/app/lib/mock/paymentsMock");
    return paymentsMock.recentOrders.slice(0, limit).map((order) => ({
      id: order.id,
      paymentId: order.id,
      orderId: order.sellerAppOrderId || "N/A",
      userName: order.buyerId,
      amount: order.amount,
      reason: order.sellerAppOrderId || "N/A",
      status: order.status,
      openedAt: order.createdAt,
      resolvedAt: order.status === "accepted" ? order.createdAt : null,
    }));
  }
}

export async function getDisputesTrend(): Promise<DisputePoint[]> {
  // Unused when using real API charts, but kept for type compatibility
  const { paymentsMock } = await import("@/app/lib/mock/paymentsMock");
  return paymentsMock.monthly.map((m) => ({
    week: m.label,
    count: m.orders,
  }));
}

export async function getPaymentMethods(): Promise<PaymentMethodPoint[]> {
  // Unused when using real API charts, but kept for type compatibility
  return [
    { method: "Tarjeta de crédito", count: 12, percentage: 60, color: "#6b7056" },
    { method: "Tarjeta de débito", count: 5, percentage: 25, color: "#9b4a30" },
    { method: "Transferencia", count: 3, percentage: 15, color: "#7A6C5D" },
  ];
}
