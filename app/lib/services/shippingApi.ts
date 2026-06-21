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

export interface Rider {
  id: string;
  name: string;
  email: string;
}

interface ShippingDashboardResponse {
  monthlyShipments: { month: string; envios: number }[];
  latestShipments: { code: string; destination: string; status: string; date: string }[];
  users: { id: string; name: string; email: string }[];
  stats: { total: number; inTransit: number; delivered: number; incidents: number };
}

async function fetchDashboard(): Promise<ShippingDashboardResponse> {
  const res = await fetch(process.env.SHIPPING_API_URL!, {
    headers: { Authorization: `Bearer ${process.env.SHIPPING_API_KEY}` },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Shipping API error ${res.status}`);
  return res.json() as Promise<ShippingDashboardResponse>;
}

const STATUS_MAP: Record<string, Shipment["status"]> = {
  DELIVERED: "delivered",
  CONFIRMED: "in_transit",
  CANCELLED: "failed",
  PENDING: "processing",
};

export async function getShippingStats(): Promise<ShippingStats> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { shippingMock } = await import("@/app/lib/mock/shippingMock");
    return shippingMock.stats;
  }
  const data = await fetchDashboard();
  const { total, inTransit, delivered, incidents } = data.stats;
  const processing = Math.max(0, total - inTransit - delivered - incidents);
  const successRate = total > 0 ? Math.round((delivered / total) * 100) : 0;
  return {
    totalShipments: total,
    inTransit,
    delivered,
    failed: incidents,
    processing,
    avgDeliveryDays: 0,
    successRate,
  };
}

export async function getRecentShipments(limit = 15): Promise<Shipment[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { shippingMock } = await import("@/app/lib/mock/shippingMock");
    return shippingMock.recentShipments.slice(0, limit);
  }
  const data = await fetchDashboard();
  return data.latestShipments.slice(0, limit).map((s) => ({
    id: s.code,
    orderId: "",
    status: STATUS_MAP[s.status] ?? "processing",
    carrier: "",
    destinationCity: s.destination,
    createdAt: s.date,
    deliveredAt: s.status === "DELIVERED" ? s.date : null,
  }));
}

export async function getShippingStatusData(): Promise<ShippingStatusPoint[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { shippingMock } = await import("@/app/lib/mock/shippingMock");
    return shippingMock.statusData;
  }
  const data = await fetchDashboard();
  const { total, inTransit, delivered, incidents } = data.stats;
  const processing = Math.max(0, total - inTransit - delivered - incidents);
  return [
    { status: "Entregado", count: delivered, color: "#6b7056" },
    { status: "En tránsito", count: inTransit, color: "#9b4a30" },
    { status: "Incidente", count: incidents, color: "#b07d62" },
    { status: "En proceso", count: processing, color: "#7A6C5D" },
  ].filter((item) => item.count > 0);
}

export async function getDeliveryTimeData(): Promise<DeliveryTimePoint[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { shippingMock } = await import("@/app/lib/mock/shippingMock");
    return shippingMock.deliveryTimeData;
  }
  const data = await fetchDashboard();
  return data.monthlyShipments
    .filter((m) => m.envios > 0)
    .map((m) => ({ days: m.month, count: m.envios }));
}

export async function getRiders(): Promise<Rider[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { shippingMock } = await import("@/app/lib/mock/shippingMock");
    return shippingMock.riders;
  }
  const data = await fetchDashboard();
  return data.users.filter((u) => u.name.toLowerCase() === "rider");
}
