export interface ShippingStats {
  totalShipments: number;
  inTransit: number;
  delivered: number;
  failed: number;
  processing: number;
  avgDeliveryDays: number;
  successRate: number;
}

export interface Shipment {
  id: string;
  orderId: string;
  status: "processing" | "in_transit" | "delivered" | "failed";
  carrier: string;
  destinationCity: string;
  createdAt: string;
  deliveredAt: string | null;
}

export interface ShippingStatusPoint {
  status: string;
  count: number;
  color: string;
}

export interface DeliveryTimePoint {
  days: string;
  count: number;
}

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Shipping API error ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

export async function getShippingStats(): Promise<ShippingStats> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { shippingMock } = await import("@/app/lib/mock/shippingMock");
    return shippingMock.stats;
  }
  return apiFetch<ShippingStats>(`${process.env.SHIPPING_API_URL}/analytics/stats`);
}

export async function getRecentShipments(limit = 15): Promise<Shipment[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { shippingMock } = await import("@/app/lib/mock/shippingMock");
    return shippingMock.recentShipments.slice(0, limit);
  }
  return apiFetch<Shipment[]>(`${process.env.SHIPPING_API_URL}/analytics/shipments?limit=${limit}`);
}

export async function getShippingStatusData(): Promise<ShippingStatusPoint[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { shippingMock } = await import("@/app/lib/mock/shippingMock");
    return shippingMock.statusData;
  }
  return apiFetch<ShippingStatusPoint[]>(`${process.env.SHIPPING_API_URL}/analytics/status`);
}

export async function getDeliveryTimeData(): Promise<DeliveryTimePoint[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { shippingMock } = await import("@/app/lib/mock/shippingMock");
    return shippingMock.deliveryTimeData;
  }
  return apiFetch<DeliveryTimePoint[]>(`${process.env.SHIPPING_API_URL}/analytics/delivery-times`);
}
