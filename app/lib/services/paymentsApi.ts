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
  status: "open" | "resolved" | "rejected";
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

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Payments API error ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

export async function getPaymentStats(): Promise<PaymentStats> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { paymentsMock } = await import("@/app/lib/mock/paymentsMock");
    return paymentsMock.stats;
  }
  return apiFetch<PaymentStats>(`${process.env.PAYMENTS_API_URL}/analytics/stats`);
}

export async function getRecentDisputes(limit = 8): Promise<Dispute[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { paymentsMock } = await import("@/app/lib/mock/paymentsMock");
    return paymentsMock.recentDisputes.slice(0, limit);
  }
  return apiFetch<Dispute[]>(`${process.env.PAYMENTS_API_URL}/analytics/disputes?limit=${limit}`);
}

export async function getDisputesTrend(): Promise<DisputePoint[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { paymentsMock } = await import("@/app/lib/mock/paymentsMock");
    return paymentsMock.disputesTrend;
  }
  return apiFetch<DisputePoint[]>(`${process.env.PAYMENTS_API_URL}/analytics/disputes-trend`);
}

export async function getPaymentMethods(): Promise<PaymentMethodPoint[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { paymentsMock } = await import("@/app/lib/mock/paymentsMock");
    return paymentsMock.paymentMethods;
  }
  return apiFetch<PaymentMethodPoint[]>(`${process.env.PAYMENTS_API_URL}/analytics/payment-methods`);
}
