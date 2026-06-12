export interface BuyerStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
}

export interface BuyerOrder {
  id: string;
  userId: string;
  userName: string;
  status: "PENDING" | "AWAITING_PAYMENT" | "CONFIRMED" | "CANCELLED";
  total: number;
  createdAt: string;
  items: { productName: string; quantity: number; price: number }[];
}

export interface UserGrowthPoint {
  date: string;
  newUsers: number;
  totalUsers: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface WeeklyVolumePoint {
  week: string;
  transactions: number;
}

export interface OrderStatusPoint {
  status: string;
  count: number;
  color: string;
}

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Buyer API error ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

export async function getBuyerStats(): Promise<BuyerStats> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { buyerMock } = await import("@/app/lib/mock/buyerMock");
    return buyerMock.stats;
  }
  return apiFetch<BuyerStats>(`${process.env.BUYER_API_URL}/analytics/stats`);
}

export async function getRecentOrders(limit = 20): Promise<BuyerOrder[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { buyerMock } = await import("@/app/lib/mock/buyerMock");
    return buyerMock.recentOrders.slice(0, limit);
  }
  return apiFetch<BuyerOrder[]>(`${process.env.BUYER_API_URL}/analytics/orders?limit=${limit}`);
}

export async function getUserGrowth(): Promise<UserGrowthPoint[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { buyerMock } = await import("@/app/lib/mock/buyerMock");
    return buyerMock.userGrowth;
  }
  return apiFetch<UserGrowthPoint[]>(`${process.env.BUYER_API_URL}/analytics/user-growth`);
}

export async function getRevenueData(): Promise<RevenuePoint[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { buyerMock } = await import("@/app/lib/mock/buyerMock");
    return buyerMock.revenueData;
  }
  return apiFetch<RevenuePoint[]>(`${process.env.BUYER_API_URL}/analytics/revenue`);
}

export async function getWeeklyVolume(): Promise<WeeklyVolumePoint[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { buyerMock } = await import("@/app/lib/mock/buyerMock");
    return buyerMock.weeklyVolume;
  }
  return apiFetch<WeeklyVolumePoint[]>(`${process.env.BUYER_API_URL}/analytics/weekly-volume`);
}

export async function getOrderStatusData(): Promise<OrderStatusPoint[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { buyerMock } = await import("@/app/lib/mock/buyerMock");
    return buyerMock.orderStatusData;
  }
  return apiFetch<OrderStatusPoint[]>(`${process.env.BUYER_API_URL}/analytics/order-status`);
}
